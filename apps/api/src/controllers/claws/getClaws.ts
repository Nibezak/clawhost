import type { Context } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { claws, volumes } from '../../db/schema'
import { hetzner } from '../../services/hetzner'

const getClaws = async (c: Context<{ Variables: { userId: string } }>) => {
  const userId = c.get('userId')
  const sync = c.req.query('sync') === 'true'

  const userClaws = await db.select().from(claws).where(eq(claws.userId, userId))

  // Get volumes for each claw
  const userVolumes = await db.select().from(volumes).where(eq(volumes.userId, userId))

  // Optionally sync status with Hetzner for all claws
  let syncedClaws = userClaws
  if (sync) {
    syncedClaws = await Promise.all(
      userClaws.map(async (claw) => {
        if (!claw.hetznerServerId) return claw
        try {
          const hetznerStatus = await hetzner.getServer(claw.hetznerServerId)
          if (hetznerStatus.status !== claw.status || hetznerStatus.ip !== claw.ip) {
            await db
              .update(claws)
              .set({ status: hetznerStatus.status, ip: hetznerStatus.ip })
              .where(eq(claws.id, claw.id))
            return { ...claw, status: hetznerStatus.status, ip: hetznerStatus.ip }
          }
          return claw
        } catch (err) {
          console.error(`Failed to sync claw ${claw.id}:`, err)
          return claw
        }
      })
    )
  }

  // Attach volumes to claws
  const clawsWithVolumes = syncedClaws.map((claw) => ({
    ...claw,
    volumes: userVolumes.filter((v) => v.clawId === claw.id),
  }))

  return c.json(clawsWithVolumes)
}

export default getClaws
