import 'dotenv/config'
import { sql } from 'drizzle-orm'
import { db } from '@/db'

const syncUpvoteCounts = async () => {
    const result = await db.execute(sql`
        UPDATE feature_requests
        SET upvote_count = (
            SELECT COUNT(*)
            FROM feature_upvotes
            WHERE feature_upvotes.feature_request_id = feature_requests.id
        )
        WHERE upvote_count != (
            SELECT COUNT(*)
            FROM feature_upvotes
            WHERE feature_upvotes.feature_request_id = feature_requests.id
        )
    `)

    console.error(`Synced upvote counts. Rows updated: ${result.rowCount}`)
}

syncUpvoteCounts()