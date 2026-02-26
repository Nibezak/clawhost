import type { AuthenticatedContext } from '@/ts/Types'

import { eq, and, sql } from 'drizzle-orm'
import { db } from '@/db'
import { featureRequests, featureUpvotes } from '@/db/schema'
import { ok, fail } from '@/lib/response'
import { t } from '@openclaw/i18n'

const syncUpvoteCount = (id: string) =>
    db
        .update(featureRequests)
        .set({
            upvoteCount: sql`(SELECT COUNT(*) FROM feature_upvotes WHERE feature_request_id = ${id})`
        })
        .where(eq(featureRequests.id, id))

const upvoteFeatureRequest = async (c: AuthenticatedContext) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')

        const [request] = await db
            .select({ id: featureRequests.id })
            .from(featureRequests)
            .where(eq(featureRequests.id, id))

        if (!request) {
            return fail(c, t('api.featureRequestNotFound'), 404)
        }

        const [existing] = await db
            .select({ id: featureUpvotes.id })
            .from(featureUpvotes)
            .where(
                and(
                    eq(featureUpvotes.userId, userId),
                    eq(featureUpvotes.featureRequestId, id)
                )
            )

        if (existing) {
            await db
                .delete(featureUpvotes)
                .where(eq(featureUpvotes.id, existing.id))

            await syncUpvoteCount(id)

            const [updated] = await db
                .select({ upvoteCount: featureRequests.upvoteCount })
                .from(featureRequests)
                .where(eq(featureRequests.id, id))

            return ok(
                c,
                {
                    upvoteCount: updated.upvoteCount,
                    hasUpvoted: false
                },
                t('api.featureRequestUpvoted')
            )
        }

        await db.insert(featureUpvotes).values({
            id: crypto.randomUUID(),
            userId,
            featureRequestId: id
        })

        await syncUpvoteCount(id)

        const [updated] = await db
            .select({ upvoteCount: featureRequests.upvoteCount })
            .from(featureRequests)
            .where(eq(featureRequests.id, id))

        return ok(
            c,
            {
                upvoteCount: updated.upvoteCount,
                hasUpvoted: true
            },
            t('api.featureRequestUpvoted')
        )
    } catch {
        return fail(c, t('api.failedToUpvoteFeatureRequest'), 500)
    }
}

export default upvoteFeatureRequest