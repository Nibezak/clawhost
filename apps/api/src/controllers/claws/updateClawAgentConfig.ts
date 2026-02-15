import type { UpdateAgentConfigBody } from '@/ts/Interfaces'
import type { AuthenticatedContext } from '@/ts/Types'

import executeSSH from '@/services/ssh'
import { findUserClaw, validateEnvVars } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'

const BASE_DIR = '/home/openclaw/.openclaw'
const ENV_SEPARATOR = '---ENV_SEPARATOR---'

const updateClawAgentConfig = async (c: AuthenticatedContext) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')
        const body = await c.req.json<UpdateAgentConfigBody>()

        if (!body.agentId || typeof body.agentId !== 'string') {
            return fail(c, t('api.missingRequiredFields'), 400)
        }

        const claw = await findUserClaw(userId, id)

        if (!claw) {
            return fail(c, t('api.clawNotFound'), 404)
        }

        if (!claw.ip || !claw.rootPassword) {
            return fail(c, t('api.agentConfigUpdateFailed'), 400)
        }

        try {
            const output = await executeSSH(
                claw.ip,
                claw.rootPassword,
                `cat ${BASE_DIR}/openclaw.json 2>/dev/null || echo '{}'; echo '${ENV_SEPARATOR}'; cat ${BASE_DIR}/.env 2>/dev/null || echo ''`,
                5000
            )

            const parts = output.split(ENV_SEPARATOR)
            const configOutput = (parts[0] || '{}').trim()
            const envRaw = (parts[1] || '').trim()

            let config: Record<string, unknown> = {}
            try {
                config = JSON.parse(configOutput)
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
            const configB64 = Buffer.from(configJson).toString('base64')
            let writeCommand = `echo '${configB64}' | base64 -d > ${BASE_DIR}/openclaw.json`

            if (body.envVars && Object.keys(body.envVars).length > 0) {
                if (!validateEnvVars(body.envVars)) {
                    return fail(c, t('api.invalidEnvVars'), 400)
                }

                const existingLines: string[] = []
                const existingKeys = new Set<string>()

                envRaw.split('\n').forEach((line) => {
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
                const envB64 = Buffer.from(envContent).toString('base64')
                writeCommand += ` && echo '${envB64}' | base64 -d > ${BASE_DIR}/.env`
            }

            await executeSSH(
                claw.ip,
                claw.rootPassword,
                `${writeCommand} && systemctl restart openclaw-gateway`,
                15000
            )

            return ok(c, null, t('api.agentConfigUpdated'))
        } catch {
            return fail(c, t('api.agentConfigUpdateFailed'), 500)
        }
    } catch {
        return fail(c, t('api.agentConfigUpdateFailed'), 500)
    }
}

export default updateClawAgentConfig