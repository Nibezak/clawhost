import { Hono } from 'hono'
import { sendMagicLink } from '../controllers/auth'

const app = new Hono()

app.post('/send-magic-link', sendMagicLink)

export default app
