import type { UpdateClawChannelsBody } from '@/ts/Interfaces'
import type { AuthenticatedContext } from '@/ts/Types'

import executeSSH from '@/services/ssh'
import { findUserClaw } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'

const BASE_DIR = '/home/openclaw/.openclaw'

const CHANNEL_REQUIRED_FIELDS: Record<string, string[]> = {
    telegram: ['botToken'],
    discord: ['token'],
    slack: ['botToken', 'appToken']
}

const updateClawChannels = async (c: AuthenticatedContext) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')
        const body = await c.req.json<UpdateClawChannelsBody>()

        if (!body.channels || typeof body.channels !== 'object') {
            return fail(c, t('api.missingRequiredFields'), 400)
        }

        for (const [channelKey, channelConfig] of Object.entries(
            body.channels
        )) {
            if (!channelConfig.enabled) continue
            const required = CHANNEL_REQUIRED_FIELDS[channelKey]
            if (!required) continue
            for (const field of required) {
                const value = channelConfig[field as keyof typeof channelConfig]
                if (!value || (typeof value === 'string' && !value.trim())) {
                    return fail(c, t('api.channelMissingRequired'), 400)
                }
            }
        }

        const claw = await findUserClaw(userId, id)

        if (!claw) {
            return fail(c, t('api.clawNotFound'), 404)
        }

        if (!claw.ip || !claw.rootPassword) {
            return fail(c, t('api.channelsUpdateFailed'), 400)
        }

        try {
            const output = await executeSSH(
                claw.ip,
                claw.rootPassword,
                `cat ${BASE_DIR}/openclaw.json 2>/dev/null || echo '{}'`,
                5000
            )

            let config: Record<string, unknown> = {}
            try {
                config = JSON.parse(output.trim())
            } catch {
                config = {}
            }

            config.channels = body.channels

            const configJson = JSON.stringify(config, null, 4)
            const configB64 = Buffer.from(configJson).toString('base64')

            await executeSSH(
                claw.ip,
                claw.rootPassword,
                `echo '${configB64}' | base64 -d > ${BASE_DIR}/openclaw.json && systemctl restart openclaw-gateway`,
                15000
            )

            return ok(c, null, t('api.channelsUpdated'))
        } catch {
            return fail(c, t('api.channelsUpdateFailed'), 500)
        }
    } catch {
        return fail(c, t('api.channelsUpdateFailed'), 500)
    }
}

export default updateClawChannels