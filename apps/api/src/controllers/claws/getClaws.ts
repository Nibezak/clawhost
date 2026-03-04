import type { AuthenticatedContext, ProviderType } from '@/ts/Types'
import type { BillingPeriod, ServerStatus } from '@/ts/Interfaces'

import { eq, desc, gt, and } from 'drizzle-orm'
import { clawStatus } from '@openclaw/shared'
import { db } from '@/db'
import { claws, volumes, pendingClaws } from '@/db/schema'
import { getProvider } from '@/services/provider'
import cloudflare from '@/services/cloudflare'
import { checkSubdomainReady, sanitizeClaw } from '@/controllers/claws/helpers'
import { subscriptions, checkouts } from '@/lib/polar'
import { ok, fail } from '@/lib/response'
import { t } from '@openclaw/i18n'

const transitionCompletedBy: Record<string, string[]> = {
    [clawStatus.stopping]: [clawStatus.stopped],
    [clawStatus.starting]: [clawStatus.running],
    [clawStatus.creating]: [clawStatus.running],
    [clawStatus.initializing]: [clawStatus.running],
    [clawStatus.migrating]: [clawStatus.running],
    [clawStatus.rebuilding]: [clawStatus.running],
    [clawStatus.restarting]: [clawStatus.running]
}

const getClaws = async (c: AuthenticatedContext) => {
    try {
        const userId = c.get('userId')

        const [userClaws, userVolumes, userPendingClaws] = await Promise.all([
            db
                .select()
                .from(claws)
                .where(eq(claws.userId, userId))
                .orderBy(desc(claws.createdAt)),
            db.select().from(volumes).where(eq(volumes.userId, userId)),
            db
                .select()
                .from(pendingClaws)
                .where(
                    and(
                        eq(pendingClaws.userId, userId),
                        gt(pendingClaws.expiresAt, new Date())
                    )
                )
        ])

        const providers = new Set(
            userClaws.map((c) => c.provider as ProviderType)
        )
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
            userClaws.map(async (claw) => {
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
                                .set({
                                    status: clawStatus.running,
                                    ip: live.ip
                                })
                                .where(eq(claws.id, claw.id))
                            return {
                                ...claw,
                                status: clawStatus.running,
                                ip: live.ip
                            }
                        }
                    }
                    return { ...claw, ip: live.ip }
                }

                if (claw.status === clawStatus.unreachable) {
                    return { ...claw, ip: live.ip }
                }

                const completionStates = transitionCompletedBy[claw.status]
                if (
                    completionStates &&
                    !completionStates.includes(live.status)
                ) {
                    return { ...claw, ip: live.ip }
                }

                if (claw.status !== live.status) {
                    await db
                        .update(claws)
                        .set({ status: live.status, ip: live.ip })
                        .where(eq(claws.id, claw.id))
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
                volumes: userVolumes.filter((v) => v.clawId === claw.id),
                currentPeriodStart: billing?.start || null,
                currentPeriodEnd: billing?.end || null
            }
        })

        const validPending = await Promise.all(
            userPendingClaws.map(async (p) => {
                try {
                    const checkout = await checkouts.get(p.checkoutId)
                    if (checkout?.status === 'expired') {
                        await db
                            .delete(pendingClaws)
                            .where(eq(pendingClaws.id, p.id))
                        return null
                    }
                    const paid =
                        checkout?.status === 'succeeded' ||
                        checkout?.status === 'confirmed'
                    return {
                        pending: p,
                        paid,
                        checkoutUrl: checkout?.url || null
                    }
                } catch {
                    return { pending: p, paid: false, checkoutUrl: null }
                }
            })
        )

        const pendingAsClaw = validPending
            .filter((v) => v !== null)
            .map(({ pending: p, paid, checkoutUrl }) => ({
                id: `pending-${p.id}`,
                name: p.name,
                provider: p.provider,
                status: paid ? clawStatus.creating : clawStatus.awaitingPayment,
                ip: null,
                planId: p.planId,
                location: p.location,
                sshKeyId: p.sshKeyId,
                providerServerId: null,
                subdomain: null,
                gatewayToken: null,
                subscriptionStatus: null,
                currentPeriodStart: null,
                currentPeriodEnd: null,
                volumes: [],
                deletionScheduledAt: null,
                checkoutUrl: paid ? null : checkoutUrl,
                createdAt: p.createdAt.toISOString()
            }))

        return ok(
            c,
            [...pendingAsClaw, ...clawsWithVolumes.map(sanitizeClaw)],
            t('api.clawsFetched')
        )
    } catch {
        return fail(c, t('api.internalServerError'), 500)
    }
}

export default getClaws