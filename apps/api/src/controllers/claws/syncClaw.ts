import type { Context } from 'hono'
import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import { hetzner } from '@/services/hetzner'
import { t } from '@openclaw/i18n'

const syncClaw = async (c: Context<{ Variables: { userId: string } }>) => {
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

    try {
        const hetznerStatus = await hetzner.getServer(claw[0].hetznerServerId)

        await db
            .update(claws)
            .set({ status: hetznerStatus.status, ip: hetznerStatus.ip })
            .where(eq(claws.id, id))

        return c.json({
            ...claw[0],
            status: hetznerStatus.status,
            ip: hetznerStatus.ip
        })
    } catch (err) {
        console.error('Failed to sync with Hetzner:', err)
        return c.json({ error: t('api.failedToSyncClaw') }, 500)
    }
}

export default syncClaw