import type { Context } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'

const getCurrentUser = async (c: Context<{ Variables: { userId: string } }>) => {
  try {
    const userId = c.get('userId')

    const user = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user[0]) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json(user[0])
  } catch (err) {
    console.error('Get user error:', err)
    return c.json({ error: err instanceof Error ? err.message : 'Failed to get profile' }, 500)
  }
}

export default getCurrentUser
