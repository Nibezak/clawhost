import type { Context } from 'hono'

import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import executeSSH from '@/services/ssh'
import { isAdmin } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'

const getClawEnvVars = async (
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
            return fail(c, t('api.clawNotFound'), 404)
        }

        if (!claw[0].ip || !claw[0].rootPassword) {
            return fail(c, t('api.failedToReadFile'), 400)
        }

        try {
            const envRaw = await executeSSH(
                claw[0].ip,
                claw[0].rootPassword,
                "cat /home/openclaw/.openclaw/.env 2>/dev/null || echo ''",
                10000
            )

            const envVars: Record<string, string> = {}
            envRaw
                .trim()
                .split('\n')
                .forEach((line) => {
                    const trimmed = line.trim()
                    if (!trimmed || trimmed.startsWith('#')) return
                    const eqIndex = trimmed.indexOf('=')
                    if (eqIndex === -1) return
                    const key = trimmed.substring(0, eqIndex).trim()
                    let value = trimmed.substring(eqIndex + 1).trim()
                    if (
                        (value.startsWith('"') && value.endsWith('"')) ||
                        (value.startsWith("'") && value.endsWith("'"))
                    ) {
                        value = value.slice(1, -1)
                    }
                    envVars[key] = value
                })

            return ok(c, { envVars }, t('api.fileFetched'))
        } catch {
            return fail(c, t('api.failedToReadFile'), 500)
        }
    } catch (err) {
        console.error('Get claw env vars error:', err)
        return fail(
            c,
            err instanceof Error ? err.message : t('api.failedToReadFile'),
            500
        )
    }
}

export default getClawEnvVars