import type { Context } from 'hono'
import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import { hetzner } from '@/services/hetzner'

const getClaw = async (c: Context<{ Variables: { userId: string } }>) => {
  const userId = c.get('userId')
  const id = c.req.param('id')
  const sync = c.req.query('sync') === 'true'

  const claw = await db
    .select()
    .from(claws)
    .where(and(eq(claws.id, id), eq(claws.userId, userId)))
    .limit(1)

  if (!claw[0]) {
    return c.json({ error: 'Claw not found' }, 404)
  }

  // Optionally sync status with Hetzner
  if (sync && claw[0].hetznerServerId) {
    try {
      const hetznerStatus = await hetzner.getServer(claw[0].hetznerServerId)
      if (hetznerStatus.status !== claw[0].status || hetznerStatus.ip !== claw[0].ip) {
        await db
          .update(claws)
          .set({ status: hetznerStatus.status, ip: hetznerStatus.ip })
          .where(eq(claws.id, id))
        return c.json({ ...claw[0], status: hetznerStatus.status, ip: hetznerStatus.ip })
      }
    } catch (err) {
      console.error('Failed to sync with Hetzner:', err)
    }
  }

  return c.json(claw[0])
}

export default getClaw
