import { Hono } from 'hono'
import { sendMagicLink, sendOtp, verifyOtp } from '@/controllers/auth'

const app = new Hono()

app.post('/send-magic-link', sendMagicLink)
app.post('/send-otp', sendOtp)
app.post('/verify-otp', verifyOtp)

export default app