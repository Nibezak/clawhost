import { Hono } from 'hono'
import { sendOtp, verifyOtp } from '@/controllers/auth'

const app = new Hono()

app.post('/send-otp', sendOtp)
app.post('/verify-otp', verifyOtp)

export default app