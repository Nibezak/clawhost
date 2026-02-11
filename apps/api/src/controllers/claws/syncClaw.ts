import type { Context } from 'hono'
import type { ProviderType } from '@/ts/Types'

import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import { getProvider } from '@/services/provider'
import { checkSubdomainReady, isAdmin } from '@/controllers/claws/helpers'
import { ok, fail } from '@/lib/response'
import { t } from '@openclaw/i18n'

const syncClaw = async (c: Context<{ Variables: { userId: string } }>) => {
    const userId = c.get('userId')
    const id = c.req.param('id')
    const admin = await isAdmin(userId)

    const claw = await db
        .select()
        .from(claws)
        .where(
            admin
                ? eq(claws.id, id)
                : and(eq(claws.id, id), eq(claws.userId, userId))
        )
        .limit(1)

    if (!claw[0] || !claw[0].providerServerId) {
        return fail(c, t('api.clawNotFound'), 404)
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

                    return ok(c, {
                        ...claw[0],
                        status: 'running',
                        ip: serverStatus.ip
                    }, t('api.clawSynced'))
                }
            }

            await db
                .update(claws)
                .set({ ip: serverStatus.ip })
                .where(eq(claws.id, id))

            return ok(c, {
                ...claw[0],
                ip: serverStatus.ip
            }, t('api.clawSynced'))
        }

        await db
            .update(claws)
            .set({ status: serverStatus.status, ip: serverStatus.ip })
            .where(eq(claws.id, id))

        return ok(c, {
            ...claw[0],
            status: serverStatus.status,
            ip: serverStatus.ip
        }, t('api.clawSynced'))
    } catch (err) {
        console.error('Failed to sync server status:', err)
        return fail(c, t('api.failedToSyncClaw'), 500)
    }
}

export default syncClaw