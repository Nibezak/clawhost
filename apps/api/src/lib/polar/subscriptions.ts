import type { PolarSubscription, PolarSubscriptionRaw } from '@/ts/Interfaces'
import type { SubscriptionStatus } from '@/ts/Types'

import { getPolarClient } from '@/lib/polar/client'

export const subscriptions = {
    async get(subscriptionId: string): Promise<PolarSubscription | null> {
        const polar = getPolarClient()

        try {
            const sub = await polar.subscriptions.get({ id: subscriptionId })
            return {
                id: sub.id,
                status: sub.status as SubscriptionStatus,
                customerId: sub.customerId,
                productId: sub.productId,
                amount: sub.amount ?? 0,
                currency: sub.currency ?? 'usd',
                currentPeriodStart: sub.currentPeriodStart
                    ? new Date(sub.currentPeriodStart)
                    : undefined,
                currentPeriodEnd: sub.currentPeriodEnd
                    ? new Date(sub.currentPeriodEnd)
                    : undefined,
                cancelAtPeriodEnd: sub.cancelAtPeriodEnd ?? false,
                canceledAt: sub.canceledAt
                    ? new Date(sub.canceledAt)
                    : undefined,
                endedAt: sub.endedAt ? new Date(sub.endedAt) : undefined,
                metadata: sub.metadata as Record<string, string> | undefined
            }
        } catch {
            return null
        }
    },

    async listByCustomer(customerId: string): Promise<PolarSubscription[]> {
        const polar = getPolarClient()

        try {
            const result = await polar.subscriptions.list({
                customerId
            })

            const items =
                'result' in result
                    ? result.result
                    : (result as unknown as { items: unknown[] }).items || []

            return (items as PolarSubscriptionRaw[]).map((sub) => ({
                id: sub.id,
                status: sub.status as SubscriptionStatus,
                customerId: sub.customerId,
                productId: sub.productId,
                amount: sub.amount ?? 0,
                currency: sub.currency ?? 'usd',
                currentPeriodStart: sub.currentPeriodStart
                    ? new Date(sub.currentPeriodStart)
                    : undefined,
                currentPeriodEnd: sub.currentPeriodEnd
                    ? new Date(sub.currentPeriodEnd)
                    : undefined,
                cancelAtPeriodEnd: sub.cancelAtPeriodEnd ?? false,
                canceledAt: sub.canceledAt
                    ? new Date(sub.canceledAt)
                    : undefined,
                endedAt: sub.endedAt ? new Date(sub.endedAt) : undefined,
                metadata: sub.metadata as Record<string, string> | undefined
            }))
        } catch {
            return []
        }
    },

    async cancel(subscriptionId: string): Promise<PolarSubscription | null> {
        const polar = getPolarClient()

        try {
            const sub = await polar.subscriptions.update({
                id: subscriptionId,
                subscriptionUpdate: {
                    cancelAtPeriodEnd: true
                }
            })
            return {
                id: sub.id,
                status: sub.status as SubscriptionStatus,
                customerId: sub.customerId,
                productId: sub.productId,
                amount: sub.amount ?? 0,
                currency: sub.currency ?? 'usd',
                currentPeriodStart: sub.currentPeriodStart
                    ? new Date(sub.currentPeriodStart)
                    : undefined,
                currentPeriodEnd: sub.currentPeriodEnd
                    ? new Date(sub.currentPeriodEnd)
                    : undefined,
                cancelAtPeriodEnd: sub.cancelAtPeriodEnd ?? false,
                canceledAt: sub.canceledAt
                    ? new Date(sub.canceledAt)
                    : undefined,
                endedAt: sub.endedAt ? new Date(sub.endedAt) : undefined,
                metadata: sub.metadata as Record<string, string> | undefined
            }
        } catch {
            return null
        }
    },

    async uncancel(subscriptionId: string): Promise<PolarSubscription | null> {
        const polar = getPolarClient()

        try {
            const sub = await polar.subscriptions.update({
                id: subscriptionId,
                subscriptionUpdate: {
                    cancelAtPeriodEnd: false
                }
            })
            return {
                id: sub.id,
                status: sub.status as SubscriptionStatus,
                customerId: sub.customerId,
                productId: sub.productId,
                amount: sub.amount ?? 0,
                currency: sub.currency ?? 'usd',
                currentPeriodStart: sub.currentPeriodStart
                    ? new Date(sub.currentPeriodStart)
                    : undefined,
                currentPeriodEnd: sub.currentPeriodEnd
                    ? new Date(sub.currentPeriodEnd)
                    : undefined,
                cancelAtPeriodEnd: sub.cancelAtPeriodEnd ?? false,
                canceledAt: sub.canceledAt
                    ? new Date(sub.canceledAt)
                    : undefined,
                endedAt: sub.endedAt ? new Date(sub.endedAt) : undefined,
                metadata: sub.metadata as Record<string, string> | undefined
            }
        } catch {
            return null
        }
    },

    async revoke(subscriptionId: string): Promise<void> {
        const polar = getPolarClient()
        await polar.subscriptions.revoke({ id: subscriptionId })
    }
}