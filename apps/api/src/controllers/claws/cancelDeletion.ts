import type { Context } from 'hono'
import { eq, and } from 'drizzle-orm'
import { db } from '../../db'
import { claws } from '../../db/schema'
import { subscriptions } from '../../lib/polar'

const cancelDeletion = async (c: Context<{ Variables: { userId: string } }>) => {
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

    if (!claw[0].deletionScheduledAt) {
      return c.json({ error: 'Claw is not scheduled for deletion' }, 400)
    }

    // Uncancel the Polar subscription
    if (claw[0].polarSubscriptionId) {
      try {
        await subscriptions.uncancel(claw[0].polarSubscriptionId)
      } catch (subErr) {
        console.error('Failed to uncancel subscription:', subErr)
        return c.json({ error: 'Failed to cancel the scheduled deletion' }, 500)
      }
    }

    // Clear the deletion schedule and restore subscription status
    await db
      .update(claws)
      .set({
        deletionScheduledAt: null,
        subscriptionStatus: 'active',
      })
      .where(eq(claws.id, id))

    return c.json({ success: true })
  } catch (err) {
    console.error('Cancel deletion error:', err)
    return c.json({ error: err instanceof Error ? err.message : 'Failed to cancel deletion' }, 500)
  }
}

export default cancelDeletion
