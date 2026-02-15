import type { AuthenticatedContext } from '@/ts/Types'

import executeSSH from '@/services/ssh'
import { findUserClaw } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'

const BASE_DIR = '/home/openclaw/.openclaw'

const listClawFiles = async (c: AuthenticatedContext) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')
        const claw = await findUserClaw(userId, id)

        if (!claw) {
            return fail(c, t('api.clawNotFound'), 404)
        }

        if (!claw.ip || !claw.rootPassword) {
            return fail(c, t('api.failedToListFiles'), 400)
        }

        const output = await executeSSH(
            claw.ip,
            claw.rootPassword,
            `find -P ${BASE_DIR} -type f 2>/dev/null | sort`
        )

        const files = output
            .split('\n')
            .filter((line) => line.trim().length > 0)
            .map((fullPath) => {
                const relativePath = fullPath.replace(`${BASE_DIR}/`, '')
                const name = relativePath.split('/').pop() || relativePath
                return {
                    path: relativePath,
                    name,
                    isJson: name.endsWith('.json')
                }
            })

        return ok(c, { files }, t('api.filesFetched'))
    } catch {
        return fail(c, t('api.failedToListFiles'), 500)
    }
}

export default listClawFiles