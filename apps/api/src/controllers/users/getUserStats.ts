import type { Context } from 'hono'
import { eq, count } from 'drizzle-orm'
import { db } from '../../db'
import { claws } from '../../db/schema'

const getUserStats = async (c: Context<{ Variables: { userId: string } }>) => {
  try {
    const userId = c.get('userId')

    const result = await db.select({ count: count() }).from(claws).where(eq(claws.userId, userId))

    return c.json({ clawCount: result[0]?.count || 0 })
  } catch (err) {
    console.error('Get user stats error:', err)
    return c.json({ error: 'Failed to get stats' }, 500)
  }
}

export default getUserStats
