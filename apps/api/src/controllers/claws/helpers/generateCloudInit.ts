function getProviderEnvVar(model: string): string | null {
    if (model.startsWith('anthropic/')) return 'ANTHROPIC_API_KEY'
    if (model.startsWith('openai/')) return 'OPENAI_API_KEY'
    if (model.startsWith('google/')) return 'GEMINI_API_KEY'
    return null
}

export default function generateCloudInit(
    rootPassword: string,
    subdomain: string,
    domain: string,
    gatewayToken: string,
    model?: string,
    apiToken?: string
): string {
    const fullDomain = `${subdomain}.${domain}`

    const config: Record<string, unknown> = {
        gateway: {
            mode: 'local',
            auth: {
                mode: 'token',
                token: gatewayToken
            },
            controlUi: {
                allowInsecureAuth: true
            },
            trustedProxies: ['127.0.0.1', '::1']
        },
        channels: {
            whatsapp: { dmPolicy: 'open', allowFrom: ['*'] },
            telegram: { dmPolicy: 'open', allowFrom: ['*'] },
            discord: {},
            slack: {},
            signal: { dmPolicy: 'open', allowFrom: ['*'] },
            imessage: { dmPolicy: 'open', allowFrom: ['*'] }
        }
    }

    const agentDefaults: Record<string, unknown> = {
        sandbox: { mode: 'off' }
    }

    if (model) {
        agentDefaults.model = { primary: model }

        const envVarName = getProviderEnvVar(model)
        if (envVarName && apiToken) {
            config.env = {
                [envVarName]: apiToken
            }
        }
    }

    config.agents = { defaults: agentDefaults }

    const configJson = JSON.stringify(config, null, 2).replace(/\n/g, '\n    ')

    return `#cloud-config

# OpenClaw Instance Auto-Configuration
# Fully automatic setup with SSL - users access via subdomain only

# Set root password (overrides Hetzner's default)
chpasswd:
  list: |
    root:${rootPassword}
  expire: false

package_update: true
package_upgrade: true

packages:
  - git
  - curl
  - wget
  - vim
  - htop
  - nginx
  - certbot
  - python3-certbot-nginx
  - ufw
  - ca-certificates
  - gnupg

runcmd:
  # Create swap space for low-memory servers
  - fallocate -l 2G /swapfile
  - chmod 600 /swapfile
  - mkswap /swapfile
  - swapon /swapfile
  - echo '/swapfile none swap sw 0 0' >> /etc/fstab

  # Install Node.js 22 (required for OpenClaw)
  - mkdir -p /etc/apt/keyrings
  - curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
  - echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" > /etc/apt/sources.list.d/nodesource.list
  - apt-get update
  - apt-get install -y nodejs

  # Install OpenClaw globally
  - npm install -g openclaw@latest

  # Create openclaw user for running the service
  - useradd -r -m -d /home/openclaw -s /bin/bash openclaw
  - echo 'openclaw ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/openclaw

  # Create OpenClaw directories, config, and agent auth directory
  - mkdir -p /home/openclaw/.openclaw
  - mkdir -p /home/openclaw/.openclaw/agents/main/agent

  # Configure gateway with token auth, channels, and skip device pairing for web access
  - |
    cat > /home/openclaw/.openclaw/openclaw.json << 'OCCONFIG'
    ${configJson}
    OCCONFIG

  - chown -R openclaw:openclaw /home/openclaw

  # Create systemd service for OpenClaw (system-level for always-on)
  - |
    cat > /etc/systemd/system/openclaw-gateway.service <<'SYSTEMD'
    [Unit]
    Description=OpenClaw Gateway
    After=network.target

    [Service]
    Type=simple
    User=openclaw
    Group=openclaw
    WorkingDirectory=/home/openclaw
    Environment=HOME=/home/openclaw
    Environment=NODE_ENV=production
    Environment=NODE_OPTIONS=--max-old-space-size=512
    ExecStart=/usr/bin/openclaw gateway --port 18789 --bind loopback
    Restart=always
    RestartSec=10
    StandardOutput=append:/var/log/openclaw-gateway.log
    StandardError=append:/var/log/openclaw-gateway.log

    [Install]
    WantedBy=multi-user.target
    SYSTEMD

  # Enable and start OpenClaw service
  - systemctl daemon-reload
  - systemctl enable openclaw-gateway
  - systemctl start openclaw-gateway

  # Configure firewall
  - ufw allow 22/tcp
  - ufw allow 80/tcp
  - ufw allow 443/tcp
  - ufw --force enable

  # Create Nginx config - only responds to subdomain, blocks IP access
  # Note: heredoc uses single-quoted delimiter so $ is literal (no bash expansion needed)
  # JS template literals only interpolate \${...} with braces, so bare $word is safe
  - |
    cat > /etc/nginx/sites-available/openclaw << 'NGINXEOF'
    # Map upgrade header for WebSocket support (must be outside server blocks)
    map $http_upgrade $connection_upgrade {
        default upgrade;
        '' close;
    }

    # Block direct IP access - return 444 (connection closed)
    server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name _;
        return 444;
    }

    # Subdomain server - will be upgraded to HTTPS by certbot
    server {
        listen 80;
        listen [::]:80;
        server_name ${fullDomain};

        location / {
            proxy_pass http://127.0.0.1:18789;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            proxy_read_timeout 86400;
            proxy_send_timeout 86400;
        }
    }
    NGINXEOF

  # Enable the site and start Nginx
  - ln -sf /etc/nginx/sites-available/openclaw /etc/nginx/sites-enabled/
  - rm -f /etc/nginx/sites-enabled/default
  - nginx -t && systemctl reload nginx
  - systemctl enable nginx

  # Wait for DNS propagation then get SSL certificate
  - sleep 60
  - certbot --nginx -d ${fullDomain} --non-interactive --agree-tos --email ssl@${domain} --redirect

  # Set up automatic renewal cron (twice daily, renews if <30 days left)
  - echo "0 0,12 * * * root certbot renew --quiet --deploy-hook 'systemctl reload nginx'" > /etc/cron.d/certbot-renew
  - chmod 644 /etc/cron.d/certbot-renew

  # Install Homebrew in the background (non-blocking)
  - |
    cat > /tmp/install-brew.sh << 'BREWSCRIPT'
    #!/bin/bash
    su - openclaw -c 'NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
    echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> /home/openclaw/.bashrc
    BREWSCRIPT
    chmod +x /tmp/install-brew.sh
    nohup /tmp/install-brew.sh > /var/log/brew-install.log 2>&1 &

final_message: "OpenClaw instance ready! Access dashboard at https://${fullDomain}/"
`
}