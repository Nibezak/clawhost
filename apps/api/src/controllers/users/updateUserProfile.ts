import type { Context } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'

const updateUserProfile = async (c: Context<{ Variables: { userId: string } }>) => {
  try {
    const userId = c.get('userId')
    const { name } = await c.req.json<{ name?: string }>()

    if (name !== undefined && name.length > 100) {
      return c.json({ error: 'Name must be 100 characters or less' }, 400)
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
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    return c.json(updated[0])
  } catch (err) {
    console.error('Update user error:', err)
    return c.json({ error: err instanceof Error ? err.message : 'Failed to update profile' }, 500)
  }
}

export default updateUserProfile
