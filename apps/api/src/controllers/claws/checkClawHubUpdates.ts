import type { AuthenticatedContext } from '@/ts/Types'

import executeSSH from '@/services/ssh'
import { findUserClaw } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'

const BASE_DIR = '/home/openclaw/.openclaw'
const ENSURE_CLAWHUB = 'command -v clawhub >/dev/null 2>&1 || npm install -g clawhub >/dev/null 2>&1;'

const checkClawHubUpdates = async (c: AuthenticatedContext) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')
        const claw = await findUserClaw(userId, id)

        if (!claw) {
            return fail(c, t('api.clawNotFound'), 404)
        }

        if (!claw.ip || !claw.rootPassword) {
            return fail(c, t('api.clawHubUpdatesFailed'), 400)
        }

        try {
            let agentId: string | undefined
            try {
                const body = await c.req.json<{ agentId?: string }>()
                agentId = body.agentId
            } catch {
                agentId = undefined
            }

            let cmd = 'clawhub outdated --json'

            if (agentId) {
                const agentDir = `${BASE_DIR}/agents/${agentId}/workspace/skills`
                cmd = `${cmd} --workdir ${agentDir}`
            }

            cmd = `${ENSURE_CLAWHUB} ${cmd} 2>/dev/null || echo '[]'`

            const output = await executeSSH(
                claw.ip,
                claw.rootPassword,
                cmd,
                30000
            )

            let updates = []
            try {
                const parsed = JSON.parse(output.trim())
                updates = Array.isArray(parsed) ? parsed : parsed.updates || []
            } catch {
                updates = []
            }

            return ok(c, { updates }, t('api.clawHubUpdatesFetched'))
        } catch {
            return fail(c, t('api.clawHubUpdatesFailed'), 500)
        }
    } catch {
        return fail(c, t('api.clawHubUpdatesFailed'), 500)
    }
}

export default checkClawHubUpdates