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
import { cloudflare } from '../../services/cloudflare'
import { volumes } from '../../db/schema'
import { DOMAIN } from '../claws/helpers/index'

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

    console.log(`Received Polar webhook: ${event.type}`)

    await handleWebhook(event, {
      // When checkout is completed (subscription created)
      onCheckoutUpdated: async (data: CheckoutWebhookData) => {
        if (data.status !== 'succeeded') {
          return
        }

        console.log(`Checkout succeeded: ${data.id}`)

        // The subscription.active event will handle provisioning
        // This is just for logging/tracking
      },

      // When subscription becomes active (payment confirmed)
      onSubscriptionActive: async (data: SubscriptionWebhookData) => {
        console.log(`Subscription active: ${data.id}`)

        // Extract pending claw ID from metadata
        const pendingClawId = data.metadata?.pendingClawId

        if (!pendingClawId) {
          console.log('No pendingClawId in subscription metadata, skipping provisioning')
          return
        }

        // Provision the claw
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
        console.log(`Subscription created: ${data.id}, status: ${data.status}`)

        // If immediately active, provision the claw
        if (data.status === 'active') {
          const pendingClawId = data.metadata?.pendingClawId

          if (pendingClawId) {
            const result = await provisionClaw({
              pendingClawId,
              subscriptionId: data.id,
              customerId: data.customerId,
              productId: data.productId,
            })

            if (!result.success) {
              console.error(`Failed to provision claw: ${result.error}`)
            }
          }
        }
      },

      // When subscription is canceled (at period end)
      onSubscriptionCanceled: async (data: SubscriptionWebhookData) => {
        console.log(`Subscription canceled: ${data.id}`)

        // Update claw status
        await db
          .update(claws)
          .set({ subscriptionStatus: 'canceled' })
          .where(eq(claws.polarSubscriptionId, data.id))
      },

      // When subscription is revoked (immediate cancellation or end of period)
      onSubscriptionRevoked: async (data: SubscriptionWebhookData) => {
        console.log(`Subscription revoked: ${data.id}`)

        // Find the claw
        const claw = await db
          .select()
          .from(claws)
          .where(eq(claws.polarSubscriptionId, data.id))
          .limit(1)

        if (!claw[0]) {
          console.log(`No claw found for subscription ${data.id}`)
          return
        }

        // Update status first
        await db
          .update(claws)
          .set({ subscriptionStatus: 'revoked' })
          .where(eq(claws.id, claw[0].id))

        // Optionally: Stop the server instead of deleting
        // This gives the user a grace period to reactivate
        if (claw[0].hetznerServerId) {
          try {
            await hetzner.stopServer(claw[0].hetznerServerId)
            await db
              .update(claws)
              .set({ status: 'stopped' })
              .where(eq(claws.id, claw[0].id))
            console.log(`Stopped server for revoked subscription ${data.id}`)
          } catch (err) {
            console.error(`Failed to stop server: ${err}`)
          }
        }
      },

      // When subscription payment fails
      onSubscriptionUpdated: async (data: SubscriptionWebhookData) => {
        console.log(`Subscription updated: ${data.id}, status: ${data.status}`)

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
              console.log(`Stopped server due to past_due subscription ${data.id}`)
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
