import type { UpdateClawFileBody } from '@/ts/Interfaces'
import type { AuthenticatedContext } from '@/ts/Types'

import path from 'path'
import { findUserClaw, safeShellWrite } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'

const BASE_DIR = '/home/openclaw/.openclaw'

const updateClawFile = async (c: AuthenticatedContext) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')
        const body = await c.req.json<UpdateClawFileBody>()

        if (
            !body.path ||
            typeof body.path !== 'string' ||
            !body.content ||
            typeof body.content !== 'string'
        ) {
            return fail(c, t('api.missingRequiredFields'), 400)
        }

        if (body.content.length > 1024 * 1024) {
            return fail(c, t('api.fileTooLarge'), 400)
        }

        const normalized = path.posix.normalize(body.path)
        if (
            normalized.includes('..') ||
            normalized.startsWith('/') ||
            normalized.includes('\0')
        ) {
            return fail(c, t('api.invalidFilePath'), 400)
        }

        if (!normalized.endsWith('.json')) {
            return fail(c, t('api.fileNotEditable'), 400)
        }

        try {
            JSON.parse(body.content)
        } catch {
            return fail(c, t('api.invalidJsonConfig'), 400)
        }

        const claw = await findUserClaw(userId, id)

        if (!claw) {
            return fail(c, t('api.clawNotFound'), 404)
        }

        if (!claw.ip || !claw.rootPassword) {
            return fail(c, t('api.failedToUpdateFile'), 400)
        }

        const fullPath = `${BASE_DIR}/${normalized}`

        await safeShellWrite(claw.ip, claw.rootPassword, fullPath, body.content)

        return ok(c, null, t('api.fileSaveSuccess'))
    } catch {
        return fail(c, t('api.failedToUpdateFile'), 500)
    }
}

export default updateClawFile