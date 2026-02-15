import type { HonoEnv } from '@/ts/Types'

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { bodyLimit } from 'hono/body-limit'
import { verifyToken } from '@/services/firebase'
import { db } from '@/db'
import { users } from '@/db/schema'
import { ok, fail } from '@/lib/response'
import { t } from '@openclaw/i18n'
import {
    authRoutes,
    clawsRoutes,
    plansRoutes,
    sshKeysRoutes,
    usersRoutes,
    webhooksRoutes
} from '@/routes'

const app = new Hono<HonoEnv>()

const isDev = process.env.NODE_ENV !== 'production'

app.use(
    '*',
    cors({
        origin: isDev
            ? [
                  'https://clawhost.cloud',
                  'https://www.clawhost.cloud',
                  'http://localhost:1111'
              ]
            : ['https://clawhost.cloud', 'https://www.clawhost.cloud'],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
        maxAge: 86400
    })
)

app.use('*', bodyLimit({ maxSize: 1024 * 1024 }))

app.use('*', async (c, next) => {
    await next()
    c.header('X-Content-Type-Options', 'nosniff')
    c.header('X-Frame-Options', 'DENY')
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
    c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
})

app.get('/', (c) => ok(c, null, t('api.healthOk')))

app.route('/auth', authRoutes)
app.route('/plans', plansRoutes)
app.route('/webhooks', webhooksRoutes)

app.use('/*', async (c, next) => {
    try {
        const authHeader = c.req.header('Authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return fail(c, t('api.unauthorized'), 401)
        }

        const token = authHeader.slice(7)
        const decoded = await verifyToken(token)

        if (!decoded) {
            return fail(c, t('api.invalidToken'), 401)
        }

        await db
            .insert(users)
            .values({
                id: decoded.uid,
                email: decoded.email || ''
            })
            .onConflictDoUpdate({
                target: users.id,
                set: { email: decoded.email || '' }
            })

        c.set('userId', decoded.uid)
        return next()
    } catch (err) {
        console.error('Auth middleware error:', err)
        return fail(c, t('api.internalServerError'), 500)
    }
})

app.route('/claws', clawsRoutes)
app.route('/ssh-keys', sshKeysRoutes)
app.route('/users', usersRoutes)

app.notFound((c) => fail(c, t('api.notFound'), 404))

export default app