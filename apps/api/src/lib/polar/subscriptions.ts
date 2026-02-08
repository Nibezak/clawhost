import { getPolarClient } from './client'

export type SubscriptionStatus =
    | 'active'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'past_due'
    | 'trialing'
    | 'unpaid'
    | 'revoked'

export interface PolarSubscription {
    id: string
    status: SubscriptionStatus
    customerId: string
    productId: string
    amount: number
    currency: string
    currentPeriodStart?: Date
    currentPeriodEnd?: Date
    cancelAtPeriodEnd: boolean
    canceledAt?: Date
    endedAt?: Date
    metadata?: Record<string, string>
}

export const subscriptions = {
    /**
     * Get a subscription by ID
     */
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

    /**
     * List subscriptions for a customer
     */
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

            return (
                items as Array<{
                    id: string
                    status: string
                    customerId: string
                    productId: string
                    amount?: number
                    currency?: string
                    currentPeriodStart?: string
                    currentPeriodEnd?: string
                    cancelAtPeriodEnd?: boolean
                    canceledAt?: string
                    endedAt?: string
                    metadata?: Record<string, string>
                }>
            ).map((sub) => ({
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

    /**
     * Cancel a subscription (at period end by default)
     * Uses the update endpoint with cancelAtPeriodEnd flag
     */
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

    /**
     * Uncancel a subscription (reverse a pending cancellation)
     * Sets cancelAtPeriodEnd back to false
     */
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

    /**
     * Immediately revoke a subscription
     * Uses the revoke endpoint
     */
    async revoke(subscriptionId: string): Promise<void> {
        const polar = getPolarClient()
        await polar.subscriptions.revoke({ id: subscriptionId })
    }
}