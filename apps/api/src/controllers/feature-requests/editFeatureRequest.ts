import type { EditFeatureRequestBody } from '@/ts/Interfaces'
import type { AuthenticatedContext, FeatureRequestPlatform, FeatureRequestStatus } from '@/ts/Types'

import { eq, and, count } from 'drizzle-orm'
import { inputValidation } from '@openclaw/shared'
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

const VALID_PLATFORMS: FeatureRequestPlatform[] = ['desktop', 'mobile', 'web']

const MAX_IN_PROGRESS_PER_USER = 3

const titleLimits = inputValidation.FEATURE_REQUEST_TITLE
const descLimits = inputValidation.FEATURE_REQUEST_DESCRIPTION

const editFeatureRequest = async (c: AuthenticatedContext) => {
    try {
        const id = c.req.param('id')
        const body = await c.req.json<EditFeatureRequestBody>()

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

        if (body.title !== undefined && !body.title.trim()) {
            return fail(c, t('api.featureRequestTitleRequired'), 400)
        }

        if (
            body.title !== undefined &&
            body.title.trim().length < titleLimits.MIN
        ) {
            return fail(
                c,
                t('api.featureRequestTitleTooShort', {
                    min: String(titleLimits.MIN)
                }),
                400
            )
        }

        if (
            body.title !== undefined &&
            body.title.trim().length > titleLimits.MAX
        ) {
            return fail(
                c,
                t('api.featureRequestTitleTooLong', {
                    max: String(titleLimits.MAX)
                }),
                400
            )
        }

        if (body.description !== undefined && !body.description.trim()) {
            return fail(c, t('api.featureRequestDescriptionRequired'), 400)
        }

        if (
            body.description !== undefined &&
            body.description.trim().length < descLimits.MIN
        ) {
            return fail(
                c,
                t('api.featureRequestDescriptionTooShort', {
                    min: String(descLimits.MIN)
                }),
                400
            )
        }

        if (
            body.description !== undefined &&
            body.description.trim().length > descLimits.MAX
        ) {
            return fail(
                c,
                t('api.featureRequestDescriptionTooLong', {
                    max: String(descLimits.MAX)
                }),
                400
            )
        }

        if (
            body.status !== undefined &&
            !VALID_STATUSES.includes(body.status)
        ) {
            return fail(c, t('api.featureRequestInvalidStatus'), 400)
        }

        if (
            body.platforms !== undefined &&
            (!Array.isArray(body.platforms) || body.platforms.length === 0)
        ) {
            return fail(c, t('api.platformRequired'), 400)
        }

        if (body.platforms !== undefined) {
            const uniquePlatforms = [...new Set(body.platforms)]
            if (uniquePlatforms.some((p) => !VALID_PLATFORMS.includes(p as FeatureRequestPlatform))) {
                return fail(c, t('api.invalidPlatform'), 400)
            }
        }

        if (
            body.status === 'marked_for_implementation' &&
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

        const updates: Record<string, unknown> = {}

        if (body.title !== undefined) {
            updates.title = body.title.trim()
        }

        if (body.description !== undefined) {
            updates.description = body.description.trim()
        }

        if (body.status !== undefined) {
            updates.status = body.status
        }

        if (body.platforms !== undefined) {
            updates.platforms = [...new Set(body.platforms)]
        }

        if (Object.keys(updates).length === 0) {
            return fail(c, t('api.noChangesProvided'), 400)
        }

        await db
            .update(featureRequests)
            .set(updates)
            .where(eq(featureRequests.id, id))

        return ok(c, null, t('api.featureRequestUpdated'))
    } catch {
        return fail(c, t('api.failedToUpdateFeatureRequest'), 500)
    }
}

export default editFeatureRequest