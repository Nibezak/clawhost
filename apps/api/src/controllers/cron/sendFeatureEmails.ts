import type { Context } from 'hono'

import crypto from 'crypto'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users, emails } from '@/db/schema'
import { getResend, FROM_EMAIL } from '@/services/resend'
import FEATURE_EMAILS from '@/lib/featureEmails'
import { ok, fail } from '@/lib/response'
import { t } from '@openclaw/i18n'

const BATCH_DELAY_MS = 200

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const sendFeatureEmails = async (c: Context) => {
    try {
        const resend = getResend()
        const allUsers = await db.select({ id: users.id, email: users.email }).from(users)

        let totalSent = 0

        for (const user of allUsers) {
            const sentEmails = await db
                .select({ feature: emails.feature })
                .from(emails)
                .where(eq(emails.userId, user.id))

            const sentFeatures = new Set(sentEmails.map((e) => e.feature))

            const nextFeature = FEATURE_EMAILS.find((f) => !sentFeatures.has(f.key))
            if (!nextFeature) continue

            const { error } = await resend.emails.send({
                from: FROM_EMAIL,
                to: user.email,
                subject: nextFeature.subject,
                react: nextFeature.render()
            })

            if (error) {
                console.error(`Failed to send to ${user.email}:`, error)
                continue
            }

            await db.insert(emails).values({
                id: crypto.randomUUID(),
                userId: user.id,
                feature: nextFeature.key
            })

            totalSent++
            await sleep(BATCH_DELAY_MS)
        }

        return ok(c, { sent: totalSent }, t('api.featureEmailsSent'))
    } catch {
        return fail(c, t('api.featureEmailsFailed'), 500)
    }
}

export default sendFeatureEmails