import { db } from '@/db'
import { claws } from '@/db/schema'
import { eq } from 'drizzle-orm'
import executeSSH from '@/services/ssh'

const subdomain = process.argv[2]

if (!subdomain) {
    console.error('Usage: tsx scripts/diagnose-claw.ts <subdomain>')
    process.exit(1)
}

const run = async () => {
    const result = await db
        .select()
        .from(claws)
        .where(eq(claws.subdomain, subdomain))
        .limit(1)

    const claw = result[0]

    if (!claw) {
        console.error(`Claw with subdomain "${subdomain}" not found`)
        process.exit(1)
    }

    if (!claw.ip || !claw.rootPassword) {
        console.error('Claw has no IP or password')
        process.exit(1)
    }

    console.log(`Diagnosing ${subdomain}.clawhost.cloud (${claw.ip})...\n`)

    const commands = [
        {
            label: 'Gateway status',
            cmd: 'systemctl is-active openclaw-gateway'
        },
        {
            label: 'Gateway local response',
            cmd: 'curl -sv http://127.0.0.1:18789 2>&1 | head -20'
        },
        {
            label: 'Nginx config',
            cmd: 'cat /etc/nginx/sites-available/openclaw'
        },
        {
            label: 'OpenClaw config (tools + browser + gateway)',
            cmd: "cat /home/openclaw/.openclaw/openclaw.json | python3 -c \"import sys,json; c=json.load(sys.stdin); [print(f'{k}: {json.dumps(c.get(k), indent=2)}') for k in ['tools','browser','gateway']]\""
        },
        {
            label: 'Nginx error log (last 10)',
            cmd: 'tail -10 /var/log/nginx/error.log 2>/dev/null || echo "no error log"'
        },
        {
            label: 'OpenClaw gateway log (last 10)',
            cmd: 'tail -10 /var/log/openclaw-gateway.log 2>/dev/null || echo "no gateway log"'
        },
        {
            label: 'SSL cert check',
            cmd: `ls -la /etc/letsencrypt/live/${subdomain}.clawhost.cloud/ 2>/dev/null || echo "no SSL certs found"`
        }
    ]

    for (const { label, cmd } of commands) {
        console.log(`--- ${label} ---`)
        try {
            const output = await executeSSH(
                claw.ip,
                claw.rootPassword,
                cmd,
                10000
            )
            console.log(output.trim())
        } catch (err) {
            console.log(`ERROR: ${err}`)
        }
        console.log()
    }
}

run().catch(console.error)