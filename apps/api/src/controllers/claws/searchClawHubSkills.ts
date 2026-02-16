import type { SearchClawHubSkillsBody } from '@/ts/Interfaces'
import type { AuthenticatedContext } from '@/ts/Types'

import executeSSH from '@/services/ssh'
import { findUserClaw } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'

const ENSURE_CLAWHUB = 'command -v clawhub >/dev/null 2>&1 || npm install -g clawhub >/dev/null 2>&1;'

const searchClawHubSkills = async (c: AuthenticatedContext) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')
        const body = await c.req.json<SearchClawHubSkillsBody>()

        const claw = await findUserClaw(userId, id)

        if (!claw) {
            return fail(c, t('api.clawNotFound'), 404)
        }

        if (!claw.ip || !claw.rootPassword) {
            return fail(c, t('api.clawHubSearchFailed'), 400)
        }

        try {
            const limit = body.limit || 20
            const page = body.page || 1
            const query = (body.query || '').trim()
            const safeQuery = query.replace(/"/g, '\\"')

            let cmd = query
                ? `clawhub search "${safeQuery}" --json --limit ${limit} --offset ${(page - 1) * limit}`
                : `clawhub explore --json --limit ${limit} --offset ${(page - 1) * limit}`

            cmd = `${ENSURE_CLAWHUB} ${cmd} 2>&1 || echo '[]'`

            console.error('[clawhub:search] SSH cmd:', cmd)
            console.error('[clawhub:search] target:', claw.ip)

            const output = await executeSSH(
                claw.ip,
                claw.rootPassword,
                cmd,
                30000
            )

            console.error('[clawhub:search] raw output:', output)

            let skills = []
            try {
                const parsed = JSON.parse(output.trim())
                skills = Array.isArray(parsed) ? parsed : parsed.skills || []
                console.error('[clawhub:search] parsed skills count:', skills.length)
            } catch (parseErr) {
                console.error('[clawhub:search] JSON parse failed:', parseErr)
                skills = []
            }

            return ok(c, { skills }, t('api.clawHubSearchSuccess'))
        } catch (sshErr) {
            console.error('[clawhub:search] SSH error:', sshErr)
            return fail(c, t('api.clawHubSearchFailed'), 500)
        }
    } catch {
        return fail(c, t('api.clawHubSearchFailed'), 500)
    }
}

export default searchClawHubSkills