import type { Context } from 'hono'

import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import { subscriptions } from '@/lib/polar'
import { isAdmin } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'

const cancelDeletion = async (
    c: Context<{ Variables: { userId: string } }>
) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')
        const admin = await isAdmin(userId)

        const claw = await db
            .select()
            .from(claws)
            .where(
                admin
                    ? eq(claws.id, id)
                    : and(eq(claws.id, id), eq(claws.userId, userId))
            )
            .limit(1)

        if (!claw[0]) {
            return c.json({ error: t('api.clawNotFound') }, 404)
        }

        if (!claw[0].deletionScheduledAt) {
            return c.json({ error: t('api.clawNotScheduledForDeletion') }, 400)
        }

        // Uncancel the Polar subscription
        if (claw[0].polarSubscriptionId) {
            try {
                await subscriptions.uncancel(claw[0].polarSubscriptionId)
            } catch (subErr) {
                console.error('Failed to uncancel subscription:', subErr)
                return c.json(
                    { error: t('api.failedToCancelScheduledDeletion') },
                    500
                )
            }
        }

        // Clear the deletion schedule and restore subscription status
        await db
            .update(claws)
            .set({
                deletionScheduledAt: null,
                subscriptionStatus: 'active'
            })
            .where(eq(claws.id, id))

        const updated = await db
            .select()
            .from(claws)
            .where(eq(claws.id, id))
            .limit(1)

        return c.json(updated[0])
    } catch (err) {
        console.error('Cancel deletion error:', err)
        return c.json(
            {
                error:
                    err instanceof Error
                        ? err.message
                        : t('api.failedToCancelDeletion')
            },
            500
        )
    }
}

export default cancelDeletion