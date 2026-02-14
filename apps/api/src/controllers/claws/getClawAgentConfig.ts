import type { Context } from 'hono'
import type { GetAgentConfigBody } from '@/ts/Interfaces'

import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import executeSSH from '@/services/ssh'
import { isAdmin } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'

const ENV_SEPARATOR = '---ENV_SEPARATOR---'

const getClawAgentConfig = async (
    c: Context<{ Variables: { userId: string } }>
) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')
        const body = await c.req.json<GetAgentConfigBody>()

        if (!body.agentId || typeof body.agentId !== 'string') {
            return fail(c, t('api.missingRequiredFields'), 400)
        }

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

        if (!claw[0]) {
            return fail(c, t('api.clawNotFound'), 404)
        }

        if (!claw[0].ip || !claw[0].rootPassword) {
            return fail(c, t('api.agentsFetchFailed'), 400)
        }

        try {
            const output = await executeSSH(
                claw[0].ip,
                claw[0].rootPassword,
                `cat /home/openclaw/.openclaw/openclaw.json 2>/dev/null || echo '{}'; echo '${ENV_SEPARATOR}'; cat /home/openclaw/.openclaw/.env 2>/dev/null || echo ''`,
                10000
            )

            const parts = output.split(ENV_SEPARATOR)
            const configRaw = (parts[0] || '{}').trim()
            const envRaw = (parts[1] || '').trim()

            let agentName: string = body.agentId
            let agentModel: string | null = null
            let defaultModel: string | null = null

            try {
                const config = JSON.parse(configRaw)
                defaultModel =
                    config?.agents?.defaults?.model?.primary ||
                    (typeof config?.agents?.defaults?.model === 'string'
                        ? config.agents.defaults.model
                        : null)

                const agentList = config?.agents?.list || []
                const agent = agentList.find(
                    (a: Record<string, unknown>) =>
                        (a.id as string) === body.agentId ||
                        (a.name as string) === body.agentId
                )

                if (agent) {
                    agentName = (agent.name as string) || body.agentId
                    agentModel = (agent.model as string) || null
                }
            } catch {
                agentModel = null
                defaultModel = null
            }

            const envVars: Record<string, string> = {}
            if (envRaw) {
                envRaw.split('\n').forEach((line) => {
                    const trimmed = line.trim()
                    if (!trimmed || trimmed.startsWith('#')) return
                    const eqIndex = trimmed.indexOf('=')
                    if (eqIndex === -1) return
                    const key = trimmed.substring(0, eqIndex).trim()
                    let value = trimmed.substring(eqIndex + 1).trim()
                    if (
                        (value.startsWith('"') && value.endsWith('"')) ||
                        (value.startsWith("'") && value.endsWith("'"))
                    ) {
                        value = value.slice(1, -1)
                    }
                    envVars[key] = value
                })
            }

            return ok(
                c,
                {
                    agent: {
                        id: body.agentId,
                        name: agentName,
                        model: agentModel
                    },
                    envVars,
                    defaultModel
                },
                t('api.agentConfigFetched')
            )
        } catch {
            return fail(c, t('api.agentsFetchFailed'), 500)
        }
    } catch (err) {
        console.error('Get agent config error:', err)
        return fail(
            c,
            err instanceof Error ? err.message : t('api.agentsFetchFailed'),
            500
        )
    }
}

export default getClawAgentConfig