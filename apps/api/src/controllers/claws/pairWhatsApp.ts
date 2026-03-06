import type { AuthenticatedContext } from '@/ts/Types'

import executeSSH from '@/services/ssh'
import { findUserClaw } from '@/controllers/claws/helpers'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'

const PAIR_LOG = '/tmp/openclaw-wa-pair.log'
const PAIR_PID = '/tmp/openclaw-wa-pair.pid'
const CREDS_DIR = '/home/openclaw/.openclaw/credentials/whatsapp'

const pairWhatsApp = async (c: AuthenticatedContext) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')
        const claw = await findUserClaw(userId, id)

        if (!claw) {
            return fail(c, t('api.clawNotFound'), 404)
        }

        if (!claw.ip || !claw.rootPassword) {
            return fail(c, t('api.whatsappPairFailed'), 400)
        }

        try {
            const [credsCheck, helpCheck] = await Promise.all([
                executeSSH(
                    claw.ip,
                    claw.rootPassword,
                    `ls ${CREDS_DIR}/*/creds.json 2>/dev/null && echo "HAS_CREDS" || echo "NO_CREDS"`,
                    5000
                ),
                executeSSH(
                    claw.ip,
                    claw.rootPassword,
                    'su - openclaw -c "openclaw channels login --help" 2>&1 || true',
                    8000
                )
            ])

            if (credsCheck.includes('HAS_CREDS')) {
                return ok(
                    c,
                    { status: 'already_paired' },
                    t('api.whatsappAlreadyPaired')
                )
            }

            const supportsWhatsApp =
                helpCheck.includes('whatsapp') || helpCheck.includes('WhatsApp')

            if (!supportsWhatsApp) {
                return ok(
                    c,
                    { status: 'unsupported' },
                    t('api.whatsappUnsupported')
                )
            }

            await executeSSH(
                claw.ip,
                claw.rootPassword,
                [
                    `kill $(cat ${PAIR_PID} 2>/dev/null) 2>/dev/null`,
                    `rm -f ${PAIR_LOG} ${PAIR_PID}`,
                    `touch ${PAIR_LOG}`,
                    `nohup su - openclaw -c "openclaw channels login --channel whatsapp" > ${PAIR_LOG} 2>&1 &`,
                    `echo $! > ${PAIR_PID}`
                ].join('; '),
                10000
            )

            return ok(c, { status: 'started' }, t('api.whatsappPairStarted'))
        } catch {
            return fail(c, t('api.whatsappPairFailed'), 500)
        }
    } catch {
        return fail(c, t('api.whatsappPairFailed'), 500)
    }
}

export default pairWhatsApp