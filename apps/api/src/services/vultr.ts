import type {
    CloudProvider,
    VultrInstanceResponse,
    VultrInstancesResponse,
    VultrPlansResponse,
    VultrRegionsResponse,
    VultrSSHKeyResponse,
    VultrVolumeResponse,
    ServerStatus,
    CreateServerResult,
    ServerTypeInfo,
    LocationInfo,
    CreateSSHKeyResult,
    VolumeInfo,
    VolumeDetails,
    VolumePricingResult,
    RawServerType,
    DatacenterAvailability
} from '@/ts/Interfaces'

import { RequestClient, clawStatus } from '@openclaw/shared'

const getClient = () => {
    const token = process.env.VULTR_API_TOKEN
    if (!token) {
        throw new Error('VULTR_API_TOKEN is not set')
    }

    return new RequestClient({
        baseUrl: 'https://api.vultr.com/v2',
        getHeaders: () => ({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        })
    })
}

const mapStatus = (vultrStatus: string): string => {
    const statusMap: Record<string, string> = {
        active: clawStatus.running,
        pending: clawStatus.initializing,
        suspended: clawStatus.stopped,
        resizing: clawStatus.migrating,
        halted: clawStatus.off
    }
    return statusMap[vultrStatus] || vultrStatus
}

const UBUNTU_2404_OS_ID = 2284

const vultr: CloudProvider = {
    async createServer(
        name: string,
        serverType: string,
        location: string,
        rootPassword?: string,
        sshKeyIds?: number[],
        _snapshotId?: string,
        userData?: string
    ): Promise<CreateServerResult> {
        const body: Record<string, unknown> = {
            label: name,
            plan: serverType,
            region: location,
            os_id: UBUNTU_2404_OS_ID
        }

        if (sshKeyIds?.length) {
            body.sshkey_id = sshKeyIds.map(String)
        }

        if (userData) {
            body.user_data = Buffer.from(userData).toString('base64')
        }

        const data = await getClient().post<VultrInstanceResponse>(
            '/instances',
            body
        )

        let ip = data.instance.main_ip

        if (!ip || ip === '0.0.0.0') {
            for (let i = 0; i < 30; i++) {
                await new Promise((r) => setTimeout(r, 5000))
                try {
                    const poll = await getClient().get<VultrInstanceResponse>(
                        `/instances/${data.instance.id}`
                    )
                    ip = poll.instance.main_ip
                    if (ip && ip !== '0.0.0.0') break
                } catch {
                    continue
                }
            }
        }

        return {
            serverId: parseInt(data.instance.id, 10) || 0,
            ip: ip || '',
            rootPassword: rootPassword || ''
        }
    },

    async getServer(serverId: string): Promise<ServerStatus> {
        const data = await getClient().get<VultrInstanceResponse>(
            `/instances/${serverId}`
        )
        return {
            status: mapStatus(data.instance.status),
            ip: data.instance.main_ip
        }
    },

    async getServers(): Promise<Map<string, ServerStatus>> {
        const result = new Map<string, ServerStatus>()
        let cursor = ''
        let hasMore = true

        while (hasMore) {
            const url = cursor
                ? `/instances?per_page=100&cursor=${cursor}`
                : '/instances?per_page=100'
            const data = await getClient().get<VultrInstancesResponse>(url)

            for (const instance of data.instances) {
                result.set(instance.id, {
                    status: mapStatus(instance.status),
                    ip: instance.main_ip
                })
            }

            cursor = data.meta?.links?.next || ''
            hasMore = !!cursor
        }

        return result
    },

    async startServer(serverId: string): Promise<void> {
        await getClient().post(`/instances/${serverId}/start`)
    },

    async stopServer(serverId: string): Promise<void> {
        await getClient().post(`/instances/${serverId}/halt`)
    },

    async restartServer(serverId: string): Promise<void> {
        await getClient().post(`/instances/${serverId}/reboot`)
    },

    async deleteServer(serverId: string): Promise<void> {
        await getClient().delete(`/instances/${serverId}`)
    },

    async getServerTypes(): Promise<ServerTypeInfo[]> {
        const data = await getClient().get<VultrPlansResponse>(
            '/plans?per_page=500'
        )

        return data.plans.map((p) => {
            const memGb = p.ram / 1024
            return {
                name: p.id,
                description: p.id.toUpperCase().replace(/-/g, ' '),
                cores: p.vcpu_count,
                memory: memGb,
                disk: p.disk,
                architecture: 'x86',
                priceHourly: p.monthly_cost / 730,
                priceMonthly: p.monthly_cost
            }
        })
    },

    async getLocations(): Promise<LocationInfo[]> {
        const data = await getClient().get<VultrRegionsResponse>('/regions')

        return data.regions.map((r) => ({
            id: r.id,
            name: `${r.city}, ${r.country}`,
            city: r.city,
            country: r.country,
            disabled: false
        }))
    },

    async getRawServerTypes(): Promise<RawServerType[]> {
        const data = await getClient().get<VultrPlansResponse>(
            '/plans?per_page=500'
        )
        return data.plans.map((p, i) => ({
            id: i + 1,
            name: p.id
        }))
    },

    async getDatacenters(): Promise<DatacenterAvailability[]> {
        const [regions, plans] = await Promise.all([
            getClient().get<VultrRegionsResponse>('/regions'),
            getClient().get<VultrPlansResponse>('/plans?per_page=500')
        ])

        const planNameToId = new Map<string, number>()
        plans.plans.forEach((p, i) => planNameToId.set(p.id, i + 1))

        return regions.regions.map((r) => ({
            name: r.id,
            locationName: r.id,
            availableServerTypeIds: plans.plans
                .filter((p) => p.locations.includes(r.id))
                .map((p) => planNameToId.get(p.id))
                .filter((id): id is number => id !== undefined)
        }))
    },

    async createSSHKey(
        name: string,
        publicKey: string
    ): Promise<CreateSSHKeyResult> {
        const data = await getClient().post<VultrSSHKeyResponse>('/ssh-keys', {
            name,
            ssh_key: publicKey
        })

        return {
            id: parseInt(data.ssh_key.id, 10) || 0,
            name: data.ssh_key.name,
            fingerprint: ''
        }
    },

    async deleteSSHKey(keyId: number): Promise<void> {
        await getClient().delete(`/ssh-keys/${keyId}`)
    },

    async getVolumePricing(): Promise<VolumePricingResult> {
        return {
            pricePerGbMonthly: 0.1
        }
    },

    async createVolume(
        name: string,
        size: number,
        location: string,
        serverId?: number
    ): Promise<VolumeInfo> {
        const body: Record<string, unknown> = {
            label: name,
            size_gb: size,
            region: location,
            block_type: 'storage_opt'
        }

        const data = await getClient().post<VultrVolumeResponse>(
            '/blocks',
            body
        )

        if (serverId) {
            await getClient().post(`/blocks/${data.block.id}/attach`, {
                instance_id: String(serverId)
            })
        }

        return {
            id: parseInt(data.block.id, 10) || 0,
            size: data.block.size_gb,
            location: data.block.region
        }
    },

    async attachVolume(volumeId: number, serverId: number): Promise<void> {
        await getClient().post(`/blocks/${volumeId}/attach`, {
            instance_id: String(serverId)
        })
    },

    async detachVolume(volumeId: number): Promise<void> {
        await getClient().post(`/blocks/${volumeId}/detach`)
    },

    async deleteVolume(volumeId: number): Promise<void> {
        await getClient().delete(`/blocks/${volumeId}`)
    },

    async getVolume(volumeId: number): Promise<VolumeDetails> {
        const data = await getClient().get<VultrVolumeResponse>(
            `/blocks/${volumeId}`
        )
        return {
            id: parseInt(data.block.id, 10) || 0,
            size: data.block.size_gb,
            status:
                data.block.status === 'active'
                    ? 'available'
                    : data.block.status,
            serverId: data.block.attached_to_instance
                ? parseInt(data.block.attached_to_instance, 10) || null
                : null
        }
    }
}

export default vultr