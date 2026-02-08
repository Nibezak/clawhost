import type { Context } from 'hono'
import type { CreateClawBody } from '@/ts/Interfaces'

import { eq, and, count } from 'drizzle-orm'
import { db } from '@/db'
import { claws, sshKeys, volumes } from '@/db/schema'
import { hetzner } from '@/services/hetzner'
import { cloudflare } from '@/services/cloudflare'
import {
    generateSlug,
    generatePassword,
    generateCloudInit,
    generateToken,
    DOMAIN
} from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'

const createClaw = async (c: Context<{ Variables: { userId: string } }>) => {
    try {
        const userId = c.get('userId')
        const {
            name,
            planId,
            location,
            password,
            sshKeyId,
            volumeSize,
            model,
            apiToken
        } = await c.req.json<CreateClawBody>()

        if (!name || !planId || !location) {
            return c.json({ error: t('api.missingRequiredFields') }, 400)
        }

        // Check claw limit
        const MAX_CLAWS_PER_ACCOUNT = 50
        const [{ value: clawCount }] = await db
            .select({ value: count() })
            .from(claws)
            .where(eq(claws.userId, userId))

        if (clawCount >= MAX_CLAWS_PER_ACCOUNT) {
            return c.json(
                {
                    error: t('api.clawLimitReached')
                },
                400
            )
        }

        // Validate volume size if provided
        if (
            volumeSize !== undefined &&
            (volumeSize < 10 || volumeSize > 10240)
        ) {
            return c.json({ error: t('api.volumeSizeInvalid') }, 400)
        }

        // Generate claw ID and subdomain
        const id = crypto.randomUUID()
        const subdomain = generateSlug(id)

        // Use provided password or generate a secure one
        const finalPassword = password || generatePassword()

        // Look up SSH key if provided
        let hetznerSshKeyIds: number[] | undefined
        if (sshKeyId) {
            const sshKey = await db
                .select()
                .from(sshKeys)
                .where(
                    and(eq(sshKeys.id, sshKeyId), eq(sshKeys.userId, userId))
                )
                .limit(1)

            if (sshKey[0]?.hetznerKeyId) {
                hetznerSshKeyIds = [sshKey[0].hetznerKeyId]
            }
        }

        // Generate gateway token for owner authentication
        const gatewayToken = generateToken()

        // Generate cloud-init with subdomain for SSL and gateway token
        const cloudInitScript = generateCloudInit(
            finalPassword,
            subdomain,
            DOMAIN,
            gatewayToken,
            model || undefined,
            apiToken || undefined
        )

        // Create in Hetzner with our password and optional SSH key
        const { serverId, ip } = await hetzner.createServer(
            `${name}-${id.slice(0, 8)}`,
            planId,
            location,
            finalPassword,
            hetznerSshKeyIds,
            '',
            cloudInitScript
        )

        // Create DNS record in Cloudflare pointing subdomain to claw IP
        try {
            await cloudflare.createDNSRecord(subdomain, ip)
        } catch (dnsErr) {
            console.error('Failed to create DNS record:', dnsErr)
            // Continue anyway - DNS can be added manually if needed
        }

        // Save claw to database
        await db.insert(claws).values({
            id,
            userId,
            name,
            hetznerServerId: serverId.toString(),
            status: 'configuring',
            ip,
            planId,
            location,
            rootPassword: finalPassword,
            sshKeyId: sshKeyId || null,
            subdomain,
            gatewayToken,
            model: model || null
        })

        // Create volume if requested
        let createdVolume = null
        if (volumeSize && volumeSize >= 10) {
            try {
                const volumeId = crypto.randomUUID()
                const hetznerVolume = await hetzner.createVolume(
                    `${name}-vol-${volumeId.slice(0, 8)}`,
                    volumeSize,
                    location,
                    serverId
                )

                await db.insert(volumes).values({
                    id: volumeId,
                    userId,
                    clawId: id,
                    name: `${name}-storage`,
                    size: volumeSize,
                    hetznerVolumeId: hetznerVolume.id,
                    location,
                    status: 'available'
                })

                createdVolume = {
                    id: volumeId,
                    size: volumeSize,
                    name: `${name}-storage`
                }
            } catch (volumeErr) {
                console.error('Failed to create volume:', volumeErr)
                // Continue without volume - claw is already created
            }
        }

        return c.json({
            id,
            name,
            status: 'configuring',
            ip,
            planId,
            location,
            subdomain,
            url: `https://${subdomain}.${DOMAIN}`,
            createdAt: new Date().toISOString(),
            rootPassword: finalPassword,
            gatewayToken,
            volume: createdVolume
        })
    } catch (err) {
        console.error('Create claw error:', err)
        return c.json(
            {
                error:
                    err instanceof Error
                        ? err.message
                        : t('api.failedToCreateClaw')
            },
            500
        )
    }
}

export default createClaw