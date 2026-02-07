import type { Context } from 'hono'
import { eq, count } from 'drizzle-orm'
import { db } from '@/db'
import { claws, sshKeys, users } from '@/db/schema'
import { orders } from '@/lib/polar'

const getUserStats = async (c: Context<{ Variables: { userId: string } }>) => {
  try {
    const userId = c.get('userId')

    const [clawResult, sshKeyResult, userResult] = await Promise.all([
      db.select({ count: count() }).from(claws).where(eq(claws.userId, userId)),
      db.select({ count: count() }).from(sshKeys).where(eq(sshKeys.userId, userId)),
      db.select({ polarCustomerId: users.polarCustomerId }).from(users).where(eq(users.id, userId)).limit(1),
    ])

    let orderCount = 0
    const polarCustomerId = userResult[0]?.polarCustomerId
    if (polarCustomerId) {
      try {
        const result = await orders.listByCustomer(polarCustomerId, 1, 1)
        orderCount = result.totalCount
      } catch {
        // If Polar is unreachable, default to 0
      }
    }

    return c.json({
      clawCount: clawResult[0]?.count || 0,
      sshKeyCount: sshKeyResult[0]?.count || 0,
      orderCount,
    })
  } catch (err) {
    console.error('Get user stats error:', err)
    return c.json({ error: 'Failed to get stats' }, 500)
  }
}

export default getUserStats
