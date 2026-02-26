import type { UpdateFeatureRequestStatusBody } from '@/ts/Interfaces'
import type { AuthenticatedContext, FeatureRequestStatus } from '@/ts/Types'

import { eq, and, count } from 'drizzle-orm'
import { db } from '@/db'
import { featureRequests } from '@/db/schema'
import { ok, fail } from '@/lib/response'
import { t } from '@openclaw/i18n'

const VALID_STATUSES: FeatureRequestStatus[] = [
    'awaiting_approval',
    'requested',
    'marked_for_implementation',
    'implemented'
]

const MAX_IN_PROGRESS_PER_USER = 3

const updateFeatureRequestStatus = async (c: AuthenticatedContext) => {
    try {
        const id = c.req.param('id')
        const { status } =
            await c.req.json<UpdateFeatureRequestStatusBody>()

        if (!VALID_STATUSES.includes(status)) {
            return fail(c, t('api.featureRequestInvalidStatus'), 400)
        }

        const [existing] = await db
            .select({
                id: featureRequests.id,
                userId: featureRequests.userId,
                status: featureRequests.status
            })
            .from(featureRequests)
            .where(eq(featureRequests.id, id))

        if (!existing) {
            return fail(c, t('api.featureRequestNotFound'), 404)
        }

        if (
            status === 'marked_for_implementation' &&
            existing.status !== 'marked_for_implementation'
        ) {
            const [{ value: inProgressCount }] = await db
                .select({ value: count() })
                .from(featureRequests)
                .where(
                    and(
                        eq(featureRequests.userId, existing.userId),
                        eq(featureRequests.status, 'marked_for_implementation')
                    )
                )

            if (inProgressCount >= MAX_IN_PROGRESS_PER_USER) {
                return fail(
                    c,
                    t('api.featureRequestImplementationLimitReached', {
                        limit: String(MAX_IN_PROGRESS_PER_USER)
                    }),
                    400
                )
            }
        }

        await db
            .update(featureRequests)
            .set({ status })
            .where(eq(featureRequests.id, id))

        return ok(c, null, t('api.featureRequestStatusUpdated'))
    } catch {
        return fail(c, t('api.failedToUpdateFeatureRequestStatus'), 500)
    }
}

export default updateFeatureRequestStatus