import type {
    CloudProvider,
    DigitalOceanDropletResponse,
    DigitalOceanDropletsResponse,
    DigitalOceanRegionsResponse,
    DigitalOceanSizesResponse,
    DigitalOceanSSHKeyResponse,
    DigitalOceanVolumeResponse,
    ServerStatus,
    CreateServerResult,
    ServerTypeInfo,
    LocationInfo,
    CreateSSHKeyResult,
    VolumeInfo,
    VolumeDetails,
    VolumePricingResult,
    RawServerType,
    DatacenterAvailability,
    RegionMeta
} from '@/ts/Interfaces'

import { RequestClient, clawStatus } from '@openclaw/shared'

function getClient() {
    const token = process.env.DIGITALOCEAN_API_TOKEN
    if (!token) {
        throw new Error('DIGITALOCEAN_API_TOKEN is not set')
    }

    return new RequestClient({
        baseUrl: 'https://api.digitalocean.com/v2',
        getHeaders: () => ({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        })
    })
}

function getPublicIp(droplet: DigitalOceanDropletResponse['droplet']): string {
    const v4 = droplet.networks.v4.find((n) => n.type === 'public')
    return v4?.ip_address || ''
}

function mapStatus(doStatus: string): string {
    const statusMap: Record<string, string> = {
        new: clawStatus.initializing,
        active: clawStatus.running,
        off: clawStatus.off,
        archive: clawStatus.stopped
    }
    return statusMap[doStatus] || doStatus
}

const digitalocean: CloudProvider = {
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
            name,
            size: serverType,
            region: location,
            image: 'ubuntu-24-04-x64'
        }

        if (sshKeyIds?.length) {
            body.ssh_keys = sshKeyIds
        }

        if (userData) {
            body.user_data = userData
        }

        const data = await getClient().post<DigitalOceanDropletResponse>(
            '/droplets',
            body
        )

        let ip = getPublicIp(data.droplet)

        if (!ip) {
            for (let i = 0; i < 30; i++) {
                await new Promise((r) => setTimeout(r, 5000))
                try {
                    const poll =
                        await getClient().get<DigitalOceanDropletResponse>(
                            `/droplets/${data.droplet.id}`
                        )
                    ip = getPublicIp(poll.droplet)
                    if (ip) break
                } catch {
                    continue
                }
            }
        }

        return {
            serverId: data.droplet.id,
            ip,
            rootPassword: rootPassword || ''
        }
    },

    async getServer(serverId: string): Promise<ServerStatus> {
        const data = await getClient().get<DigitalOceanDropletResponse>(
            `/droplets/${serverId}`
        )
        return {
            status: mapStatus(data.droplet.status),
            ip: getPublicIp(data.droplet)
        }
    },

    async getServers(): Promise<Map<string, ServerStatus>> {
        const result = new Map<string, ServerStatus>()
        let page = 1
        let hasMore = true
        while (hasMore) {
            const data = await getClient().get<DigitalOceanDropletsResponse>(
                `/droplets?per_page=200&page=${page}`
            )
            for (const droplet of data.droplets) {
                result.set(String(droplet.id), {
                    status: mapStatus(droplet.status),
                    ip: getPublicIp(droplet)
                })
            }
            hasMore = data.links.pages?.next !== undefined
            page++
        }
        return result
    },

    async startServer(serverId: string): Promise<void> {
        await getClient().post(`/droplets/${serverId}/actions`, {
            type: 'power_on'
        })
    },

    async stopServer(serverId: string): Promise<void> {
        await getClient().post(`/droplets/${serverId}/actions`, {
            type: 'shutdown'
        })
    },

    async restartServer(serverId: string): Promise<void> {
        await getClient().post(`/droplets/${serverId}/actions`, {
            type: 'reboot'
        })
    },

    async deleteServer(serverId: string): Promise<void> {
        await getClient().delete(`/droplets/${serverId}`)
    },

    async getServerTypes(): Promise<ServerTypeInfo[]> {
        const data = await getClient().get<DigitalOceanSizesResponse>(
            '/sizes?per_page=200'
        )

        const planNames: Record<string, string> = {
            's-1vcpu-512mb-10gb': 'DC11',
            's-1vcpu-1gb': 'DC12',
            's-1vcpu-2gb': 'DC13',
            's-2vcpu-2gb': 'DC21',
            's-2vcpu-4gb': 'DC22',
            's-4vcpu-8gb': 'DC41',
            's-8vcpu-16gb': 'DC81'
        }

        return data.sizes
            .filter((s) => s.available)
            .map((s) => {
                const memGb = s.memory / 1024
                return {
                    name: s.slug,
                    description: planNames[s.slug] || s.slug.toUpperCase(),
                    cores: s.vcpus,
                    memory: memGb,
                    disk: s.disk,
                    architecture: 'x86',
                    priceHourly: s.price_hourly,
                    priceMonthly: s.price_monthly
                }
            })
    },

    async getLocations(): Promise<LocationInfo[]> {
        const data =
            await getClient().get<DigitalOceanRegionsResponse>('/regions')

        const regionMeta: Record<string, RegionMeta> = {
            nyc1: { city: 'New York 1', country: 'US' },
            nyc2: { city: 'New York 2', country: 'US' },
            nyc3: { city: 'New York 3', country: 'US' },
            sfo1: { city: 'San Francisco 1', country: 'US' },
            sfo2: { city: 'San Francisco 2', country: 'US' },
            sfo3: { city: 'San Francisco 3', country: 'US' },
            ams2: { city: 'Amsterdam 2', country: 'NL' },
            ams3: { city: 'Amsterdam 3', country: 'NL' },
            sgp1: { city: 'Singapore', country: 'SG' },
            lon1: { city: 'London', country: 'GB' },
            fra1: { city: 'Frankfurt', country: 'DE' },
            tor1: { city: 'Toronto', country: 'CA' },
            blr1: { city: 'Bangalore', country: 'IN' },
            syd1: { city: 'Sydney', country: 'AU' },
            atl1: { city: 'Atlanta 1', country: 'US' }
        }

        return data.regions.map((r) => {
            const meta = regionMeta[r.slug]
            return {
                id: r.slug,
                name: r.name,
                city: meta?.city || r.name,
                country: meta?.country || '',
                disabled: !r.available
            }
        })
    },

    async getRawServerTypes(): Promise<RawServerType[]> {
        const data = await getClient().get<DigitalOceanSizesResponse>(
            '/sizes?per_page=200'
        )
        return data.sizes.map((s, i) => ({
            id: i + 1,
            name: s.slug
        }))
    },

    async getDatacenters(): Promise<DatacenterAvailability[]> {
        const [regions, sizes] = await Promise.all([
            getClient().get<DigitalOceanRegionsResponse>('/regions'),
            getClient().get<DigitalOceanSizesResponse>('/sizes?per_page=200')
        ])

        const sizeNameToId = new Map<string, number>()
        sizes.sizes.forEach((s, i) => sizeNameToId.set(s.slug, i + 1))

        return regions.regions.map((r) => ({
            name: r.slug,
            locationName: r.slug,
            availableServerTypeIds: r.sizes
                .map((s) => sizeNameToId.get(s))
                .filter((id): id is number => id !== undefined)
        }))
    },

    async createSSHKey(
        name: string,
        publicKey: string
    ): Promise<CreateSSHKeyResult> {
        const data = await getClient().post<DigitalOceanSSHKeyResponse>(
            '/account/keys',
            {
                name,
                public_key: publicKey
            }
        )

        return {
            id: data.ssh_key.id,
            name: data.ssh_key.name,
            fingerprint: data.ssh_key.fingerprint
        }
    },

    async deleteSSHKey(keyId: number): Promise<void> {
        await getClient().delete(`/account/keys/${keyId}`)
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
            name,
            size_gigabytes: size,
            region: location,
            filesystem_type: 'ext4'
        }

        const data = await getClient().post<DigitalOceanVolumeResponse>(
            '/volumes',
            body
        )

        if (serverId) {
            await getClient().post(`/volumes/${data.volume.id}/actions`, {
                type: 'attach',
                droplet_id: serverId
            })
        }

        return {
            id: parseInt(data.volume.id, 10) || 0,
            size: data.volume.size_gigabytes,
            location: data.volume.region.slug
        }
    },

    async attachVolume(volumeId: number, serverId: number): Promise<void> {
        await getClient().post(`/volumes/${volumeId}/actions`, {
            type: 'attach',
            droplet_id: serverId
        })
    },

    async detachVolume(volumeId: number): Promise<void> {
        await getClient().post(`/volumes/${volumeId}/actions`, {
            type: 'detach'
        })
    },

    async deleteVolume(volumeId: number): Promise<void> {
        await getClient().delete(`/volumes/${volumeId}`)
    },

    async getVolume(volumeId: number): Promise<VolumeDetails> {
        const data = await getClient().get<DigitalOceanVolumeResponse>(
            `/volumes/${volumeId}`
        )
        return {
            id: parseInt(data.volume.id, 10) || 0,
            size: data.volume.size_gigabytes,
            status: 'available',
            serverId: data.volume.droplet_ids[0] || null
        }
    }
}

export default digitalocean