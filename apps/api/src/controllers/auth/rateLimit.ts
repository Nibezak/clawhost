import type { Context } from 'hono'

import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { rateLimits } from '@/db/schema'

const RATE_LIMIT_WINDOW = 60_000

const getClientIp = (c: Context): string | null => {
    return (
        c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
        c.req.header('x-real-ip') ||
        null
    )
}

const checkRateLimit = async (key: string): Promise<number> => {
    const record = await db
        .select()
        .from(rateLimits)
        .where(eq(rateLimits.key, key))
        .then((rows) => rows[0])

    if (!record) return 0
    const elapsed = Date.now() - record.lastSentAt.getTime()
    if (elapsed >= RATE_LIMIT_WINDOW) return 0
    return Math.ceil((RATE_LIMIT_WINDOW - elapsed) / 1000)
}

const setRateLimit = async (...keys: string[]): Promise<void> => {
    const now = new Date()
    await Promise.all(
        keys.map((key) =>
            db
                .insert(rateLimits)
                .values({ key, lastSentAt: now })
                .onConflictDoUpdate({
                    target: rateLimits.key,
                    set: { lastSentAt: now }
                })
        )
    )
}

export { getClientIp, checkRateLimit, setRateLimit }