import type { Context } from 'hono'

import { eq, desc } from 'drizzle-orm'
import { db } from '@/db'
import { claws, volumes } from '@/db/schema'
import { hetzner } from '@/services/hetzner'
import { checkSubdomainReady } from '@/controllers/claws/helpers'

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

    const syncedClaws = await Promise.all(
        userClaws.map(async (claw) => {
            if (!claw.hetznerServerId) return claw

            const live = hetznerServers.get(claw.hetznerServerId)
            if (!live) return claw

            if (claw.status === 'configuring') {
                if (live.status === 'running' && claw.subdomain) {
                    const ready = await checkSubdomainReady(claw.subdomain)
                    if (ready) {
                        return { ...claw, status: 'running', ip: live.ip }
                    }
                }
                return { ...claw, ip: live.ip }
            }

            const completionStates = transitionCompletedBy[claw.status]
            if (completionStates && !completionStates.includes(live.status)) {
                return { ...claw, ip: live.ip }
            }

            return { ...claw, status: live.status, ip: live.ip }
        })
    )

    const clawsWithVolumes = syncedClaws.map((claw) => ({
        ...claw,
        volumes: userVolumes.filter((v) => v.clawId === claw.id)
    }))

    return c.json(clawsWithVolumes)
}

export default getClaws