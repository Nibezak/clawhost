import type { Context } from 'hono'
import type { SendMagicLinkBody } from '@/ts/Interfaces'

import { auth } from '@/services/firebase'
import { getResend, FROM_EMAIL } from '@/services/resend'
import MagicLinkEmail from '@/emails/MagicLinkEmail'
import { t } from '@openclaw/i18n'
import {
    getClientIp,
    checkRateLimit,
    setRateLimit
} from '@/controllers/auth/rateLimit'
import { ok, fail } from '@/lib/response'

const ALLOWED_REDIRECT_ORIGINS = [
    'https://clawhost.cloud',
    'https://www.clawhost.cloud',
    'http://localhost:1111'
]

const isAllowedRedirectUrl = (url: string): boolean => {
    try {
        const parsed = new URL(url)
        return ALLOWED_REDIRECT_ORIGINS.some(
            (origin) => `${parsed.protocol}//${parsed.host}` === origin
        )
    } catch {
        return false
    }
}

const sendMagicLink = async (c: Context) => {
    try {
        const ip = getClientIp(c)

        if (ip) {
            const ipRetry = await checkRateLimit(`ip:${ip}`)
            if (ipRetry > 0) {
                return fail(c, t('api.rateLimitExceeded'), 429, {
                    retryAfter: ipRetry
                })
            }
        }

        const { email, redirectUrl } = await c.req.json<SendMagicLinkBody>()

        if (!email) {
            return fail(c, t('api.emailRequired'), 400)
        }

        if (!redirectUrl) {
            return fail(c, t('api.redirectUrlRequired'), 400)
        }

        if (!isAllowedRedirectUrl(redirectUrl)) {
            return fail(c, t('api.invalidRedirectUrl'), 400)
        }

        const emailRetry = await checkRateLimit(`email:${email.toLowerCase()}`)
        if (emailRetry > 0) {
            return fail(c, t('api.rateLimitExceeded'), 429, {
                retryAfter: emailRetry
            })
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
            return fail(c, t('api.failedToSendEmail'), 500)
        }

        const keys = [`email:${email.toLowerCase()}`]
        if (ip) keys.push(`ip:${ip}`)
        await setRateLimit(...keys)
        return ok(c, null, t('api.magicLinkSent'))
    } catch {
        return fail(c, t('api.failedToSendMagicLink'), 500)
    }
}

export default sendMagicLink