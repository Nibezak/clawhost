import type { FeatureRequestResponse } from '@/ts/Interfaces'
import type { AuthenticatedContext, FeatureRequestSortBy } from '@/ts/Types'

import { eq, desc, sql, ne } from 'drizzle-orm'
import { db } from '@/db'
import { featureRequests, users } from '@/db/schema'
import { ok } from '@/lib/response'
import { isAdmin } from '@/controllers/claws/helpers'

const getFeatureRequests = async (c: AuthenticatedContext) => {
    try {
        const sort = (c.req.query('sort') || 'upvotes') as FeatureRequestSortBy
        const userId = c.get('userId') as string | undefined

        const admin = userId ? await isAdmin(userId) : false

        const orderBy =
            sort === 'newest'
                ? desc(featureRequests.createdAt)
                : sort === 'status'
                  ? desc(featureRequests.status)
                  : desc(featureRequests.upvoteCount)

        const statusFilter = admin
            ? undefined
            : ne(featureRequests.status, 'awaiting_approval')

        const rows = await db
            .select({
                id: featureRequests.id,
                title: featureRequests.title,
                description: featureRequests.description,
                status: featureRequests.status,
                rejectionReason: featureRequests.rejectionReason,
                upvoteCount: featureRequests.upvoteCount,
                userId: featureRequests.userId,
                userName: users.name,
                userEmail: users.email,
                createdAt: featureRequests.createdAt,
                hasUpvoted: userId
                    ? sql<boolean>`EXISTS (
                        SELECT 1 FROM feature_upvotes
                        WHERE feature_upvotes.feature_request_id = ${featureRequests.id}
                        AND feature_upvotes.user_id = ${userId}
                    )`
                    : sql<boolean>`false`
            })
            .from(featureRequests)
            .innerJoin(users, eq(featureRequests.userId, users.id))
            .where(statusFilter)
            .orderBy(orderBy)

        const items: FeatureRequestResponse[] = rows.map((row) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            status: row.status as FeatureRequestResponse['status'],
            rejectionReason: row.rejectionReason,
            upvoteCount: row.upvoteCount,
            userId: row.userId,
            userName: row.userName,
            userEmail: row.userEmail,
            hasUpvoted: Boolean(row.hasUpvoted),
            createdAt: row.createdAt.toISOString()
        }))

        return ok(c, { items, total: items.length })
    } catch {
        return ok(c, { items: [], total: 0 })
    }
}

export default getFeatureRequests