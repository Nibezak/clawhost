import type { Context } from 'hono'
import type { ProviderType } from '@/ts/Types'

import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import { subscriptions } from '@/lib/polar'
import { cleanupClaw, isAdmin } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'

const deleteClaw = async (c: Context<{ Variables: { userId: string } }>) => {
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
            return fail(c, t('api.clawNotFound'), 404)
        }

        if (claw[0].polarSubscriptionId) {
            try {
                const sub = await subscriptions.get(claw[0].polarSubscriptionId)

                if (sub && sub.currentPeriodEnd) {
                    await subscriptions.cancel(claw[0].polarSubscriptionId)

                    await db
                        .update(claws)
                        .set({
                            deletionScheduledAt: sub.currentPeriodEnd,
                            subscriptionStatus: 'canceled'
                        })
                        .where(eq(claws.id, id))

                    const updated = await db
                        .select()
                        .from(claws)
                        .where(eq(claws.id, id))
                        .limit(1)

                    return ok(c, { scheduled: true, deletionScheduledAt: sub.currentPeriodEnd.toISOString(), claw: updated[0] }, t('api.clawDeletionScheduled'))
                }
            } catch (subErr) {
                console.error(
                    'Failed to schedule deletion via subscription:',
                    subErr
                )
            }
        }

        if (claw[0].polarSubscriptionId) {
            try {
                await subscriptions.revoke(claw[0].polarSubscriptionId)
            } catch (subErr) {
                console.error('Failed to revoke subscription:', subErr)
            }
        }

        await cleanupClaw(id, {
            provider: (claw[0].provider || 'hetzner') as ProviderType,
            providerServerId: claw[0].providerServerId,
            subdomain: claw[0].subdomain
        })

        return ok(c, { scheduled: false }, t('api.clawDeleted'))
    } catch (err) {
        console.error('Delete claw error:', err)
        return fail(
            c,
            err instanceof Error
                ? err.message
                : t('api.failedToDeleteClaw'),
            500
        )
    }
}

export default deleteClaw