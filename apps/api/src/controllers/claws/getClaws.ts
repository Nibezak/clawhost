import type { Context } from 'hono'
import { eq, desc } from 'drizzle-orm'
import { db } from '@/db'
import { claws, volumes } from '@/db/schema'
import { hetzner } from '@/services/hetzner'

const CONFIGURATION_DURATION_MS = 3 * 60 * 1000

const transitionCompletedBy: Record<string, string[]> = {
    stopping: ['off', 'stopped'],
    starting: ['running'],
    creating: ['running'],
    initializing: ['running'],
    migrating: ['running'],
    rebuilding: ['running']
}

const getClaws = async (c: Context<{ Variables: { userId: string } }>) => {
    const userId = c.get('userId')

    const [userClaws, userVolumes, hetznerServers] = await Promise.all([
        db
            .select()
            .from(claws)
            .where(eq(claws.userId, userId))
            .orderBy(desc(claws.createdAt)),
        db.select().from(volumes).where(eq(volumes.userId, userId)),
        hetzner.getServers().catch((err) => {
            console.error('Failed to fetch Hetzner servers:', err)
            return new Map<string, { status: string; ip: string }>()
        })
    ])

    const syncedClaws = userClaws.map((claw) => {
        if (!claw.hetznerServerId) return claw

        const live = hetznerServers.get(claw.hetznerServerId)
        if (!live) return claw

        if (claw.status === 'configuring') {
            const elapsed = Date.now() - new Date(claw.createdAt).getTime()
            if (elapsed < CONFIGURATION_DURATION_MS) {
                return { ...claw, ip: live.ip }
            }
            return { ...claw, status: live.status, ip: live.ip }
        }

        const completionStates = transitionCompletedBy[claw.status]
        if (completionStates && !completionStates.includes(live.status)) {
            return { ...claw, ip: live.ip }
        }

        return { ...claw, status: live.status, ip: live.ip }
    })

    // Attach volumes to claws
    const clawsWithVolumes = syncedClaws.map((claw) => ({
        ...claw,
        volumes: userVolumes.filter((v) => v.clawId === claw.id)
    }))

    return c.json(clawsWithVolumes)
}

export default getClaws