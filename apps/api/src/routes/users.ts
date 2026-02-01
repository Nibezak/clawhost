import { Hono } from 'hono'
import { eq, count } from 'drizzle-orm'
import { db } from '../db'
import { users, instances } from '../db/schema'

const app = new Hono<{ Variables: { userId: string } }>()

// Get current user profile
app.get('/me', async (c) => {
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
    return c.json(
      { error: err instanceof Error ? err.message : 'Failed to get profile' },
      500
    )
  }
})

// Get user stats (instance count, etc.)
app.get('/me/stats', async (c) => {
  try {
    const userId = c.get('userId')

    const result = await db
      .select({ count: count() })
      .from(instances)
      .where(eq(instances.userId, userId))

    return c.json({ instanceCount: result[0]?.count || 0 })
  } catch (err) {
    console.error('Get user stats error:', err)
    return c.json({ error: 'Failed to get stats' }, 500)
  }
})

// Update current user profile
app.put('/me', async (c) => {
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
    return c.json(
      { error: err instanceof Error ? err.message : 'Failed to update profile' },
      500
    )
  }
})

export default app
