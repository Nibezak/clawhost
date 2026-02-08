import type { Context } from 'hono'
import type { SendMagicLinkBody } from '@/ts/Interfaces'

import { auth } from '@/services/firebase'
import { getResend, FROM_EMAIL } from '@/services/resend'
import MagicLinkEmail from '@/emails/MagicLinkEmail'
import { t } from '@openclaw/i18n'

const RATE_LIMIT_WINDOW = 60_000
const rateLimitMap = new Map<string, number>()

const sendMagicLink = async (c: Context) => {
    try {
        const ip =
            c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
            c.req.header('x-real-ip') ||
            'unknown'

        const lastSent = rateLimitMap.get(ip)
        const now = Date.now()

        if (lastSent && now - lastSent < RATE_LIMIT_WINDOW) {
            const retryAfter = Math.ceil(
                (RATE_LIMIT_WINDOW - (now - lastSent)) / 1000
            )
            return c.json(
                { error: t('api.rateLimitExceeded'), retryAfter },
                429
            )
        }

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

        rateLimitMap.set(ip, Date.now())
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