import type { AuthenticatedContext } from '@/ts/Types'

import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { featureRequests, users } from '@/db/schema'
import { ok, fail } from '@/lib/response'
import { t } from '@openclaw/i18n'

const deleteFeatureRequest = async (c: AuthenticatedContext) => {
    try {
        const id = c.req.param('id')
        const userId = c.get('userId')

        const [existing] = await db
            .select({
                id: featureRequests.id,
                userId: featureRequests.userId
            })
            .from(featureRequests)
            .where(eq(featureRequests.id, id))

        if (!existing) {
            return fail(c, t('api.featureRequestNotFound'), 404)
        }

        const [currentUser] = await db
            .select({ role: users.role })
            .from(users)
            .where(eq(users.id, userId))

        const isAdmin = currentUser?.role === 'admin'

        if (existing.userId !== userId && !isAdmin) {
            return fail(c, t('api.unauthorized'), 403)
        }

        await db.delete(featureRequests).where(eq(featureRequests.id, id))

        return ok(c, null, t('api.featureRequestDeleted'))
    } catch {
        return fail(c, t('api.failedToDeleteFeatureRequest'), 500)
    }
}

export default deleteFeatureRequest