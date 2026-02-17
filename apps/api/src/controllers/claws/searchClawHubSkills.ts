import type { SearchClawHubSkillsBody } from '@/ts/Interfaces'
import type { AuthenticatedContext } from '@/ts/Types'

import { findUserClaw } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'
import { searchSkills } from '@/services/clawhub'

const searchClawHubSkills = async (c: AuthenticatedContext) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')
        const body = await c.req.json<SearchClawHubSkillsBody>()

        const claw = await findUserClaw(userId, id)

        if (!claw) {
            return fail(c, t('api.clawNotFound'), 404)
        }

        const result = await searchSkills({
            query: body.query,
            limit: body.limit,
            page: body.page,
            cursor: body.cursor
        })

        return ok(c, {
            skills: result.skills,
            nextCursor: result.nextCursor,
            hasMore: result.hasMore
        }, t('api.clawHubSearchSuccess'))
    } catch {
        return fail(c, t('api.clawHubSearchFailed'), 500)
    }
}

export default searchClawHubSkills