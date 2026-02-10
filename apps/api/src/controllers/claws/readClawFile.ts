import type { Context } from 'hono'
import type { ReadClawFileBody } from '@/ts/Interfaces'

import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import executeSSH from '@/services/ssh'
import { t } from '@openclaw/i18n'

const BASE_DIR = '/home/openclaw/.openclaw'

const readClawFile = async (
    c: Context<{ Variables: { userId: string } }>
) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')
        const body = await c.req.json<ReadClawFileBody>()

        if (!body.path || typeof body.path !== 'string') {
            return c.json({ error: t('api.missingRequiredFields') }, 400)
        }

        if (body.path.includes('..') || body.path.startsWith('/')) {
            return c.json({ error: t('api.invalidFilePath') }, 400)
        }

        const claw = await db
            .select()
            .from(claws)
            .where(and(eq(claws.id, id), eq(claws.userId, userId)))
            .limit(1)

        if (!claw[0]) {
            return c.json({ error: t('api.clawNotFound') }, 404)
        }

        if (!claw[0].ip || !claw[0].rootPassword) {
            return c.json({ error: t('api.failedToReadFile') }, 400)
        }

        const fullPath = `${BASE_DIR}/${body.path}`
        const content = await executeSSH(
            claw[0].ip,
            claw[0].rootPassword,
            `cat '${fullPath.replace(/'/g, "'\\''")}' 2>&1`
        )

        return c.json({ content, path: body.path })
    } catch (err) {
        console.error('Read claw file error:', err)
        return c.json(
            {
                error:
                    err instanceof Error
                        ? err.message
                        : t('api.failedToReadFile')
            },
            500
        )
    }
}

export default readClawFile