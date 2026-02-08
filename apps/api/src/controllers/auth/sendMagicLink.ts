import type { Context } from 'hono'
import type { SendMagicLinkBody } from '@/ts/Interfaces'

import { auth } from '@/services/firebase'
import { getResend, FROM_EMAIL } from '@/services/resend'
import MagicLinkEmail from '@/emails/MagicLinkEmail'
import { t } from '@openclaw/i18n'

const sendMagicLink = async (c: Context) => {
    try {
        const { email, redirectUrl } = await c.req.json<SendMagicLinkBody>()

        if (!email) {
            return c.json({ error: t('api.emailRequired') }, 400)
        }

        if (!redirectUrl) {
            return c.json({ error: t('api.redirectUrlRequired') }, 400)
        }

        const actionCodeSettings = {
            url: redirectUrl,
            handleCodeInApp: true
        }

        const magicLink = await auth().generateSignInWithEmailLink(
            email,
            actionCodeSettings
        )

        const { error } = await getResend().emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'Sign in to ClawHost',
            react: MagicLinkEmail({ magicLink })
        })

        if (error) {
            console.error('Resend error:', error)
            return c.json({ error: t('api.failedToSendEmail') }, 500)
        }

        return c.json({ success: true })
    } catch (err) {
        console.error('Send magic link error:', err)
        return c.json(
            {
                error:
                    err instanceof Error
                        ? err.message
                        : t('api.failedToSendMagicLink')
            },
            500
        )
    }
}

export default sendMagicLink