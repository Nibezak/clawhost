import type { Context } from 'hono'

import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import { hetzner } from '@/services/hetzner'
import { t } from '@openclaw/i18n'
import { checkSubdomainReady } from '@/controllers/claws/helpers'

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

        if (claw[0].status === 'configuring') {
            if (hetznerStatus.status === 'running' && claw[0].subdomain) {
                const ready = await checkSubdomainReady(claw[0].subdomain)
                if (ready) {
                    await db
                        .update(claws)
                        .set({ status: 'running', ip: hetznerStatus.ip })
                        .where(eq(claws.id, id))

                    return c.json({
                        ...claw[0],
                        status: 'running',
                        ip: hetznerStatus.ip
                    })
                }
            }

            await db
                .update(claws)
                .set({ ip: hetznerStatus.ip })
                .where(eq(claws.id, id))

            return c.json({
                ...claw[0],
                ip: hetznerStatus.ip
            })
        }

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