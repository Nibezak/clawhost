import type { Context } from 'hono'

import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import executeSSH from '@/services/ssh'
import { isAdmin } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'

const SEPARATOR = '---CLAWHOST_SEP---'

const getClawDiagnostics = async (
    c: Context<{ Variables: { userId: string } }>
) => {
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
            return c.json({ error: t('api.clawNotFound') }, 404)
        }

        if (!claw[0].ip || !claw[0].rootPassword) {
            return c.json({ error: t('api.failedToGetDiagnostics') }, 400)
        }

        const command = [
            'systemctl status openclaw-gateway 2>&1',
            `echo '${SEPARATOR}'`,
            'ss -tlnp | grep 18789 2>&1 || echo "Port 18789 not listening"',
            `echo '${SEPARATOR}'`,
            'free -h 2>&1'
        ].join('; ')

        const output = await executeSSH(
            claw[0].ip,
            claw[0].rootPassword,
            command
        )
        const parts = output.split(SEPARATOR)

        return c.json({
            service: parts[0]?.trim() || '',
            port: parts[1]?.trim() || '',
            memory: parts[2]?.trim() || ''
        })
    } catch (err) {
        console.error('Get claw diagnostics error:', err)
        return c.json(
            {
                error:
                    err instanceof Error
                        ? err.message
                        : t('api.failedToGetDiagnostics')
            },
            500
        )
    }
}

export default getClawDiagnostics