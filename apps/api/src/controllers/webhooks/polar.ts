import type { Context } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { claws } from '../../db/schema'
import {
  parseWebhook,
  handleWebhook,
  type SubscriptionWebhookData,
  type CheckoutWebhookData,
} from '../../lib/polar'
import { provisionClaw } from '../claws/provisionClaw'
import { hetzner } from '../../services/hetzner'
import { cleanupClaw } from '../claws/helpers/index'

/**
 * Handle Polar webhook events
 * This endpoint should be public (no auth required)
 */
const handlePolarWebhook = async (c: Context) => {
  try {
    const event = await parseWebhook(c)

    if (!event) {
      return c.json({ error: 'Invalid webhook' }, 400)
    }

    await handleWebhook(event, {
      // When checkout is completed (subscription created)
      onCheckoutUpdated: async (data: CheckoutWebhookData) => {
        if (data.status !== 'succeeded') {
          return
        }

        // The subscription.active event will handle provisioning
        // This is just for logging/tracking
      },

      // When subscription becomes active (payment confirmed)
      onSubscriptionActive: async (data: SubscriptionWebhookData) => {
        // Check if already provisioned (subscription.created may have handled it)
        const existingClaw = await db
          .select()
          .from(claws)
          .where(eq(claws.polarSubscriptionId, data.id))
          .limit(1)

        if (existingClaw[0]) {
          console.log(`Claw already provisioned for subscription ${data.id}, skipping`)
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
          productId: data.productId,
        })

        if (!result.success) {
          console.error(`Failed to provision claw: ${result.error}`)
        }
      },

      // When subscription is created (may not be active yet)
      onSubscriptionCreated: async (data: SubscriptionWebhookData) => {
        if (data.status !== 'active') {
          console.log(`Subscription created but not active yet (${data.status}), waiting for activation`)
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
          productId: data.productId,
        })

        if (!result.success) {
          console.error(`Failed to provision claw: ${result.error}`)
        }
      },

      // When subscription is canceled (at period end)
      onSubscriptionCanceled: async (data: SubscriptionWebhookData) => {
        // Update claw status
        await db
          .update(claws)
          .set({ subscriptionStatus: 'canceled' })
          .where(eq(claws.polarSubscriptionId, data.id))
      },

      // When subscription is revoked (immediate cancellation or end of period)
      onSubscriptionRevoked: async (data: SubscriptionWebhookData) => {
        // Find the claw
        const claw = await db
          .select()
          .from(claws)
          .where(eq(claws.polarSubscriptionId, data.id))
          .limit(1)

        if (!claw[0]) {
          return
        }

        // If deletion was scheduled, perform full infrastructure cleanup
        if (claw[0].deletionScheduledAt) {
          try {
            await cleanupClaw(claw[0].id, {
              hetznerServerId: claw[0].hetznerServerId,
              subdomain: claw[0].subdomain,
            })
            console.log(`Claw ${claw[0].id} fully deleted after scheduled deletion`)
          } catch (err) {
            console.error(`Failed to cleanup claw ${claw[0].id}:`, err)
            // Update status to indicate failure so it can be retried or handled manually
            await db
              .update(claws)
              .set({ subscriptionStatus: 'revoked', status: 'stopped' })
              .where(eq(claws.id, claw[0].id))
          }
          return
        }

        // No scheduled deletion — just stop the server (grace period)
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

      // When subscription is uncanceled (deletion cancelled by user)
      onSubscriptionUncanceled: async (data: SubscriptionWebhookData) => {
        // Clear deletion schedule when subscription is uncanceled
        await db
          .update(claws)
          .set({
            deletionScheduledAt: null,
            subscriptionStatus: 'active',
          })
          .where(eq(claws.polarSubscriptionId, data.id))
      },

      // When subscription payment fails
      onSubscriptionUpdated: async (data: SubscriptionWebhookData) => {
        // Update subscription status
        await db
          .update(claws)
          .set({ subscriptionStatus: data.status })
          .where(eq(claws.polarSubscriptionId, data.id))

        // If past_due, stop the server
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
      },
    })

    return c.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return c.json({ error: 'Webhook processing failed' }, 500)
  }
}

export default handlePolarWebhook
