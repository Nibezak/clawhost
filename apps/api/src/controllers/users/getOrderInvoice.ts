import type { Context } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import { orders } from '@/lib/polar'
import { t } from '@openclaw/i18n'

const getOrderInvoice = async (c: Context<{ Variables: { userId: string } }>) => {
  try {
    const userId = c.get('userId')
    const orderId = c.req.param('orderId')

    if (!orderId) {
      return c.json({ error: t('api.orderIdRequired') }, 400)
    }

    const user = await db
      .select({ polarCustomerId: users.polarCustomerId })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    const polarCustomerId = user[0]?.polarCustomerId
    if (!polarCustomerId) {
      return c.json({ error: t('api.noBillingAccount') }, 404)
    }

    const invoiceUrl = await orders.getInvoiceUrl(orderId)

    return c.json({ url: invoiceUrl })
  } catch (err) {
    console.error('Get order invoice error:', err)
    return c.json({ error: t('api.failedToGetInvoice') }, 500)
  }
}

export default getOrderInvoice
