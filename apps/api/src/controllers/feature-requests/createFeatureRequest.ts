import type { CreateFeatureRequestBody } from '@/ts/Interfaces'
import type { AuthenticatedContext } from '@/ts/Types'

import { eq, count } from 'drizzle-orm'
import { db } from '@/db'
import { featureRequests, users } from '@/db/schema'
import { ok, fail } from '@/lib/response'
import { t } from '@openclaw/i18n'

const MAX_OPEN_REQUESTS_PER_USER = 5

const createFeatureRequest = async (c: AuthenticatedContext) => {
    try {
        const userId = c.get('userId')
        const { title, description } =
            await c.req.json<CreateFeatureRequestBody>()

        if (!title || !title.trim()) {
            return fail(c, t('api.featureRequestTitleRequired'), 400)
        }

        if (!description || !description.trim()) {
            return fail(c, t('api.featureRequestDescriptionRequired'), 400)
        }

        if (title.length > 200) {
            return fail(c, t('api.featureRequestTitleTooLong'), 400)
        }

        if (description.length > 2000) {
            return fail(c, t('api.featureRequestDescriptionTooLong'), 400)
        }

        const [{ value: openCount }] = await db
            .select({ value: count() })
            .from(featureRequests)
            .where(eq(featureRequests.userId, userId))

        if (openCount >= MAX_OPEN_REQUESTS_PER_USER) {
            return fail(
                c,
                t('api.featureRequestLimitReached', {
                    limit: String(MAX_OPEN_REQUESTS_PER_USER)
                }),
                400
            )
        }

        const id = crypto.randomUUID()
        await db.insert(featureRequests).values({
            id,
            userId,
            title: title.trim(),
            description: description.trim()
        })

        const [user] = await db
            .select({ name: users.name, email: users.email })
            .from(users)
            .where(eq(users.id, userId))

        return ok(
            c,
            {
                id,
                title: title.trim(),
                description: description.trim(),
                status: 'awaiting_approval',
                rejectionReason: null,
                upvoteCount: 0,
                userId,
                userName: user?.name ?? null,
                userEmail: user?.email ?? '',
                hasUpvoted: false,
                createdAt: new Date().toISOString()
            },
            t('api.featureRequestCreated')
        )
    } catch {
        return fail(c, t('api.failedToCreateFeatureRequest'), 500)
    }
}

export default createFeatureRequest