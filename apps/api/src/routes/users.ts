import { Hono } from 'hono'
import { getCurrentUser, getUserStats, updateUserProfile } from '../controllers/users'

const app = new Hono<{ Variables: { userId: string } }>()

app.get('/me', getCurrentUser)
app.get('/me/stats', getUserStats)
app.put('/me', updateUserProfile)

export default app
