import type { Context } from 'hono'
import { eq, and } from 'drizzle-orm'
import { db } from '../../db'
import { claws } from '../../db/schema'
import { hetzner } from '../../services/hetzner'

const startClaw = async (c: Context<{ Variables: { userId: string } }>) => {
  try {
    const userId = c.get('userId')
    const id = c.req.param('id')

    const claw = await db
      .select()
      .from(claws)
      .where(and(eq(claws.id, id), eq(claws.userId, userId)))
      .limit(1)

    if (!claw[0] || !claw[0].hetznerServerId) {
      return c.json({ error: 'Claw not found' }, 404)
    }

    await db.update(claws).set({ status: 'starting' }).where(eq(claws.id, id))
    await hetzner.startServer(claw[0].hetznerServerId)

    return c.json({ success: true })
  } catch (err) {
    console.error('Start claw error:', err)
    return c.json({ error: err instanceof Error ? err.message : 'Failed to start claw' }, 500)
  }
}

export default startClaw
