import 'dotenv/config'
import { en } from '@openclaw/i18n'
import { db } from '@/db'
import { users } from '@/db/schema'
import { getResend, FROM_EMAIL } from '@/services/resend'
import ChangelogEmail from '@/emails/ChangelogEmail'

const BATCH_SIZE = 100

function getRelease(releaseNumber: string) {
    const changelog = en.changelog as Record<string, string>
    const prefix = `release${releaseNumber}`

    const title = changelog[`${prefix}Title`]
    const description = changelog[`${prefix}Description`]
    const date = changelog[`${prefix}Date`]

    if (!title || !description || !date) {
        return null
    }

    const features: string[] = []
    let i = 1
    while (changelog[`${prefix}Feature${i}`]) {
        features.push(changelog[`${prefix}Feature${i}`])
        i++
    }

    return { title, description, date, features }
}

async function main() {
    const releaseNumber = process.argv[2]

    if (!releaseNumber) {
        console.error(
            'Usage: tsx scripts/send-changelog-email.ts <release-number>'
        )
        console.error('Example: tsx scripts/send-changelog-email.ts 11')
        process.exit(1)
    }

    const release = getRelease(releaseNumber)

    if (!release) {
        console.error(`Release ${releaseNumber} not found in translations.`)
        console.error(
            'Available releases have keys like changelog.release11Title in en.ts'
        )
        process.exit(1)
    }

    console.log(`\n📋 Release ${releaseNumber}`)
    console.log(`   Title: ${release.title}`)
    console.log(`   Date: ${release.date}`)
    console.log(`   Description: ${release.description}`)
    console.log(`   Features (${release.features.length}):`)
    release.features.forEach((f, i) => console.log(`     ${i + 1}. ${f}`))

    const allUsers = await db.select({ email: users.email }).from(users)

    if (allUsers.length === 0) {
        console.error('\nNo users found in the database.')
        process.exit(1)
    }

    console.log(`\n📧 Sending to ${allUsers.length} users...\n`)

    const resend = getResend()
    let sent = 0
    let failed = 0

    for (let i = 0; i < allUsers.length; i += BATCH_SIZE) {
        const batch = allUsers.slice(i, i + BATCH_SIZE)

        const emails = batch.map((user) => ({
            from: FROM_EMAIL,
            to: user.email,
            subject: en.emails.changelogSubject,
            react: ChangelogEmail({
                title: release.title,
                description: release.description,
                features: release.features,
                date: release.date
            })
        }))

        try {
            const { error } = await resend.batch.send(emails)

            if (error) {
                console.error(
                    `   ❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`,
                    error
                )
                failed += batch.length
            } else {
                sent += batch.length
                console.log(
                    `   ✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} emails sent`
                )
            }
        } catch (err) {
            console.error(
                `   ❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} error:`,
                err instanceof Error ? err.message : err
            )
            failed += batch.length
        }
    }

    console.log('\n' + '='.repeat(50))
    console.log('📊 SUMMARY')
    console.log('='.repeat(50))
    console.log(`   Sent: ${sent}`)
    console.log(`   Failed: ${failed}`)
    console.log(`   Total: ${allUsers.length}`)
}

main().catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
})