import type { UpdateAgentConfigBody } from '@/ts/Interfaces'
import type { AuthenticatedContext } from '@/ts/Types'

import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import executeSSH from '@/services/ssh'
import { isAdmin } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'

const BASE_DIR = '/home/openclaw/.openclaw'

const updateClawAgentConfig = async (
    c: AuthenticatedContext
) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')
        const body = await c.req.json<UpdateAgentConfigBody>()

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
            return fail(c, t('api.agentConfigUpdateFailed'), 400)
        }

        try {
            const configOutput = await executeSSH(
                claw[0].ip,
                claw[0].rootPassword,
                `cat ${BASE_DIR}/openclaw.json 2>/dev/null || echo '{}'`,
                5000
            )

            let config: Record<string, unknown> = {}
            try {
                config = JSON.parse(configOutput.trim())
            } catch {
                config = {}
            }

            if (!config.agents) {
                config.agents = { defaults: {}, list: [] }
            }

            const agents = config.agents as Record<string, unknown>
            if (!agents.list) {
                agents.list = []
            }

            const agentList = agents.list as Record<string, unknown>[]
            const agentIndex = agentList.findIndex(
                (a) =>
                    (a.id as string) === body.agentId ||
                    (a.name as string) === body.agentId
            )

            if (body.name !== undefined) {
                if (!/^[a-zA-Z0-9-]+$/.test(body.name)) {
                    return fail(c, t('api.agentNameInvalid'), 400)
                }

                const nameExists = agentList.some(
                    (a, i) =>
                        i !== agentIndex &&
                        ((a.name as string) || '').toLowerCase() ===
                            body.name!.toLowerCase()
                )

                if (nameExists) {
                    return fail(c, t('api.agentNameDuplicate'), 400)
                }
            }

            if (agentIndex >= 0) {
                if (body.name !== undefined) {
                    agentList[agentIndex].name = body.name
                }
                if (body.model !== undefined) {
                    agentList[agentIndex].model = body.model
                }
            } else {
                agentList.push({
                    id: body.agentId,
                    name: body.agentId,
                    model: body.model
                })
            }

            const configJson = JSON.stringify(config, null, 4)
            const escapedConfig = configJson.replace(/'/g, "'\\''")

            await executeSSH(
                claw[0].ip,
                claw[0].rootPassword,
                `echo '${escapedConfig}' > ${BASE_DIR}/openclaw.json`,
                5000
            )

            if (body.envVars && Object.keys(body.envVars).length > 0) {
                const existingEnv = await executeSSH(
                    claw[0].ip,
                    claw[0].rootPassword,
                    `cat ${BASE_DIR}/.env 2>/dev/null || echo ''`,
                    5000
                )

                const existingLines: string[] = []
                const existingKeys = new Set<string>()

                existingEnv
                    .trim()
                    .split('\n')
                    .forEach((line) => {
                        const trimmed = line.trim()
                        if (!trimmed || trimmed.startsWith('#')) {
                            existingLines.push(line)
                            return
                        }
                        const eqIndex = trimmed.indexOf('=')
                        if (eqIndex === -1) {
                            existingLines.push(line)
                            return
                        }
                        const key = trimmed.substring(0, eqIndex).trim()
                        existingKeys.add(key)

                        if (key in body.envVars) {
                            const value = body.envVars[key]
                            if (value === '') return
                            existingLines.push(`${key}=${value}`)
                        } else {
                            existingLines.push(line)
                        }
                    })

                Object.entries(body.envVars).forEach(([key, value]) => {
                    if (!existingKeys.has(key) && value !== '') {
                        existingLines.push(`${key}=${value}`)
                    }
                })

                const envContent = existingLines.join('\n')
                const escapedEnv = envContent.replace(/'/g, "'\\''")

                await executeSSH(
                    claw[0].ip,
                    claw[0].rootPassword,
                    `echo '${escapedEnv}' > ${BASE_DIR}/.env`,
                    5000
                )
            }

            await executeSSH(
                claw[0].ip,
                claw[0].rootPassword,
                'systemctl restart openclaw-gateway',
                10000
            )

            return ok(c, null, t('api.agentConfigUpdated'))
        } catch {
            return fail(c, t('api.agentConfigUpdateFailed'), 500)
        }
    } catch (err) {
        console.error('Update agent config error:', err)
        return fail(
            c,
            err instanceof Error
                ? err.message
                : t('api.agentConfigUpdateFailed'),
            500
        )
    }
}

export default updateClawAgentConfig