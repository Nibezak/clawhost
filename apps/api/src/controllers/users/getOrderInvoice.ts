import type { Context } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { users } from '../../db/schema'
import { orders } from '../../lib/polar'

const getOrderInvoice = async (c: Context<{ Variables: { userId: string } }>) => {
  try {
    const userId = c.get('userId')
    const orderId = c.req.param('orderId')

    if (!orderId) {
      return c.json({ error: 'Order ID is required' }, 400)
    }

    const user = await db
      .select({ polarCustomerId: users.polarCustomerId })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    const polarCustomerId = user[0]?.polarCustomerId
    if (!polarCustomerId) {
      return c.json({ error: 'No billing account found' }, 404)
    }

    const invoiceUrl = await orders.getInvoiceUrl(orderId)

    return c.json({ url: invoiceUrl })
  } catch (err) {
    console.error('Get order invoice error:', err)
    return c.json({ error: 'Failed to get invoice' }, 500)
  }
}

export default getOrderInvoice
