import type { Context } from 'hono'
import type { UpdateClawConfigBody } from '@/ts/Interfaces'

import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import executeSSH from '@/services/ssh'
import { t } from '@openclaw/i18n'

const updateClawConfig = async (
    c: Context<{ Variables: { userId: string } }>
) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')
        const body = await c.req.json<UpdateClawConfigBody>()

        if (!body.config || typeof body.config !== 'string') {
            return c.json({ error: t('api.missingRequiredFields') }, 400)
        }

        let parsed: Record<string, unknown>

        try {
            parsed = JSON.parse(body.config)
        } catch {
            return c.json({ error: t('api.invalidJsonConfig') }, 400)
        }

        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
            return c.json({ error: t('api.configMustBeObject') }, 400)
        }

        if (!parsed.gateway || typeof parsed.gateway !== 'object') {
            return c.json({ error: t('api.configMissingGateway') }, 400)
        }

        const gateway = parsed.gateway as Record<string, unknown>
        const auth = gateway.auth as Record<string, unknown> | undefined

        if (!auth || typeof auth !== 'object' || !auth.mode || !auth.token) {
            return c.json({ error: t('api.configMissingGatewayAuth') }, 400)
        }

        if (!parsed.channels || typeof parsed.channels !== 'object') {
            return c.json({ error: t('api.configMissingChannels') }, 400)
        }

        if (!parsed.agents || typeof parsed.agents !== 'object') {
            return c.json({ error: t('api.configMissingAgents') }, 400)
        }

        const claw = await db
            .select()
            .from(claws)
            .where(and(eq(claws.id, id), eq(claws.userId, userId)))
            .limit(1)

        if (!claw[0]) {
            return c.json({ error: t('api.clawNotFound') }, 404)
        }

        if (!claw[0].ip || !claw[0].rootPassword) {
            return c.json({ error: t('api.failedToUpdateConfig') }, 400)
        }

        const escapedConfig = body.config.replace(/'/g, "'\\''")

        await executeSSH(
            claw[0].ip,
            claw[0].rootPassword,
            `echo '${escapedConfig}' > /home/openclaw/.openclaw/openclaw.json`
        )

        return c.json({
            success: true,
            message: t('api.configUpdateSuccess')
        })
    } catch (err) {
        console.error('Update claw config error:', err)
        return c.json(
            {
                error:
                    err instanceof Error
                        ? err.message
                        : t('api.failedToUpdateConfig')
            },
            500
        )
    }
}

export default updateClawConfig