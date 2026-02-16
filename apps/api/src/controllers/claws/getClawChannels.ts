import type { AuthenticatedContext } from '@/ts/Types'

import executeSSH from '@/services/ssh'
import { findUserClaw } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'

const BASE_DIR = '/home/openclaw/.openclaw'

const getClawChannels = async (c: AuthenticatedContext) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')
        const claw = await findUserClaw(userId, id)

        if (!claw) {
            return fail(c, t('api.clawNotFound'), 404)
        }

        if (!claw.ip || !claw.rootPassword) {
            return fail(c, t('api.channelsFetchFailed'), 400)
        }

        try {
            const output = await executeSSH(
                claw.ip,
                claw.rootPassword,
                `cat ${BASE_DIR}/openclaw.json 2>/dev/null || echo '{}'`,
                5000
            )

            let channels: Record<string, unknown> = {}

            try {
                const config = JSON.parse(output.trim())
                channels = config?.channels || {}
            } catch {
                channels = {}
            }

            return ok(c, { channels }, t('api.channelsFetched'))
        } catch {
            return fail(c, t('api.channelsFetchFailed'), 500)
        }
    } catch {
        return fail(c, t('api.channelsFetchFailed'), 500)
    }
}

export default getClawChannels