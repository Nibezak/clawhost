import type { ClawHubUpdateBody } from '@/ts/Interfaces'
import type { AuthenticatedContext } from '@/ts/Types'

import executeSSH from '@/services/ssh'
import { findUserClaw } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'

const SLUG_REGEX = /^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)?$/
const BASE_DIR = '/home/openclaw/.openclaw'
const ENSURE_CLAWHUB = 'command -v clawhub >/dev/null 2>&1 || npm install -g clawhub >/dev/null 2>&1;'

const updateClawHubSkill = async (c: AuthenticatedContext) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')
        const body = await c.req.json<ClawHubUpdateBody>()

        if (!body.slug && !body.all) {
            return fail(c, t('api.missingRequiredFields'), 400)
        }

        if (body.slug && !SLUG_REGEX.test(body.slug)) {
            return fail(c, t('api.invalidSkillName'), 400)
        }

        const claw = await findUserClaw(userId, id)

        if (!claw) {
            return fail(c, t('api.clawNotFound'), 404)
        }

        if (!claw.ip || !claw.rootPassword) {
            return fail(c, t('api.clawHubUpdateFailed'), 400)
        }

        try {
            let cmd = body.all ? 'clawhub update --all' : `clawhub update ${body.slug}`

            if (body.agentId) {
                const agentDir = `${BASE_DIR}/agents/${body.agentId}/workspace/skills`
                cmd = `${cmd} --workdir ${agentDir}`
            }

            cmd = `${ENSURE_CLAWHUB} ${cmd} && systemctl restart openclaw-gateway`

            await executeSSH(
                claw.ip,
                claw.rootPassword,
                cmd,
                45000
            )

            return ok(c, null, t('api.clawHubUpdated'))
        } catch {
            return fail(c, t('api.clawHubUpdateFailed'), 500)
        }
    } catch {
        return fail(c, t('api.clawHubUpdateFailed'), 500)
    }
}

export default updateClawHubSkill