import type { Context } from 'hono'

import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import { t } from '@openclaw/i18n'

const getCurrentUser = async (
    c: Context<{ Variables: { userId: string } }>
) => {
    try {
        const userId = c.get('userId')

        const user = await db
            .select({
                id: users.id,
                email: users.email,
                name: users.name,
                role: users.role,
                createdAt: users.createdAt
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1)

        if (!user[0]) {
            return c.json({ error: t('api.userNotFound') }, 404)
        }

        return c.json(user[0])
    } catch (err) {
        console.error('Get user error:', err)
        return c.json(
            {
                error:
                    err instanceof Error
                        ? err.message
                        : t('api.failedToGetProfile')
            },
            500
        )
    }
}

export default getCurrentUser