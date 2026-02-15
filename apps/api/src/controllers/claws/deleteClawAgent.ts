import type { DeleteClawAgentBody } from '@/ts/Interfaces'
import type { AuthenticatedContext } from '@/ts/Types'

import executeSSH from '@/services/ssh'
import { findUserClaw } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'

const BASE_DIR = '/home/openclaw/.openclaw'

const deleteClawAgent = async (c: AuthenticatedContext) => {
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

        const claw = await findUserClaw(userId, id)

        if (!claw) {
            return fail(c, t('api.clawNotFound'), 404)
        }

        if (!claw.ip || !claw.rootPassword) {
            return fail(c, t('api.agentDeleteFailed'), 400)
        }

        try {
            const configOutput = await executeSSH(
                claw.ip,
                claw.rootPassword,
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
            const configB64 = Buffer.from(configJson).toString('base64')

            await executeSSH(
                claw.ip,
                claw.rootPassword,
                `echo '${configB64}' | base64 -d > ${BASE_DIR}/openclaw.json && systemctl restart openclaw-gateway`,
                15000
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