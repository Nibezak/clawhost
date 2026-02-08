import type { Context } from 'hono'

import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import { hetzner } from '@/services/hetzner'
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

        if (!claw[0] || !claw[0].hetznerServerId) {
            return c.json({ error: t('api.clawNotFound') }, 404)
        }

        await hetzner.restartServer(claw[0].hetznerServerId)

        return c.json({ success: true })
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