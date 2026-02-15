import type { AuthenticatedContext, ProviderType } from '@/ts/Types'
import type { BillingPeriod, ServerStatus } from '@/ts/Interfaces'

import { desc } from 'drizzle-orm'
import { eq } from 'drizzle-orm'
import { clawStatus } from '@openclaw/shared'
import { db } from '@/db'
import { claws, users, volumes } from '@/db/schema'
import { getProvider } from '@/services/provider'
import cloudflare from '@/services/cloudflare'
import { checkSubdomainReady, sanitizeClaw } from '@/controllers/claws/helpers'
import subscriptions from '@/lib/polar/subscriptions'
import { ok } from '@/lib/response'
import { t } from '@openclaw/i18n'

const transitionCompletedBy: Record<string, string[]> = {
    [clawStatus.stopping]: [clawStatus.off, clawStatus.stopped],
    [clawStatus.starting]: [clawStatus.running],
    [clawStatus.creating]: [clawStatus.running],
    [clawStatus.initializing]: [clawStatus.running],
    [clawStatus.migrating]: [clawStatus.running],
    [clawStatus.rebuilding]: [clawStatus.running]
}

const getAdminClaws = async (c: AuthenticatedContext) => {
    const [allClaws, allVolumes, allUsers] = await Promise.all([
        db.select().from(claws).orderBy(desc(claws.createdAt)),
        db.select().from(volumes),
        db.select({ id: users.id, email: users.email }).from(users)
    ])

    const userMap = new Map(allUsers.map((u) => [u.id, u.email]))

    const providers = new Set(allClaws.map((c) => c.provider as ProviderType))
    const serverMaps = new Map<ProviderType, Map<string, ServerStatus>>()

    await Promise.all(
        Array.from(providers).map(async (provider) => {
            try {
                const servers = await getProvider(provider).getServers()
                serverMaps.set(provider, servers)
            } catch (err) {
                console.error(`Failed to fetch ${provider} servers:`, err)
                serverMaps.set(provider, new Map())
            }
        })
    )

    const syncedClaws = await Promise.all(
        allClaws.map(async (claw) => {
            if (!claw.providerServerId) return claw

            const providerServers = serverMaps.get(
                claw.provider as ProviderType
            )
            if (!providerServers) return claw

            const live = providerServers.get(claw.providerServerId)
            if (!live) return claw

            if (claw.status === clawStatus.configuring) {
                if (
                    live.ip &&
                    claw.subdomain &&
                    (!claw.ip || claw.ip !== live.ip)
                ) {
                    await Promise.all([
                        cloudflare
                            .findDNSRecord(claw.subdomain)
                            .then(async (existing) => {
                                if (existing && existing.ip !== live.ip) {
                                    await cloudflare.updateDNSRecord(
                                        existing.id,
                                        claw.subdomain!,
                                        live.ip!
                                    )
                                } else if (!existing) {
                                    await cloudflare.createDNSRecord(
                                        claw.subdomain!,
                                        live.ip!
                                    )
                                }
                            })
                            .catch(() => {
                                console.error(
                                    `Failed to fix DNS for ${claw.subdomain}`
                                )
                            }),
                        db
                            .update(claws)
                            .set({ ip: live.ip })
                            .where(eq(claws.id, claw.id))
                    ])
                }

                if (live.status === clawStatus.running && claw.subdomain) {
                    const ready = await checkSubdomainReady(claw.subdomain)
                    if (ready) {
                        await db
                            .update(claws)
                            .set({ status: clawStatus.running, ip: live.ip })
                            .where(eq(claws.id, claw.id))
                        return { ...claw, status: clawStatus.running, ip: live.ip }
                    }
                }
                return { ...claw, ip: live.ip }
            }

            const completionStates = transitionCompletedBy[claw.status]
            if (completionStates && !completionStates.includes(live.status)) {
                return { ...claw, ip: live.ip }
            }

            return { ...claw, status: live.status, ip: live.ip }
        })
    )

    const subIds = syncedClaws
        .filter((c) => c.polarSubscriptionId)
        .map((c) => c.polarSubscriptionId!)

    const subMap = new Map<string, BillingPeriod>()
    await Promise.all(
        subIds.map(async (id) => {
            const sub = await subscriptions.get(id)
            if (sub) {
                subMap.set(id, {
                    start: sub.currentPeriodStart?.toISOString(),
                    end: sub.currentPeriodEnd?.toISOString()
                })
            }
        })
    )

    const clawsWithVolumes = syncedClaws.map((claw) => {
        const billing = claw.polarSubscriptionId
            ? subMap.get(claw.polarSubscriptionId)
            : undefined
        return {
            ...claw,
            ownerEmail: userMap.get(claw.userId) || null,
            volumes: allVolumes.filter((v) => v.clawId === claw.id),
            currentPeriodStart: billing?.start || null,
            currentPeriodEnd: billing?.end || null
        }
    })

    return ok(c, clawsWithVolumes.map(sanitizeClaw), t('api.clawsFetched'))
}

export default getAdminClaws