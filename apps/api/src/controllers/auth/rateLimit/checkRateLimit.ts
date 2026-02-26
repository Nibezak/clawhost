import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { rateLimits } from '@/db/schema'

const RATE_LIMIT_WINDOW = 60_000

const checkRateLimit = async (
    key: string,
    windowMs: number = RATE_LIMIT_WINDOW
): Promise<number> => {
    const record = await db
        .select()
        .from(rateLimits)
        .where(eq(rateLimits.key, key))
        .then((rows) => rows[0])

    if (!record) return 0
    const elapsed = Date.now() - record.lastSentAt.getTime()
    if (elapsed >= windowMs) return 0
    return Math.ceil((windowMs - elapsed) / 1000)
}

export default checkRateLimit