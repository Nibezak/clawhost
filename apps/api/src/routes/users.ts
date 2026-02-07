import { Hono } from 'hono'
import { getCurrentUser, getBillingHistory, getOrderInvoice, getCustomerPortal, getUserStats, updateUserProfile } from '../controllers/users'

const app = new Hono<{ Variables: { userId: string } }>()

app.get('/me', getCurrentUser)
app.get('/me/stats', getUserStats)
app.get('/me/billing', getBillingHistory)
app.get('/me/billing/:orderId/invoice', getOrderInvoice)
app.post('/me/billing/portal', getCustomerPortal)
app.put('/me', updateUserProfile)

export default app
