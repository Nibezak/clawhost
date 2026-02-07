import type { Context } from 'hono'
import { eq, and } from 'drizzle-orm'
import { db } from '../../db'
import { claws } from '../../db/schema'
import { subscriptions } from '../../lib/polar'
import { cleanupClaw } from './helpers/index'

const deleteClaw = async (c: Context<{ Variables: { userId: string } }>) => {
  try {
    const userId = c.get('userId')
    const id = c.req.param('id')

    const claw = await db
      .select()
      .from(claws)
      .where(and(eq(claws.id, id), eq(claws.userId, userId)))
      .limit(1)

    if (!claw[0]) {
      return c.json({ error: 'Claw not found' }, 404)
    }

    // If there is a Polar subscription, schedule deletion at period end
    if (claw[0].polarSubscriptionId) {
      try {
        // Get subscription to find the period end date
        const sub = await subscriptions.get(claw[0].polarSubscriptionId)

        if (sub && sub.currentPeriodEnd) {
          // Cancel at period end (user keeps access until then)
          await subscriptions.cancel(claw[0].polarSubscriptionId)

          // Mark the claw as scheduled for deletion
          await db
            .update(claws)
            .set({
              deletionScheduledAt: sub.currentPeriodEnd,
              subscriptionStatus: 'canceled',
            })
            .where(eq(claws.id, id))

          return c.json({
            success: true,
            scheduled: true,
            deletionScheduledAt: sub.currentPeriodEnd.toISOString(),
          })
        }
      } catch (subErr) {
        console.error('Failed to schedule deletion via subscription:', subErr)
        // Fall through to immediate deletion
      }
    }

    // Fallback: No subscription or subscription handling failed — immediate deletion
    if (claw[0].polarSubscriptionId) {
      try {
        await subscriptions.revoke(claw[0].polarSubscriptionId)
      } catch (subErr) {
        console.error('Failed to revoke subscription:', subErr)
      }
    }

    await cleanupClaw(id, {
      hetznerServerId: claw[0].hetznerServerId,
      subdomain: claw[0].subdomain,
    })

    return c.json({ success: true, scheduled: false })
  } catch (err) {
    console.error('Delete claw error:', err)
    return c.json({ error: err instanceof Error ? err.message : 'Failed to delete claw' }, 500)
  }
}

export default deleteClaw
