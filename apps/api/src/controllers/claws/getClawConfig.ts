import type { Context } from 'hono'

import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import executeSSH from '@/services/ssh'
import { t } from '@openclaw/i18n'

const getClawConfig = async (c: Context<{ Variables: { userId: string } }>) => {
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

        if (!claw[0].ip || !claw[0].rootPassword) {
            return c.json({ error: t('api.failedToGetConfig') }, 400)
        }

        const output = await executeSSH(
            claw[0].ip,
            claw[0].rootPassword,
            'cat /home/openclaw/.openclaw/openclaw.json 2>&1'
        )

        return c.json({ config: output })
    } catch (err) {
        console.error('Get claw config error:', err)
        return c.json(
            {
                error:
                    err instanceof Error
                        ? err.message
                        : t('api.failedToGetConfig')
            },
            500
        )
    }
}

export default getClawConfig