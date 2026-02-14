import type { UpdateProfileBody } from '@/ts/Interfaces'
import type { AuthenticatedContext } from '@/ts/Types'

import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import { ok, fail } from '@/lib/response'
import { t } from '@openclaw/i18n'

const updateUserProfile = async (
    c: AuthenticatedContext
) => {
    try {
        const userId = c.get('userId')
        const { name } = await c.req.json<UpdateProfileBody>()

        if (name !== undefined && name.length > 100) {
            return fail(c, t('api.nameTooLong'), 400)
        }

        await db
            .update(users)
            .set({ name: name?.trim() || null })
            .where(eq(users.id, userId))

        const updated = await db
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

        return ok(c, updated[0], t('api.profileUpdated'))
    } catch (err) {
        console.error('Update user error:', err)
        return fail(
            c,
            err instanceof Error ? err.message : t('api.failedToUpdateProfile'),
            500
        )
    }
}

export default updateUserProfile