import type { UpdateFeatureRequestStatusBody } from '@/ts/Interfaces'
import type { AuthenticatedContext, FeatureRequestStatus } from '@/ts/Types'

import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { featureRequests } from '@/db/schema'
import { ok, fail } from '@/lib/response'
import { t } from '@openclaw/i18n'

const VALID_STATUSES: FeatureRequestStatus[] = [
    'awaiting_approval',
    'requested',
    'marked_for_implementation',
    'implemented',
    'rejected'
]

const updateFeatureRequestStatus = async (c: AuthenticatedContext) => {
    try {
        const id = c.req.param('id')
        const { status, rejectionReason } =
            await c.req.json<UpdateFeatureRequestStatusBody>()

        if (!VALID_STATUSES.includes(status)) {
            return fail(c, t('api.featureRequestInvalidStatus'), 400)
        }

        if (
            status === 'rejected' &&
            (!rejectionReason || !rejectionReason.trim())
        ) {
            return fail(c, t('api.featureRequestRejectionReasonRequired'), 400)
        }

        const [existing] = await db
            .select({ id: featureRequests.id })
            .from(featureRequests)
            .where(eq(featureRequests.id, id))

        if (!existing) {
            return fail(c, t('api.featureRequestNotFound'), 404)
        }

        await db
            .update(featureRequests)
            .set({
                status,
                rejectionReason:
                    status === 'rejected' ? rejectionReason?.trim() : null
            })
            .where(eq(featureRequests.id, id))

        return ok(c, null, t('api.featureRequestStatusUpdated'))
    } catch {
        return fail(c, t('api.failedToUpdateFeatureRequestStatus'), 500)
    }
}

export default updateFeatureRequestStatus