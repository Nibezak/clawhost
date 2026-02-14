import type { AuthenticatedContext, ProviderType } from '@/ts/Types'

import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import { getProvider } from '@/services/provider'
import { isAdmin } from '@/controllers/claws/helpers'
import { ok, fail } from '@/lib/response'
import { t } from '@openclaw/i18n'

const startClaw = async (c: AuthenticatedContext) => {
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

        if (!claw[0] || !claw[0].providerServerId) {
            return fail(c, t('api.clawNotFound'), 404)
        }

        await db
            .update(claws)
            .set({ status: 'starting' })
            .where(eq(claws.id, id))
        await getProvider(claw[0].provider as ProviderType).startServer(
            claw[0].providerServerId
        )

        const updated = await db
            .select()
            .from(claws)
            .where(eq(claws.id, id))
            .limit(1)

        return ok(c, updated[0], t('api.clawStarted'))
    } catch (err) {
        console.error('Start claw error:', err)
        return fail(
            c,
            err instanceof Error ? err.message : t('api.failedToStartClaw'),
            500
        )
    }
}

export default startClaw