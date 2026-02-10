import type {
    ProvisionClawParams,
    ProvisionClawResponse
} from '@/ts/Interfaces'
import type { ProviderType } from '@/ts/Types'

import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { claws, pendingClaws, sshKeys, volumes } from '@/db/schema'
import { getProvider } from '@/services/provider'
import { cloudflare } from '@/services/cloudflare'
import {
    generateSlug,
    generateToken,
    generateCloudInit,
    DOMAIN
} from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'

export async function provisionClaw(
    params: ProvisionClawParams
): Promise<ProvisionClawResponse> {
    try {
        const existingClaw = await db
            .select()
            .from(claws)
            .where(eq(claws.polarSubscriptionId, params.subscriptionId))
            .limit(1)

        if (existingClaw[0]) {
            return { success: true, clawId: existingClaw[0].id }
        }

        const claimed = await db
            .delete(pendingClaws)
            .where(eq(pendingClaws.id, params.pendingClawId))
            .returning()

        if (!claimed[0]) {
            return { success: false, error: t('api.pendingClawNotFound') }
        }

        const pending = claimed[0]

        const providerName = (pending.provider || 'hetzner') as ProviderType
        const provider = getProvider(providerName)

        const id = crypto.randomUUID()
        const subdomain = generateSlug(id)
        const gatewayToken = generateToken()

        let providerSshKeyIds: number[] | undefined
        if (pending.sshKeyId) {
            const sshKey = await db
                .select()
                .from(sshKeys)
                .where(eq(sshKeys.id, pending.sshKeyId))
                .limit(1)

            if (sshKey[0]) {
                const keyId =
                    providerName === 'digitalocean'
                        ? sshKey[0].digitaloceanKeyId
                        : providerName === 'vultr'
                          ? sshKey[0].vultrKeyId
                          : sshKey[0].providerKeyId
                if (keyId) {
                    providerSshKeyIds = [keyId]
                }
            }
        }

        const cloudInitScript = generateCloudInit(
            pending.rootPassword || '',
            subdomain,
            DOMAIN,
            gatewayToken,
            pending.model || undefined,
            pending.apiToken || undefined
        )

        const { serverId, ip } = await provider.createServer(
            `${pending.name}-${id.slice(0, 8)}`,
            pending.planId,
            pending.location,
            pending.rootPassword || undefined,
            providerSshKeyIds,
            '',
            cloudInitScript
        )

        try {
            await cloudflare.createDNSRecord(subdomain, ip)
        } catch (dnsErr) {
            console.error('Failed to create DNS record:', dnsErr)
        }

        await db.insert(claws).values({
            id,
            userId: pending.userId,
            name: pending.name,
            provider: providerName,
            providerServerId: serverId.toString(),
            status: 'configuring',
            ip,
            planId: pending.planId,
            location: pending.location,
            rootPassword: pending.rootPassword,
            sshKeyId: pending.sshKeyId,
            subdomain,
            gatewayToken,
            model: pending.model,
            polarSubscriptionId: params.subscriptionId,
            polarProductId: params.productId,
            polarCustomerId: params.customerId,
            subscriptionStatus: 'active'
        })

        if (pending.volumeSize && pending.volumeSize >= 10) {
            try {
                const volumeId = crypto.randomUUID()
                const providerVolume = await provider.createVolume(
                    `${pending.name}-vol-${volumeId.slice(0, 8)}`,
                    pending.volumeSize,
                    pending.location,
                    serverId
                )

                await db.insert(volumes).values({
                    id: volumeId,
                    userId: pending.userId,
                    clawId: id,
                    name: `${pending.name}-storage`,
                    size: pending.volumeSize,
                    providerVolumeId: providerVolume.id,
                    location: pending.location,
                    status: 'available'
                })
            } catch (volumeErr) {
                console.error('Failed to create volume:', volumeErr)
            }
        }

        return { success: true, clawId: id }
    } catch (err) {
        console.error('Provision claw error:', err)
        return {
            success: false,
            error:
                err instanceof Error
                    ? err.message
                    : t('api.failedToProvisionClaw')
        }
    }
}