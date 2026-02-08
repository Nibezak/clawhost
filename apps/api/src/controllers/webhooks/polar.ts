import type { Context } from 'hono'
import type {
    SubscriptionWebhookData,
    CheckoutWebhookData
} from '@/ts/Interfaces'

import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import { parseWebhook, handleWebhook } from '@/lib/polar'
import { provisionClaw } from '@/controllers/claws/provisionClaw'
import { hetzner } from '@/services/hetzner'
import { cleanupClaw } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'

const handlePolarWebhook = async (c: Context) => {
    try {
        const event = await parseWebhook(c)

        if (!event) {
            return c.json({ error: t('api.invalidWebhook') }, 400)
        }

        await handleWebhook(event, {
            onCheckoutUpdated: async (data: CheckoutWebhookData) => {
                if (data.status !== 'succeeded') {
                    return
                }
            },

            onSubscriptionActive: async (data: SubscriptionWebhookData) => {
                const existingClaw = await db
                    .select()
                    .from(claws)
                    .where(eq(claws.polarSubscriptionId, data.id))
                    .limit(1)

                if (existingClaw[0]) {
                    return
                }

                const pendingClawId = data.metadata?.pendingClawId
                if (!pendingClawId) {
                    return
                }

                const result = await provisionClaw({
                    pendingClawId,
                    subscriptionId: data.id,
                    customerId: data.customerId,
                    productId: data.productId
                })

                if (!result.success) {
                    console.error(`Failed to provision claw: ${result.error}`)
                }
            },

            onSubscriptionCreated: async (data: SubscriptionWebhookData) => {
                if (data.status !== 'active') {
                    return
                }

                const pendingClawId = data.metadata?.pendingClawId
                if (!pendingClawId) {
                    return
                }

                const result = await provisionClaw({
                    pendingClawId,
                    subscriptionId: data.id,
                    customerId: data.customerId,
                    productId: data.productId
                })

                if (!result.success) {
                    console.error(`Failed to provision claw: ${result.error}`)
                }
            },

            onSubscriptionCanceled: async (data: SubscriptionWebhookData) => {
                const deletionScheduledAt = data.currentPeriodEnd
                    ? new Date(data.currentPeriodEnd)
                    : null

                await db
                    .update(claws)
                    .set({
                        subscriptionStatus: 'canceled',
                        ...(deletionScheduledAt ? { deletionScheduledAt } : {})
                    })
                    .where(eq(claws.polarSubscriptionId, data.id))
            },

            onSubscriptionRevoked: async (data: SubscriptionWebhookData) => {
                const claw = await db
                    .select()
                    .from(claws)
                    .where(eq(claws.polarSubscriptionId, data.id))
                    .limit(1)

                if (!claw[0]) {
                    return
                }

                if (claw[0].deletionScheduledAt) {
                    try {
                        await cleanupClaw(claw[0].id, {
                            hetznerServerId: claw[0].hetznerServerId,
                            subdomain: claw[0].subdomain
                        })
                    } catch (err) {
                        console.error(
                            `Failed to cleanup claw ${claw[0].id}:`,
                            err
                        )
                        await db
                            .update(claws)
                            .set({
                                subscriptionStatus: 'revoked',
                                status: 'stopped'
                            })
                            .where(eq(claws.id, claw[0].id))
                    }
                    return
                }

                await db
                    .update(claws)
                    .set({ subscriptionStatus: 'revoked' })
                    .where(eq(claws.id, claw[0].id))

                if (claw[0].hetznerServerId) {
                    try {
                        await hetzner.stopServer(claw[0].hetznerServerId)
                        await db
                            .update(claws)
                            .set({ status: 'stopped' })
                            .where(eq(claws.id, claw[0].id))
                    } catch (err) {
                        console.error(`Failed to stop server: ${err}`)
                    }
                }
            },

            onSubscriptionUncanceled: async (data: SubscriptionWebhookData) => {
                await db
                    .update(claws)
                    .set({
                        deletionScheduledAt: null,
                        subscriptionStatus: 'active'
                    })
                    .where(eq(claws.polarSubscriptionId, data.id))
            },

            onSubscriptionUpdated: async (data: SubscriptionWebhookData) => {
                await db
                    .update(claws)
                    .set({ subscriptionStatus: data.status })
                    .where(eq(claws.polarSubscriptionId, data.id))

                if (data.status === 'past_due') {
                    const claw = await db
                        .select()
                        .from(claws)
                        .where(eq(claws.polarSubscriptionId, data.id))
                        .limit(1)

                    if (claw[0]?.hetznerServerId) {
                        try {
                            await hetzner.stopServer(claw[0].hetznerServerId)
                            await db
                                .update(claws)
                                .set({ status: 'stopped' })
                                .where(eq(claws.id, claw[0].id))
                        } catch (err) {
                            console.error(`Failed to stop server: ${err}`)
                        }
                    }
                }
            }
        })

        return c.json({ received: true })
    } catch (err) {
        console.error('Webhook error:', err)
        return c.json({ error: t('api.webhookProcessingFailed') }, 500)
    }
}

export default handlePolarWebhook