import type { AuthenticatedContext } from '@/ts/Types'

import executeSSH from '@/services/ssh'
import { findUserClaw } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'

const BASE_DIR = '/home/openclaw/.openclaw'

const getClawBindings = async (c: AuthenticatedContext) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')
        const claw = await findUserClaw(userId, id)

        if (!claw) {
            return fail(c, t('api.clawNotFound'), 404)
        }

        if (!claw.ip || !claw.rootPassword) {
            return fail(c, t('api.bindingsFetchFailed'), 400)
        }

        try {
            const output = await executeSSH(
                claw.ip,
                claw.rootPassword,
                `cat ${BASE_DIR}/openclaw.json 2>/dev/null || echo '{}'`,
                5000
            )

            let bindings: Array<{
                agentId: string
                match: { channel: string }
            }> = []
            let channels: Record<string, unknown> = {}
            let agents: Array<{ id: string; name: string }> = []

            try {
                const config = JSON.parse(output.trim())
                bindings = Array.isArray(config?.bindings)
                    ? config.bindings
                    : []
                channels = config?.channels || {}
                const agentList = Array.isArray(config?.agents?.list)
                    ? config.agents.list
                    : []
                agents = agentList.map((a: { id: string; name: string }) => ({
                    id: a.id,
                    name: a.name
                }))
            } catch {
                bindings = []
                channels = {}
                agents = []
            }

            return ok(
                c,
                { bindings, channels, agents },
                t('api.bindingsFetched')
            )
        } catch {
            return fail(c, t('api.bindingsFetchFailed'), 500)
        }
    } catch {
        return fail(c, t('api.bindingsFetchFailed'), 500)
    }
}

export default getClawBindings