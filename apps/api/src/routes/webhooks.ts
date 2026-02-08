import { Hono } from 'hono'
import { handlePolarWebhook } from '@/controllers/webhooks'

const app = new Hono()

// Polar webhook endpoint (public, no auth required)
app.post('/polar', handlePolarWebhook)

export default app