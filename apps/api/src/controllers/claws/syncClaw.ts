import type { Context } from 'hono'
import type { ProviderType } from '@/ts/Types'

import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import { getProvider } from '@/services/provider'
import { t } from '@openclaw/i18n'
import { checkSubdomainReady } from '@/controllers/claws/helpers'

const syncClaw = async (c: Context<{ Variables: { userId: string } }>) => {
    const userId = c.get('userId')
    const id = c.req.param('id')

    const claw = await db
        .select()
        .from(claws)
        .where(and(eq(claws.id, id), eq(claws.userId, userId)))
        .limit(1)

    if (!claw[0] || !claw[0].providerServerId) {
        return c.json({ error: t('api.clawNotFound') }, 404)
    }

    try {
        const provider = getProvider(claw[0].provider as ProviderType)
        const serverStatus = await provider.getServer(claw[0].providerServerId)

        if (claw[0].status === 'configuring') {
            if (serverStatus.status === 'running' && claw[0].subdomain) {
                const ready = await checkSubdomainReady(claw[0].subdomain)
                if (ready) {
                    await db
                        .update(claws)
                        .set({ status: 'running', ip: serverStatus.ip })
                        .where(eq(claws.id, id))

                    return c.json({
                        ...claw[0],
                        status: 'running',
                        ip: serverStatus.ip
                    })
                }
            }

            await db
                .update(claws)
                .set({ ip: serverStatus.ip })
                .where(eq(claws.id, id))

            return c.json({
                ...claw[0],
                ip: serverStatus.ip
            })
        }

        await db
            .update(claws)
            .set({ status: serverStatus.status, ip: serverStatus.ip })
            .where(eq(claws.id, id))

        return c.json({
            ...claw[0],
            status: serverStatus.status,
            ip: serverStatus.ip
        })
    } catch (err) {
        console.error('Failed to sync server status:', err)
        return c.json({ error: t('api.failedToSyncClaw') }, 500)
    }
}

export default syncClaw