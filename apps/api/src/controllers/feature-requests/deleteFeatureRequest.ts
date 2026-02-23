import type { AuthenticatedContext } from '@/ts/Types'

import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { featureRequests } from '@/db/schema'
import { ok, fail } from '@/lib/response'
import { t } from '@openclaw/i18n'

const deleteFeatureRequest = async (c: AuthenticatedContext) => {
    try {
        const id = c.req.param('id')

        const [existing] = await db
            .select({ id: featureRequests.id })
            .from(featureRequests)
            .where(eq(featureRequests.id, id))

        if (!existing) {
            return fail(c, t('api.featureRequestNotFound'), 404)
        }

        await db.delete(featureRequests).where(eq(featureRequests.id, id))

        return ok(c, null, t('api.featureRequestDeleted'))
    } catch {
        return fail(c, t('api.failedToDeleteFeatureRequest'), 500)
    }
}

export default deleteFeatureRequest