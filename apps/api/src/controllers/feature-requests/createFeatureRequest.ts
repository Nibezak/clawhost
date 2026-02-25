import type { CreateFeatureRequestBody } from '@/ts/Interfaces'
import type { AuthenticatedContext, FeatureRequestPlatform } from '@/ts/Types'

import { eq, count } from 'drizzle-orm'
import { inputValidation } from '@openclaw/shared'
import { db } from '@/db'
import { featureRequests, featureUpvotes } from '@/db/schema'
import { ok, fail } from '@/lib/response'
import { t } from '@openclaw/i18n'

const VALID_PLATFORMS: FeatureRequestPlatform[] = ['desktop', 'mobile', 'web']

const titleLimits = inputValidation.FEATURE_REQUEST_TITLE
const descLimits = inputValidation.FEATURE_REQUEST_DESCRIPTION

const createFeatureRequest = async (c: AuthenticatedContext) => {
    try {
        const userId = c.get('userId')
        const { title, description, platforms } =
            await c.req.json<CreateFeatureRequestBody>()

        if (!title || !title.trim()) {
            return fail(c, t('api.featureRequestTitleRequired'), 400)
        }

        if (!description || !description.trim()) {
            return fail(c, t('api.featureRequestDescriptionRequired'), 400)
        }

        if (title.trim().length < titleLimits.MIN) {
            return fail(
                c,
                t('api.featureRequestTitleTooShort', {
                    min: String(titleLimits.MIN)
                }),
                400
            )
        }

        if (title.trim().length > titleLimits.MAX) {
            return fail(
                c,
                t('api.featureRequestTitleTooLong', {
                    max: String(titleLimits.MAX)
                }),
                400
            )
        }

        if (description.trim().length < descLimits.MIN) {
            return fail(
                c,
                t('api.featureRequestDescriptionTooShort', {
                    min: String(descLimits.MIN)
                }),
                400
            )
        }

        if (description.trim().length > descLimits.MAX) {
            return fail(
                c,
                t('api.featureRequestDescriptionTooLong', {
                    max: String(descLimits.MAX)
                }),
                400
            )
        }

        if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
            return fail(c, t('api.platformRequired'), 400)
        }

        const uniquePlatforms = [...new Set(platforms)]
        if (
            uniquePlatforms.some(
                (p) => !VALID_PLATFORMS.includes(p as FeatureRequestPlatform)
            )
        ) {
            return fail(c, t('api.invalidPlatform'), 400)
        }

        const [{ value: totalCount }] = await db
            .select({ value: count() })
            .from(featureRequests)

        if (totalCount >= inputValidation.TOTAL_FEATURE_REQUESTS.MAX) {
            return fail(
                c,
                t('api.featureRequestTotalLimitReached', {
                    limit: String(inputValidation.TOTAL_FEATURE_REQUESTS.MAX)
                }),
                400
            )
        }

        const [{ value: openCount }] = await db
            .select({ value: count() })
            .from(featureRequests)
            .where(eq(featureRequests.userId, userId))

        if (openCount >= inputValidation.OPEN_FEATURE_REQUESTS_PER_USER.MAX) {
            return fail(
                c,
                t('api.featureRequestLimitReached', {
                    limit: String(
                        inputValidation.OPEN_FEATURE_REQUESTS_PER_USER.MAX
                    )
                }),
                400
            )
        }

        const id = crypto.randomUUID()
        await db.insert(featureRequests).values({
            id,
            userId,
            title: title.trim(),
            description: description.trim(),
            platforms: uniquePlatforms,
            upvoteCount: 1
        })

        await db.insert(featureUpvotes).values({
            id: crypto.randomUUID(),
            userId,
            featureRequestId: id
        })

        return ok(
            c,
            {
                id,
                title: title.trim(),
                description: description.trim(),
                status: 'awaiting_approval',
                platforms: uniquePlatforms,
                upvoteCount: 1,
                userId,
                hasUpvoted: true
            },
            t('api.featureRequestCreated')
        )
    } catch {
        return fail(c, t('api.failedToCreateFeatureRequest'), 500)
    }
}

export default createFeatureRequest