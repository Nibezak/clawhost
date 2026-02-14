import type { Context } from 'hono'
import type { UpdateClawEnvVarsBody } from '@/ts/Interfaces'

import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import executeSSH from '@/services/ssh'
import { isAdmin } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'

const BASE_DIR = '/home/openclaw/.openclaw'

const updateClawEnvVars = async (
    c: Context<{ Variables: { userId: string } }>
) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')
        const body = await c.req.json<UpdateClawEnvVarsBody>()

        if (!body.envVars || typeof body.envVars !== 'object') {
            return fail(c, t('api.missingRequiredFields'), 400)
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
            return fail(c, t('api.clawNotFound'), 404)
        }

        if (!claw[0].ip || !claw[0].rootPassword) {
            return fail(c, t('api.failedToUpdateFile'), 400)
        }

        try {
            const existingEnv = await executeSSH(
                claw[0].ip,
                claw[0].rootPassword,
                `cat ${BASE_DIR}/.env 2>/dev/null || echo ''`,
                5000
            )

            const commentLines: string[] = []

            existingEnv
                .trim()
                .split('\n')
                .forEach((line) => {
                    const trimmed = line.trim()
                    if (!trimmed) return
                    if (trimmed.startsWith('#')) {
                        commentLines.push(line)
                    }
                })

            const newLines = [...commentLines]

            Object.entries(body.envVars).forEach(([key, value]) => {
                if (value !== '') {
                    newLines.push(`${key}=${value}`)
                }
            })

            const envContent = newLines.join('\n')
            const escapedEnv = envContent.replace(/'/g, "'\\''")

            await executeSSH(
                claw[0].ip,
                claw[0].rootPassword,
                `echo '${escapedEnv}' > ${BASE_DIR}/.env`,
                5000
            )

            await executeSSH(
                claw[0].ip,
                claw[0].rootPassword,
                'systemctl restart openclaw-gateway',
                10000
            )

            return ok(c, null, t('api.fileSaveSuccess'))
        } catch {
            return fail(c, t('api.failedToUpdateFile'), 500)
        }
    } catch (err) {
        console.error('Update claw env vars error:', err)
        return fail(
            c,
            err instanceof Error ? err.message : t('api.failedToUpdateFile'),
            500
        )
    }
}

export default updateClawEnvVars