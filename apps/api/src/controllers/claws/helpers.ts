// Generate a readable slug from claw ID (deterministic, 7 chars)
export function generateSlug(id: string): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789' // Removed confusing chars: i, l, o, 0, 1
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash = hash & hash
  }
  let slug = ''
  let num = Math.abs(hash)
  for (let i = 0; i < 7; i++) {
    slug += chars[num % chars.length]
    num = Math.floor(num / chars.length) + id.charCodeAt(i % id.length)
  }
  return slug
}

// Generate a secure random password
export function generatePassword(length = 16): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => chars[byte % chars.length]).join('')
}

// Generate cloud-init script with subdomain and SSL
export function generateCloudInit(rootPassword: string, subdomain: string, domain: string): string {
  const fullDomain = `${subdomain}.${domain}`

  // Note: Using template literal, variables like $http_upgrade need escaping
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

  # Create OpenClaw directories and config
  - mkdir -p /home/openclaw/.openclaw

  # Generate a random token for gateway auth and trust nginx proxy
  - |
    TOKEN=\\$(openssl rand -hex 32)
    cat > /home/openclaw/.openclaw/openclaw.json << OCCONFIG
    {
      "gateway": {
        "mode": "local",
        "auth": {
          "token": "\\$TOKEN"
        },
        "trustedProxies": ["127.0.0.1", "::1"]
      }
    }
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
    ExecStart=/usr/bin/openclaw gateway --port 18789 --bind loopback
    Restart=always
    RestartSec=10

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
  - |
    cat > /etc/nginx/sites-available/openclaw << 'NGINXEOF'
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
            proxy_set_header Upgrade \\$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \\$host;
            proxy_set_header X-Real-IP \\$remote_addr;
            proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \\$scheme;
            proxy_cache_bypass \\$http_upgrade;
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

final_message: "OpenClaw instance ready! Access dashboard at https://${fullDomain}/"
`
}

export const DOMAIN = 'clawhost.cloud'
