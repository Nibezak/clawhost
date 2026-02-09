import type { Context } from 'hono'
import type { ProviderType } from '@/ts/Types'

import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import { getProvider } from '@/services/provider'
import { t } from '@openclaw/i18n'

const restartClaw = async (c: Context<{ Variables: { userId: string } }>) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')

        const claw = await db
            .select()
            .from(claws)
            .where(and(eq(claws.id, id), eq(claws.userId, userId)))
            .limit(1)

        if (!claw[0] || !claw[0].providerServerId) {
            return c.json({ error: t('api.clawNotFound') }, 404)
        }

        await db
            .update(claws)
            .set({ status: 'restarting' })
            .where(eq(claws.id, id))
        await getProvider(claw[0].provider as ProviderType).restartServer(
            claw[0].providerServerId
        )

        const updated = await db
            .select()
            .from(claws)
            .where(eq(claws.id, id))
            .limit(1)

        return c.json(updated[0])
    } catch (err) {
        console.error('Restart claw error:', err)
        return c.json(
            {
                error:
                    err instanceof Error
                        ? err.message
                        : t('api.failedToRestartClaw')
            },
            500
        )
    }
}

export default restartClaw