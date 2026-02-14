import type { Context } from 'hono'
import type { VerifyOtpBody } from '@/ts/Interfaces'

import crypto from 'crypto'
import { eq, and, gt } from 'drizzle-orm'
import { auth } from '@/services/firebase'
import { db } from '@/db'
import { otpCodes, users } from '@/db/schema'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'

const MAX_ATTEMPTS = 5

const hashCode = (code: string): string => {
    return crypto.createHash('sha256').update(code).digest('hex')
}

const verifyOtp = async (c: Context) => {
    try {
        const { email, code } = await c.req.json<VerifyOtpBody>()

        if (!email || !code) {
            return fail(c, t('api.emailRequired'), 400)
        }

        const normalizedEmail = email.toLowerCase()

        const record = await db
            .select()
            .from(otpCodes)
            .where(
                and(
                    eq(otpCodes.email, normalizedEmail),
                    gt(otpCodes.expiresAt, new Date())
                )
            )
            .then((rows) => rows[0])

        if (!record) {
            return fail(c, t('api.otpExpiredOrNotFound'), 401)
        }

        if (record.attempts >= MAX_ATTEMPTS) {
            await db.delete(otpCodes).where(eq(otpCodes.id, record.id))
            return fail(c, t('api.otpMaxAttemptsReached'), 401)
        }

        await db
            .update(otpCodes)
            .set({ attempts: record.attempts + 1 })
            .where(eq(otpCodes.id, record.id))

        const codeHash = hashCode(code)
        if (codeHash !== record.codeHash) {
            const remaining = MAX_ATTEMPTS - (record.attempts + 1)
            return fail(c, t('api.otpInvalidCode'), 401, {
                attemptsRemaining: remaining
            })
        }

        await db.delete(otpCodes).where(eq(otpCodes.id, record.id))

        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, normalizedEmail))
            .then((rows) => rows[0])

        let uid: string

        if (existingUser) {
            uid = existingUser.id
        } else {
            uid = crypto.randomUUID()
            await db.insert(users).values({
                id: uid,
                email: normalizedEmail
            })
        }

        const customToken = await auth().createCustomToken(uid)
        return ok(c, { customToken }, t('api.otpVerified'))
    } catch (err) {
        console.error('Verify OTP error:', err)
        return fail(
            c,
            err instanceof Error ? err.message : t('api.internalServerError'),
            500
        )
    }
}

export default verifyOtp