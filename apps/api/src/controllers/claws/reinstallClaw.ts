import type { AuthenticatedContext } from '@/ts/Types'

import { eq } from 'drizzle-orm'
import { clawStatus } from '@openclaw/shared'
import { db } from '@/db'
import { claws } from '@/db/schema'
import executeSSH from '@/services/ssh'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'
import { OPENCLAW_VERSION } from '@/controllers/claws/helpers'

const reinstallClaw = async (c: AuthenticatedContext) => {
    try {
        const id = c.req.param('id')
        const claw = await db
            .select()
            .from(claws)
            .where(eq(claws.id, id))
            .limit(1)

        if (!claw[0]) {
            return fail(c, t('api.clawNotFound'), 404)
        }

        if (!claw[0].ip || !claw[0].rootPassword) {
            return fail(c, t('api.failedToReinstallClaw'), 400)
        }

        const fullDomain = `${claw[0].subdomain}.clawhost.cloud`
        const BASE_DIR = '/home/openclaw/.openclaw'

        const existingOutput = await executeSSH(
            claw[0].ip,
            claw[0].rootPassword,
            `cat ${BASE_DIR}/openclaw.json 2>/dev/null || echo '{}'`,
            5000
        )

        let config: Record<string, unknown> = {}
        try {
            const jsonStart = existingOutput.indexOf('{')
            const jsonEnd = existingOutput.lastIndexOf('}')
            const jsonStr = jsonStart >= 0 && jsonEnd > jsonStart
                ? existingOutput.substring(jsonStart, jsonEnd + 1)
                : '{}'
            config = JSON.parse(jsonStr)
        } catch {
            config = {}
        }

        config.gateway = {
            mode: 'local',
            auth: {
                mode: 'token',
                token: claw[0].gatewayToken
            },
            controlUi: {
                allowInsecureAuth: true
            },
            trustedProxies: ['127.0.0.1', '::1']
        }

        if (!config.channels) {
            config.channels = {
                whatsapp: { dmPolicy: 'open', allowFrom: ['*'] },
                telegram: { dmPolicy: 'open', allowFrom: ['*'] },
                discord: {},
                slack: {},
                signal: { dmPolicy: 'open', allowFrom: ['*'] }
            }
        }

        const commands = (config.commands || {}) as Record<string, unknown>
        commands.restart = true
        commands.bash = true
        config.commands = commands

        const tools = (config.tools || {}) as Record<string, unknown>
        tools.profile = 'full'
        if (!tools.elevated) {
            tools.elevated = { enabled: true }
        }
        delete tools.browser
        delete tools.web_search
        delete tools.web_fetch
        delete tools.canvas
        delete tools.nodes
        delete tools.image
        delete tools.message
        delete tools.cron
        config.tools = tools

        config.browser = {
            enabled: true,
            executablePath: '/usr/bin/google-chrome-stable',
            headless: true,
            noSandbox: true
        }

        const agents = (config.agents || {}) as Record<string, unknown>
        const defaults = (agents.defaults || {}) as Record<string, unknown>
        defaults.sandbox = { mode: 'off' }
        agents.defaults = defaults
        config.agents = agents

        const configJson = JSON.stringify(config, null, 2)
        const configB64 = Buffer.from(configJson).toString('base64')

        const serviceFile = `[Unit]
Description=OpenClaw Gateway
After=network.target

[Service]
Type=simple
User=openclaw
Group=openclaw
WorkingDirectory=/home/openclaw
Environment=HOME=/home/openclaw
Environment=NODE_ENV=production
ExecStart=/usr/bin/openclaw gateway --port 18789 --bind loopback
Restart=always
RestartSec=10
StartLimitIntervalSec=0
StandardOutput=append:/var/log/openclaw-gateway.log
StandardError=append:/var/log/openclaw-gateway.log

[Install]
WantedBy=multi-user.target`
        const serviceB64 = Buffer.from(serviceFile).toString('base64')

        const sslCertPath = `/etc/letsencrypt/live/${fullDomain}/fullchain.pem`
        const sslKeyPath = `/etc/letsencrypt/live/${fullDomain}/privkey.pem`

        const nginxConf = `map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    return 444;
}

server {
    listen 80;
    listen [::]:80;
    server_name ${fullDomain};
    return 301 https://\\$host\\$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name ${fullDomain};

    ssl_certificate ${sslCertPath};
    ssl_certificate_key ${sslKeyPath};
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://127.0.0.1:18789;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\$http_upgrade;
        proxy_set_header Connection \\$connection_upgrade;
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\$scheme;
        proxy_cache_bypass \\$http_upgrade;
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }
}`
        const nginxB64 = Buffer.from(nginxConf).toString('base64')

        const reinstallCommands = [
            'systemctl stop openclaw-gateway || true',
            `npm install -g openclaw@${OPENCLAW_VERSION}`,
            'if ! command -v google-chrome-stable &>/dev/null; then wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -O /tmp/google-chrome.deb && (dpkg -i /tmp/google-chrome.deb || apt-get install -f -y) && rm -f /tmp/google-chrome.deb; fi',
            `echo '${configB64}' | base64 -d > ${BASE_DIR}/openclaw.json`,
            'chown -R openclaw:openclaw /home/openclaw',
            `echo '${serviceB64}' | base64 -d > /etc/systemd/system/openclaw-gateway.service`,
            `if [ -f ${sslCertPath} ]; then echo '${nginxB64}' | base64 -d > /etc/nginx/sites-available/openclaw; else certbot --nginx -d ${fullDomain} --non-interactive --agree-tos --email ssl@clawhost.cloud --redirect || true; fi`,
            'ln -sf /etc/nginx/sites-available/openclaw /etc/nginx/sites-enabled/',
            'rm -f /etc/nginx/sites-enabled/default',
            'mkdir -p /etc/systemd/system/nginx.service.d',
            "printf '[Service]\\nRestart=always\\nRestartSec=5\\n' > /etc/systemd/system/nginx.service.d/override.conf",
            'systemctl daemon-reload',
            'nginx -t && systemctl reload nginx',
            'su - openclaw -c "openclaw doctor --fix" || true',
            'systemctl restart openclaw-gateway',
            'sleep 15',
            'curl -sf -o /dev/null --max-time 5 http://127.0.0.1:18789 && echo "GATEWAY_OK" || echo "GATEWAY_FAILED"'
        ].join(' && ')

        const output = await executeSSH(
            claw[0].ip,
            claw[0].rootPassword,
            reinstallCommands,
            120000
        )
        const success = output.includes('GATEWAY_OK')

        if (success && claw[0].status === clawStatus.configuring) {
            await db
                .update(claws)
                .set({ status: clawStatus.running })
                .where(eq(claws.id, id))
        }

        if (success) {
            return ok(c, null, t('api.reinstallSuccess'))
        }

        return fail(c, t('api.reinstallGatewayNotResponding'), 500)
    } catch (err) {
        console.error('Reinstall claw error:', err)
        return fail(
            c,
            err instanceof Error ? err.message : t('api.failedToReinstallClaw'),
            500
        )
    }
}

export default reinstallClaw