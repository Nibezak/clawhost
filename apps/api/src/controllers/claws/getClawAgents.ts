import type { ClawAgent } from '@/ts/Interfaces'
import type { AuthenticatedContext } from '@/ts/Types'

import { eq } from 'drizzle-orm'
import { clawStatus } from '@openclaw/shared'
import { db } from '@/db'
import { claws } from '@/db/schema'
import executeSSH from '@/services/ssh'
import { findUserClaw } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'

const getClawAgents = async (c: AuthenticatedContext) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')
        const claw = await findUserClaw(userId, id)

        if (!claw) {
            return fail(c, t('api.clawNotFound'), 404)
        }

        if (!claw.ip || !claw.rootPassword) {
            await db.update(claws).set({ status: clawStatus.unreachable }).where(eq(claws.id, id))
            return ok(
                c,
                { agents: [], reachable: false },
                t('api.agentsFetchFailed')
            )
        }

        try {
            const output = await executeSSH(
                claw.ip,
                claw.rootPassword,
                "cat /home/openclaw/.openclaw/openclaw.json 2>/dev/null || echo '{}'",
                5000
            )

            let agents: ClawAgent[] = []

            try {
                const config = JSON.parse(output.trim())
                const agentList = config?.agents?.list || []
                const defaultModel =
                    config?.agents?.defaults?.model?.primary ||
                    config?.agents?.defaults?.model ||
                    null

                if (agentList.length === 0) {
                    agents = [
                        {
                            id: 'main',
                            name: 'main',
                            model:
                                typeof defaultModel === 'string'
                                    ? defaultModel
                                    : null,
                            status: 'running',
                            directory: null
                        }
                    ]
                } else {
                    agents = agentList.map(
                        (agent: Record<string, unknown>, index: number) => ({
                            id: (agent.id as string) || `agent-${index}`,
                            name:
                                (agent.name as string) ||
                                (agent.id as string) ||
                                `Agent ${index + 1}`,
                            model:
                                (agent.model as string) || defaultModel || null,
                            status: (agent.status as string) || 'unknown',
                            directory:
                                (agent.workspace as string) ||
                                (agent.directory as string) ||
                                null
                        })
                    )
                }
            } catch {
                agents = [
                    {
                        id: 'main',
                        name: 'main',
                        model: null,
                        status: 'running',
                        directory: null
                    }
                ]
            }

            if (claw.status === clawStatus.unreachable) {
                await db.update(claws).set({ status: clawStatus.running }).where(eq(claws.id, id))
            }
            return ok(c, { agents, reachable: true }, t('api.agentsFetched'))
        } catch {
            if (claw.status === clawStatus.running) {
                await db.update(claws).set({ status: clawStatus.unreachable }).where(eq(claws.id, id))
            }
            return ok(
                c,
                { agents: [], reachable: false },
                t('api.agentsFetchFailed')
            )
        }
    } catch (err) {
        console.error('Get claw agents error:', err)
        return fail(
            c,
            err instanceof Error
                ? err.message
                : t('api.failedToGetDiagnostics'),
            500
        )
    }
}

export default getClawAgents