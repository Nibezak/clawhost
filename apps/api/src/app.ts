import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { verifyToken } from '@/services/firebase'
import { db } from '@/db'
import { users } from '@/db/schema'
import {
    authRoutes,
    clawsRoutes,
    plansRoutes,
    sshKeysRoutes,
    usersRoutes,
    webhooksRoutes
} from '@/routes'

const app = new Hono<{ Variables: { userId: string } }>()

app.use('*', logger())
app.use(
    '*',
    cors({
        origin: [
            'https://clawhost.cloud',
            'https://www.clawhost.cloud',
            'http://localhost:1111'
        ],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
        maxAge: 86400
    })
)

app.get('/', (c) => c.json({ status: 'ok' }))

app.route('/auth', authRoutes)
app.route('/plans', plansRoutes)
app.route('/webhooks', webhooksRoutes)

app.use('/*', async (c, next) => {
    if (
        c.req.path === '/' ||
        c.req.path.startsWith('/favicon') ||
        c.req.path.startsWith('/auth') ||
        c.req.path.startsWith('/plans') ||
        c.req.path.startsWith('/webhooks')
    ) {
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

        await db
            .insert(users)
            .values({
                id: decoded.uid,
                email: decoded.email || ''
            })
            .onConflictDoUpdate({
                target: users.email,
                set: { id: decoded.uid }
            })

        c.set('userId', decoded.uid)
        return next()
    } catch (err) {
        console.error('Auth middleware error:', err)
        return c.json({ error: 'Internal server error' }, 500)
    }
})

app.route('/claws', clawsRoutes)
app.route('/ssh-keys', sshKeysRoutes)
app.route('/users', usersRoutes)

app.notFound((c) => c.json({ error: 'Not found' }, 404))

export default app