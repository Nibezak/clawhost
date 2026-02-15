import type { CreateClawBody } from '@/ts/Interfaces'
import type { AuthenticatedContext } from '@/ts/Types'

import { eq, and, count } from 'drizzle-orm'
import { db } from '@/db'
import { claws, sshKeys, volumes } from '@/db/schema'
import { getProvider } from '@/services/provider'
import cloudflare from '@/services/cloudflare'
import {
    generateSlug,
    generatePassword,
    generateCloudInit,
    generateToken,
    DOMAIN
} from '@/controllers/claws/helpers'
import { ok, fail } from '@/lib/response'
import { t } from '@openclaw/i18n'

const createClaw = async (c: AuthenticatedContext) => {
    try {
        const userId = c.get('userId')
        const {
            name,
            provider: providerName,
            planId,
            location,
            password,
            sshKeyId,
            volumeSize,
            model,
            apiToken
        } = await c.req.json<CreateClawBody>()

        if (!name || !planId || !location) {
            return fail(c, t('api.missingRequiredFields'), 400)
        }

        if (
            volumeSize !== undefined &&
            (volumeSize < 10 || volumeSize > 10240)
        ) {
            return fail(c, t('api.volumeSizeInvalid'), 400)
        }

        const provider = getProvider(providerName || 'hetzner')

        const [clawCountResult, serverTypes, sshKeyResult] = await Promise.all([
            db
                .select({ value: count() })
                .from(claws)
                .where(eq(claws.userId, userId)),
            provider.getServerTypes(),
            sshKeyId
                ? db
                      .select()
                      .from(sshKeys)
                      .where(
                          and(
                              eq(sshKeys.id, sshKeyId),
                              eq(sshKeys.userId, userId)
                          )
                      )
                      .limit(1)
                : Promise.resolve(null)
        ])

        const MAX_CLAWS_PER_ACCOUNT = 50
        if (clawCountResult[0].value >= MAX_CLAWS_PER_ACCOUNT) {
            return fail(c, t('api.clawLimitReached'), 400)
        }

        const MIN_MEMORY_GB = 4
        const selectedPlan = serverTypes.find((st) => st.name === planId)

        if (!selectedPlan) {
            return fail(c, t('api.invalidPlan'), 400)
        }

        if (selectedPlan.memory < MIN_MEMORY_GB) {
            return fail(c, t('api.planBelowMinimumMemory'), 400)
        }

        const id = crypto.randomUUID()
        const subdomain = generateSlug(id)
        const finalPassword = password || generatePassword()

        let providerSshKeyIds: number[] | undefined
        if (sshKeyResult && sshKeyResult[0]) {
            const keyId =
                providerName === 'digitalocean'
                    ? sshKeyResult[0].digitaloceanKeyId
                    : providerName === 'vultr'
                      ? sshKeyResult[0].vultrKeyId
                      : sshKeyResult[0].providerKeyId
            if (keyId) {
                providerSshKeyIds = [keyId]
            }
        }

        const gatewayToken = generateToken()
        const cloudInitScript = generateCloudInit(
            finalPassword,
            subdomain,
            DOMAIN,
            gatewayToken,
            model || undefined,
            apiToken || undefined
        )

        const { serverId, ip } = await provider.createServer(
            `${name}-${id.slice(0, 8)}`,
            planId,
            location,
            finalPassword,
            providerSshKeyIds,
            '',
            cloudInitScript
        )

        await Promise.all([
            cloudflare
                .createDNSRecord(subdomain, ip)
                .catch((dnsErr) =>
                    console.error('Failed to create DNS record:', dnsErr)
                ),
            db.insert(claws).values({
                id,
                userId,
                name,
                provider: providerName || 'hetzner',
                providerServerId: serverId.toString(),
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
        ])

        let createdVolume = null
        if (volumeSize && volumeSize >= 10) {
            try {
                const volumeId = crypto.randomUUID()
                const providerVolume = await provider.createVolume(
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
                    providerVolumeId: providerVolume.id,
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
            }
        }

        return ok(
            c,
            {
                id,
                name,
                provider: providerName || 'hetzner',
                status: 'configuring',
                ip,
                planId,
                location,
                subdomain,
                url: `https://${subdomain}.${DOMAIN}`,
                createdAt: new Date().toISOString(),
                rootPassword: finalPassword,
                volume: createdVolume
            },
            t('api.clawCreated')
        )
    } catch {
        return fail(c, t('api.failedToCreateClaw'), 500)
    }
}

export default createClaw