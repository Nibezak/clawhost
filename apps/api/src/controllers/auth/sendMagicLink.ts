import type { Context } from 'hono'
import type { SendMagicLinkBody } from '@/ts/Interfaces'

import { eq } from 'drizzle-orm'
import { auth } from '@/services/firebase'
import { getResend, FROM_EMAIL } from '@/services/resend'
import { db } from '@/db'
import { rateLimits } from '@/db/schema'
import MagicLinkEmail from '@/emails/MagicLinkEmail'
import { t } from '@openclaw/i18n'

const RATE_LIMIT_WINDOW = 60_000

const getClientIp = (c: Context): string | null => {
    return c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
        || c.req.header('x-real-ip')
        || null
}

const checkRateLimit = async (key: string): Promise<number> => {
    const record = await db
        .select()
        .from(rateLimits)
        .where(eq(rateLimits.key, key))
        .then((rows) => rows[0])

    if (!record) return 0
    const elapsed = Date.now() - record.lastSentAt.getTime()
    if (elapsed >= RATE_LIMIT_WINDOW) return 0
    return Math.ceil((RATE_LIMIT_WINDOW - elapsed) / 1000)
}

const setRateLimit = async (...keys: string[]): Promise<void> => {
    const now = new Date()
    await Promise.all(
        keys.map((key) =>
            db
                .insert(rateLimits)
                .values({ key, lastSentAt: now })
                .onConflictDoUpdate({
                    target: rateLimits.key,
                    set: { lastSentAt: now }
                })
        )
    )
}

const sendMagicLink = async (c: Context) => {
    try {
        const ip = getClientIp(c)

        if (ip) {
            const ipRetry = await checkRateLimit(`ip:${ip}`)
            if (ipRetry > 0) {
                return c.json(
                    { error: t('api.rateLimitExceeded'), retryAfter: ipRetry },
                    429
                )
            }
        }

        const { email, redirectUrl } = await c.req.json<SendMagicLinkBody>()

        if (!email) {
            return c.json({ error: t('api.emailRequired') }, 400)
        }

        if (!redirectUrl) {
            return c.json({ error: t('api.redirectUrlRequired') }, 400)
        }

        const emailRetry = await checkRateLimit(`email:${email.toLowerCase()}`)
        if (emailRetry > 0) {
            return c.json(
                { error: t('api.rateLimitExceeded'), retryAfter: emailRetry },
                429
            )
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

        const keys = [`email:${email.toLowerCase()}`]
        if (ip) keys.push(`ip:${ip}`)
        await setRateLimit(...keys)
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