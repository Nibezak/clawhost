import type { Context } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { users } from '../../db/schema'
import { getPolarClient } from '../../lib/polar'

const getCustomerPortal = async (c: Context<{ Variables: { userId: string } }>) => {
  try {
    const userId = c.get('userId')

    const user = await db
      .select({ polarCustomerId: users.polarCustomerId })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    const polarCustomerId = user[0]?.polarCustomerId
    if (!polarCustomerId) {
      return c.json({ error: 'No billing account found' }, 404)
    }

    const clientUrl = process.env.CLIENT
    const http = clientUrl?.includes('localhost') ? 'http' : 'https'
    const returnUrl = `${http}://${clientUrl}/account`

    const polar = getPolarClient()
    const session = await polar.customerSessions.create({
      customerId: polarCustomerId,
      returnUrl,
    })

    return c.json({ url: session.customerPortalUrl })
  } catch (err) {
    console.error('Get customer portal error:', err)
    return c.json({ error: 'Failed to get customer portal' }, 500)
  }
}

export default getCustomerPortal
