import type { FeatureRequestResponse } from '@/ts/Interfaces'
import type { AuthenticatedContext, FeatureRequestSortBy } from '@/ts/Types'

import { desc, sql, ne, and, or, eq } from 'drizzle-orm'
import { db } from '@/db'
import { featureRequests, featureUpvotes } from '@/db/schema'
import { ok } from '@/lib/response'
import { isAdmin } from '@/controllers/claws/helpers'

const statusOrder = sql`CASE ${featureRequests.status}
    WHEN 'awaiting_approval' THEN 1
    WHEN 'requested' THEN 2
    WHEN 'marked_for_implementation' THEN 3
    WHEN 'implemented' THEN 4
    ELSE 5
END`

const getFeatureRequests = async (c: AuthenticatedContext) => {
    try {
        const sort = (c.req.query('sort') || 'upvotes') as FeatureRequestSortBy
        const userId = c.get('userId') as string | undefined

        const admin = userId ? await isAdmin(userId) : false

        const secondaryOrder =
            sort === 'newest'
                ? desc(featureRequests.createdAt)
                : desc(featureRequests.upvoteCount)

        const statusFilter = admin
            ? ne(featureRequests.status, 'rejected')
            : and(
                ne(featureRequests.status, 'rejected'),
                or(
                    ne(featureRequests.status, 'awaiting_approval'),
                    userId ? eq(featureRequests.userId, userId) : undefined
                )
            )

        const rows = await db
            .select({
                id: featureRequests.id,
                title: featureRequests.title,
                description: featureRequests.description,
                status: featureRequests.status,
                platforms: featureRequests.platforms,
                upvoteCount: featureRequests.upvoteCount,
                userId: featureRequests.userId,
                upvoteId: featureUpvotes.id
            })
            .from(featureRequests)
            .leftJoin(
                featureUpvotes,
                userId
                    ? and(
                        eq(featureUpvotes.featureRequestId, featureRequests.id),
                        eq(featureUpvotes.userId, userId)
                    )
                    : sql`false`
            )
            .where(statusFilter)
            .orderBy(statusOrder, secondaryOrder, desc(featureRequests.createdAt))

        const items: FeatureRequestResponse[] = rows.map((row) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            status: row.status as FeatureRequestResponse['status'],
            platforms: (row.platforms ?? []) as string[],
            upvoteCount: row.upvoteCount,
            userId: row.userId,
            hasUpvoted: row.upvoteId !== null
        }))

        return ok(c, { items, total: items.length })
    } catch {
        return ok(c, { items: [], total: 0 })
    }
}

export default getFeatureRequests