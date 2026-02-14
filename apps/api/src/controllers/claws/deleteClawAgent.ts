import type { Context } from 'hono'
import type { DeleteClawAgentBody } from '@/ts/Interfaces'

import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import executeSSH from '@/services/ssh'
import { isAdmin } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'

const BASE_DIR = '/home/openclaw/.openclaw'

const deleteClawAgent = async (
    c: Context<{ Variables: { userId: string } }>
) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')
        const body = await c.req.json<DeleteClawAgentBody>()

        if (!body.agentId || typeof body.agentId !== 'string') {
            return fail(c, t('api.missingRequiredFields'), 400)
        }

        if (body.agentId === 'main') {
            return fail(c, t('api.cannotDeleteMainAgent'), 400)
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
            return fail(c, t('api.agentDeleteFailed'), 400)
        }

        try {
            const configOutput = await executeSSH(
                claw[0].ip,
                claw[0].rootPassword,
                `cat ${BASE_DIR}/openclaw.json 2>/dev/null || echo '{}'`,
                5000
            )

            let config: Record<string, unknown> = {}
            try {
                config = JSON.parse(configOutput.trim())
            } catch {
                config = {}
            }

            if (!config.agents) {
                return fail(c, t('api.agentDeleteFailed'), 404)
            }

            const agents = config.agents as Record<string, unknown>
            const agentList = (agents.list || []) as Record<string, unknown>[]

            const agentIndex = agentList.findIndex(
                (a) =>
                    (a.id as string) === body.agentId ||
                    (a.name as string) === body.agentId
            )

            if (agentIndex === -1) {
                return fail(c, t('api.agentDeleteFailed'), 404)
            }

            if (agentList.length <= 1) {
                return fail(c, t('api.cannotDeleteMainAgent'), 400)
            }

            agentList.splice(agentIndex, 1)
            agents.list = agentList

            const configJson = JSON.stringify(config, null, 4)
            const escapedConfig = configJson.replace(/'/g, "'\\''")

            await executeSSH(
                claw[0].ip,
                claw[0].rootPassword,
                `echo '${escapedConfig}' > ${BASE_DIR}/openclaw.json`,
                5000
            )

            await executeSSH(
                claw[0].ip,
                claw[0].rootPassword,
                'systemctl restart openclaw-gateway',
                10000
            )

            return ok(c, null, t('api.agentDeleted'))
        } catch {
            return fail(c, t('api.agentDeleteFailed'), 500)
        }
    } catch (err) {
        console.error('Delete claw agent error:', err)
        return fail(
            c,
            err instanceof Error ? err.message : t('api.agentDeleteFailed'),
            500
        )
    }
}

export default deleteClawAgent