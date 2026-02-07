import type { Context } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import { orders } from '@/lib/polar'

const getBillingHistory = async (c: Context<{ Variables: { userId: string } }>) => {
  try {
    const userId = c.get('userId')
    const page = Math.max(1, parseInt(c.req.query('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') || '10', 10)))

    const user = await db
      .select({ polarCustomerId: users.polarCustomerId })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    const polarCustomerId = user[0]?.polarCustomerId
    if (!polarCustomerId) {
      return c.json({
        items: [],
        total: 0,
        page,
        totalPages: 1,
      })
    }

    const result = await orders.listByCustomer(polarCustomerId, page, limit)

    return c.json({
      items: result.items,
      total: result.totalCount,
      page,
      totalPages: result.maxPage,
    })
  } catch (err) {
    console.error('Get billing history error:', err)
    return c.json({ error: 'Failed to get billing history' }, 500)
  }
}

export default getBillingHistory
