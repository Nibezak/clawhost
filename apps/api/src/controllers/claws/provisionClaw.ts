import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { claws, pendingClaws, sshKeys, volumes } from '@/db/schema'
import { hetzner } from '@/services/hetzner'
import { cloudflare } from '@/services/cloudflare'
import {
    generateSlug,
    generateToken,
    generateCloudInit,
    DOMAIN
} from './helpers/index'
import type {
    ProvisionClawParams,
    ProvisionClawResponse
} from '@/ts/Interfaces'
import { t } from '@openclaw/i18n'

export async function provisionClaw(
    params: ProvisionClawParams
): Promise<ProvisionClawResponse> {
    try {
        const pendingClaw = await db
            .select()
            .from(pendingClaws)
            .where(eq(pendingClaws.id, params.pendingClawId))
            .limit(1)

        if (!pendingClaw[0]) {
            return { success: false, error: t('api.pendingClawNotFound') }
        }

        const pending = pendingClaw[0]

        const existingClaw = await db
            .select()
            .from(claws)
            .where(eq(claws.polarSubscriptionId, params.subscriptionId))
            .limit(1)

        if (existingClaw[0]) {
            return { success: true, clawId: existingClaw[0].id }
        }

        const id = crypto.randomUUID()
        const subdomain = generateSlug(id)
        const gatewayToken = generateToken()

        let hetznerSshKeyIds: number[] | undefined
        if (pending.sshKeyId) {
            const sshKey = await db
                .select()
                .from(sshKeys)
                .where(eq(sshKeys.id, pending.sshKeyId))
                .limit(1)

            if (sshKey[0]?.hetznerKeyId) {
                hetznerSshKeyIds = [sshKey[0].hetznerKeyId]
            }
        }

        const cloudInitScript = generateCloudInit(
            pending.rootPassword || '',
            subdomain,
            DOMAIN,
            gatewayToken
        )

        const { serverId, ip } = await hetzner.createServer(
            `${pending.name}-${id.slice(0, 8)}`,
            pending.planId,
            pending.location,
            pending.rootPassword || undefined,
            hetznerSshKeyIds,
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
            hetznerServerId: serverId.toString(),
            status: 'running',
            ip,
            planId: pending.planId,
            location: pending.location,
            rootPassword: pending.rootPassword,
            sshKeyId: pending.sshKeyId,
            subdomain,
            gatewayToken,
            polarSubscriptionId: params.subscriptionId,
            polarProductId: params.productId,
            polarCustomerId: params.customerId,
            subscriptionStatus: 'active'
        })

        if (pending.volumeSize && pending.volumeSize >= 10) {
            try {
                const volumeId = crypto.randomUUID()
                const hetznerVolume = await hetzner.createVolume(
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
                    hetznerVolumeId: hetznerVolume.id,
                    location: pending.location,
                    status: 'available'
                })
            } catch (volumeErr) {
                console.error('Failed to create volume:', volumeErr)
            }
        }

        await db
            .delete(pendingClaws)
            .where(eq(pendingClaws.id, params.pendingClawId))

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