import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { verifyToken } from './services/firebase'
import { db } from './db'
import { users } from './db/schema'
import { eq } from 'drizzle-orm'
import { clawsRoutes, plansRoutes, sshKeysRoutes, usersRoutes } from './routes'

const app = new Hono<{ Variables: { userId: string } }>()

// Middleware
app.use('*', logger())
app.use('*', cors())

// Health check
app.get('/', (c) => c.json({ status: 'ok' }))

// Public routes
app.route('/api/plans', plansRoutes)

// Auth middleware for protected routes
app.use('/api/*', async (c, next) => {
  // Skip auth for plans (public route)
  if (c.req.path === '/api/plans') {
    return next()
  }

  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.slice(7)
    const decoded = await verifyToken(token)

    if (!decoded) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    // Ensure user exists in our database
    const existingUser = await db.select().from(users).where(eq(users.id, decoded.uid)).limit(1)

    if (!existingUser[0]) {
      await db.insert(users).values({
        id: decoded.uid,
        email: decoded.email || '',
      })
    }

    c.set('userId', decoded.uid)
    return next()
  } catch (err) {
    console.error('Auth middleware error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Protected routes
app.route('/api/claws', clawsRoutes)
app.route('/api/ssh-keys', sshKeysRoutes)
app.route('/api/users', usersRoutes)

export default app
