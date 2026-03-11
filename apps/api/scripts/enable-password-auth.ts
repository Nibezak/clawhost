import { db } from '@/db'
import { claws } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { clawStatus } from '@openclaw/shared'
import executeSSH from '@/services/ssh'

const run = async () => {
    const allClaws = await db
        .select()
        .from(claws)
        .where(eq(claws.status, clawStatus.running))

    const eligible = allClaws.filter((c) => c.ip && c.rootPassword)
    console.log(`Found ${eligible.length} running claws with credentials\n`)

    const command = [
        "sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config",
        "grep -q '^PasswordAuthentication' /etc/ssh/sshd_config || echo 'PasswordAuthentication yes' >> /etc/ssh/sshd_config",
        'systemctl restart sshd || systemctl restart ssh',
        'echo "PWAUTH_OK"'
    ].join(' && ')

    let success = 0
    let failed = 0

    for (const claw of eligible) {
        process.stdout.write(`${claw.name} (${claw.ip})... `)
        try {
            const output = await executeSSH(
                claw.ip!,
                claw.rootPassword!,
                command,
                15000
            )
            if (output.includes('PWAUTH_OK')) {
                console.log('OK')
                success++
            } else {
                console.log(`UNEXPECTED: ${output.trim()}`)
                failed++
            }
        } catch (err) {
            console.log(`FAILED: ${err instanceof Error ? err.message : err}`)
            failed++
        }
    }

    console.log(`\nDone: ${success} fixed, ${failed} failed`)
}

run().catch(console.error)