import type { AuthenticatedContext } from '@/ts/Types'
import type { Next } from 'hono'

import { isAdmin } from '@/controllers/claws/helpers'
import { fail } from '@/lib/response'
import { t } from '@openclaw/i18n'

const adminOnly = async (c: AuthenticatedContext, next: Next) => {
    const userId = c.get('userId')
    const admin = await isAdmin(userId)

    if (!admin) {
        return fail(c, t('api.adminAccessDenied'), 403)
    }

    return next()
}

export default adminOnly