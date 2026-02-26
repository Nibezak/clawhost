import { db } from '@/db'
import { rateLimits } from '@/db/schema'

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

export default setRateLimit