import type { Context } from 'hono'

import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import { subscriptions } from '@/lib/polar'
import { cleanupClaw } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'

const hardDeleteClaw = async (
    c: Context<{ Variables: { userId: string } }>
) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')

        const claw = await db
            .select()
            .from(claws)
            .where(and(eq(claws.id, id), eq(claws.userId, userId)))
            .limit(1)

        if (!claw[0]) {
            return c.json({ error: t('api.clawNotFound') }, 404)
        }

        if (!claw[0].deletionScheduledAt) {
            return c.json({ error: t('api.clawNotScheduledForDeletion') }, 400)
        }

        if (claw[0].polarSubscriptionId) {
            try {
                await subscriptions.revoke(claw[0].polarSubscriptionId)
            } catch (subErr) {
                console.error('Failed to revoke subscription:', subErr)
            }
        }

        await cleanupClaw(id, {
            hetznerServerId: claw[0].hetznerServerId,
            subdomain: claw[0].subdomain
        })

        return c.json({ success: true })
    } catch (err) {
        console.error('Hard delete claw error:', err)
        return c.json(
            {
                error:
                    err instanceof Error
                        ? err.message
                        : t('api.failedToHardDeleteClaw')
            },
            500
        )
    }
}

export default hardDeleteClaw