import type { Context } from 'hono'
import type { ProviderType } from '@/ts/Types'

import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import { subscriptions } from '@/lib/polar'
import { cleanupClaw, isAdmin } from '@/controllers/claws/helpers'
import { ok, fail } from '@/lib/response'
import { t } from '@openclaw/i18n'

const hardDeleteClaw = async (
    c: Context<{ Variables: { userId: string } }>
) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')
        const admin = await isAdmin(userId)

        if (!admin) {
            return fail(c, t('api.adminAccessDenied'), 403)
        }

        const claw = await db
            .select()
            .from(claws)
            .where(eq(claws.id, id))
            .limit(1)

        if (!claw[0]) {
            return fail(c, t('api.clawNotFound'), 404)
        }

        if (!claw[0].deletionScheduledAt) {
            return fail(c, t('api.clawNotScheduledForDeletion'), 400)
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

        return ok(c, null, t('api.clawHardDeleted'))
    } catch (err) {
        console.error('Hard delete claw error:', err)
        return fail(
            c,
            err instanceof Error
                ? err.message
                : t('api.failedToHardDeleteClaw'),
            500
        )
    }
}

export default hardDeleteClaw