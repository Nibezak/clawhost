import type { Context } from 'hono'
import type { UpdateClawFileBody } from '@/ts/Interfaces'

import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import executeSSH from '@/services/ssh'
import { isAdmin } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'

const BASE_DIR = '/home/openclaw/.openclaw'

const updateClawFile = async (
    c: Context<{ Variables: { userId: string } }>
) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')
        const body = await c.req.json<UpdateClawFileBody>()

        if (
            !body.path ||
            typeof body.path !== 'string' ||
            !body.content ||
            typeof body.content !== 'string'
        ) {
            return c.json({ error: t('api.missingRequiredFields') }, 400)
        }

        if (body.path.includes('..') || body.path.startsWith('/')) {
            return c.json({ error: t('api.invalidFilePath') }, 400)
        }

        if (!body.path.endsWith('.json')) {
            return c.json({ error: t('api.fileNotEditable') }, 400)
        }

        try {
            JSON.parse(body.content)
        } catch {
            return c.json({ error: t('api.invalidJsonConfig') }, 400)
        }

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
            return c.json({ error: t('api.clawNotFound') }, 404)
        }

        if (!claw[0].ip || !claw[0].rootPassword) {
            return c.json({ error: t('api.failedToUpdateFile') }, 400)
        }

        const fullPath = `${BASE_DIR}/${body.path}`
        const escapedContent = body.content.replace(/'/g, "'\\''")

        await executeSSH(
            claw[0].ip,
            claw[0].rootPassword,
            `echo '${escapedContent}' > '${fullPath.replace(/'/g, "'\\''")}'`
        )

        return c.json({
            success: true,
            message: t('api.fileSaveSuccess')
        })
    } catch (err) {
        console.error('Update claw file error:', err)
        return c.json(
            {
                error:
                    err instanceof Error
                        ? err.message
                        : t('api.failedToUpdateFile')
            },
            500
        )
    }
}

export default updateClawFile