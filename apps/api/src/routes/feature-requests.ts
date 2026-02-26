import type { AuthenticatedContext } from '@/ts/Types'
import type { HonoEnv } from '@/ts/Types'
import type { Next } from 'hono'

import { Hono } from 'hono'
import { eq, sql } from 'drizzle-orm'
import { verifyToken } from '@/services/firebase'
import { fail } from '@/lib/response'
import { t } from '@openclaw/i18n'
import {
    getFeatureRequests,
    createFeatureRequest,
    upvoteFeatureRequest,
    updateFeatureRequestStatus,
    editFeatureRequest,
    deleteFeatureRequest
} from '@/controllers/feature-requests'
import adminOnly from '@/middleware/adminOnly'
import { db } from '@/db'
import { users } from '@/db/schema'

const app = new Hono<HonoEnv>()

app.get(
    '/',
    async (c, next) => {
        const authHeader = c.req.header('Authorization')
        if (authHeader?.startsWith('Bearer ')) {
            try {
                const token = authHeader.slice(7)
                const decoded = await verifyToken(token)
                if (decoded) {
                    const signInProvider = decoded.firebase?.sign_in_provider
                    const authMethod =
                        signInProvider === 'google.com'
                            ? 'google'
                            : signInProvider === 'github.com'
                              ? 'github'
                              : 'email'
                    const existingUser = await db
                        .select({ id: users.id })
                        .from(users)
                        .where(eq(users.id, decoded.uid))
                        .then((rows) => rows[0])
                    if (existingUser) {
                        await db
                            .update(users)
                            .set({
                                ...(decoded.email
                                    ? { email: decoded.email }
                                    : {}),
                                authMethods: sql`CASE
                                    WHEN ${authMethod} = ANY(COALESCE(${users.authMethods}, '{}'))
                                    THEN COALESCE(${users.authMethods}, '{}')
                                    ELSE array_append(COALESCE(${users.authMethods}, '{}'), ${authMethod})
                                END`
                            })
                            .where(eq(users.id, decoded.uid))
                    } else if (decoded.email) {
                        await db
                            .insert(users)
                            .values({
                                id: decoded.uid,
                                email: decoded.email,
                                authMethods: [authMethod]
                            })
                            .onConflictDoUpdate({
                                target: users.id,
                                set: {
                                    email: decoded.email,
                                    authMethods: sql`CASE
                                        WHEN ${authMethod} = ANY(COALESCE(${users.authMethods}, '{}'))
                                        THEN COALESCE(${users.authMethods}, '{}')
                                        ELSE array_append(COALESCE(${users.authMethods}, '{}'), ${authMethod})
                                    END`
                                }
                            })
                    }
                    c.set('userId', decoded.uid)
                }
            } catch {}
        }
        return next()
    },
    getFeatureRequests
)

const requireAuth = async (c: AuthenticatedContext, next: Next) => {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
        return fail(c, t('api.unauthorized'), 401)
    }
    const token = authHeader.slice(7)
    const decoded = await verifyToken(token)
    if (!decoded) {
        return fail(c, t('api.invalidToken'), 401)
    }
    const signInProvider = decoded.firebase?.sign_in_provider
    const authMethod =
        signInProvider === 'google.com'
            ? 'google'
            : signInProvider === 'github.com'
              ? 'github'
              : 'email'
    const existingUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, decoded.uid))
        .then((rows) => rows[0])
    if (existingUser) {
        await db
            .update(users)
            .set({
                ...(decoded.email ? { email: decoded.email } : {}),
                authMethods: sql`CASE
                    WHEN ${authMethod} = ANY(COALESCE(${users.authMethods}, '{}'))
                    THEN COALESCE(${users.authMethods}, '{}')
                    ELSE array_append(COALESCE(${users.authMethods}, '{}'), ${authMethod})
                END`
            })
            .where(eq(users.id, decoded.uid))
    } else if (decoded.email) {
        await db
            .insert(users)
            .values({
                id: decoded.uid,
                email: decoded.email,
                authMethods: [authMethod]
            })
            .onConflictDoUpdate({
                target: users.id,
                set: {
                    email: decoded.email,
                    authMethods: sql`CASE
                        WHEN ${authMethod} = ANY(COALESCE(${users.authMethods}, '{}'))
                        THEN COALESCE(${users.authMethods}, '{}')
                        ELSE array_append(COALESCE(${users.authMethods}, '{}'), ${authMethod})
                    END`
                }
            })
    } else {
        return fail(c, t('api.unauthorized'), 401)
    }
    c.set('userId', decoded.uid)
    return next()
}

app.post('/', requireAuth, createFeatureRequest)
app.post('/:id/upvote', requireAuth, upvoteFeatureRequest)
app.put('/:id', requireAuth, adminOnly, editFeatureRequest)
app.put('/:id/status', requireAuth, adminOnly, updateFeatureRequestStatus)
app.delete('/:id', requireAuth, adminOnly, deleteFeatureRequest)

export default app