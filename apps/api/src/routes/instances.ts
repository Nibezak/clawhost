import { Hono } from 'hono'
import { eq, and } from 'drizzle-orm'
import { db } from '../db'
import { instances, sshKeys, volumes } from '../db/schema'
import { hetzner } from '../services/hetzner'
import { cloudflare } from '../services/cloudflare'

const app = new Hono<{ Variables: { userId: string } }>()

const DOMAIN = 'clawhost.cloud'

// Generate a readable slug from instance ID (deterministic, 7 chars)
function generateSlug(id: string): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789' // Removed confusing chars: i, l, o, 0, 1
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i)
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

// Get all instances for user (with volumes and optional Hetzner sync)
app.get('/', async (c) => {
  const userId = c.get('userId')
  const sync = c.req.query('sync') === 'true'

  const userInstances = await db
    .select()
    .from(instances)
    .where(eq(instances.userId, userId))

  // Get volumes for each instance
  const userVolumes = await db
    .select()
    .from(volumes)
    .where(eq(volumes.userId, userId))

  // Optionally sync status with Hetzner for all instances
  let syncedInstances = userInstances
  if (sync) {
    syncedInstances = await Promise.all(
      userInstances.map(async (instance) => {
        if (!instance.hetznerServerId) return instance
        try {
          const hetznerStatus = await hetzner.getServer(instance.hetznerServerId)
          if (hetznerStatus.status !== instance.status || hetznerStatus.ip !== instance.ip) {
            await db
              .update(instances)
              .set({ status: hetznerStatus.status, ip: hetznerStatus.ip })
              .where(eq(instances.id, instance.id))
            return { ...instance, status: hetznerStatus.status, ip: hetznerStatus.ip }
          }
          return instance
        } catch (err) {
          console.error(`Failed to sync instance ${instance.id}:`, err)
          return instance
        }
      })
    )
  }

  // Attach volumes to instances
  const instancesWithVolumes = syncedInstances.map((instance) => ({
    ...instance,
    volumes: userVolumes.filter((v) => v.instanceId === instance.id),
  }))

  return c.json(instancesWithVolumes)
})

// Get single instance (with optional Hetzner status sync)
app.get('/:id', async (c) => {
  const userId = c.get('userId')
  const id = c.req.param('id')
  const sync = c.req.query('sync') === 'true'

  const instance = await db
    .select()
    .from(instances)
    .where(and(eq(instances.id, id), eq(instances.userId, userId)))
    .limit(1)

  if (!instance[0]) {
    return c.json({ error: 'Instance not found' }, 404)
  }

  // Optionally sync status with Hetzner
  if (sync && instance[0].hetznerServerId) {
    try {
      const hetznerStatus = await hetzner.getServer(instance[0].hetznerServerId)
      if (hetznerStatus.status !== instance[0].status || hetznerStatus.ip !== instance[0].ip) {
        await db
          .update(instances)
          .set({ status: hetznerStatus.status, ip: hetznerStatus.ip })
          .where(eq(instances.id, id))
        return c.json({ ...instance[0], status: hetznerStatus.status, ip: hetznerStatus.ip })
      }
    } catch (err) {
      console.error('Failed to sync with Hetzner:', err)
    }
  }

  return c.json(instance[0])
})

// Sync instance status with Hetzner
app.post('/:id/sync', async (c) => {
  const userId = c.get('userId')
  const id = c.req.param('id')

  const instance = await db
    .select()
    .from(instances)
    .where(and(eq(instances.id, id), eq(instances.userId, userId)))
    .limit(1)

  if (!instance[0] || !instance[0].hetznerServerId) {
    return c.json({ error: 'Instance not found' }, 404)
  }

  try {
    const hetznerStatus = await hetzner.getServer(instance[0].hetznerServerId)

    await db
      .update(instances)
      .set({ status: hetznerStatus.status, ip: hetznerStatus.ip })
      .where(eq(instances.id, id))

    return c.json({
      ...instance[0],
      status: hetznerStatus.status,
      ip: hetznerStatus.ip
    })
  } catch (err) {
    console.error('Failed to sync with Hetzner:', err)
    return c.json({ error: 'Failed to sync with Hetzner' }, 500)
  }
})

// Generate a secure random password
function generatePassword(length = 16): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => chars[byte % chars.length]).join('')
}

// Generate cloud-init script with subdomain and SSL
function generateCloudInit(rootPassword: string, subdomain: string, domain: string): string {
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

// Create instance
app.post('/', async (c) => {
  try {
    const userId = c.get('userId')
    const { name, planId, location, password, sshKeyId, volumeSize } = await c.req.json<{
      name: string
      planId: string
      location: string
      password?: string
      sshKeyId?: string
      volumeSize?: number // Optional volume size in GB
    }>()

    if (!name || !planId || !location) {
      return c.json({ error: 'Missing required fields' }, 400)
    }

    // Validate volume size if provided
    if (volumeSize !== undefined && (volumeSize < 10 || volumeSize > 10240)) {
      return c.json({ error: 'Volume size must be between 10 and 10240 GB' }, 400)
    }

    // Generate instance ID and subdomain
    const id = crypto.randomUUID()
    const subdomain = generateSlug(id)

    // Use provided password or generate a secure one
    const finalPassword = password || generatePassword()

    // Look up SSH key if provided
    let hetznerSshKeyIds: number[] | undefined
    if (sshKeyId) {
      const sshKey = await db
        .select()
        .from(sshKeys)
        .where(and(eq(sshKeys.id, sshKeyId), eq(sshKeys.userId, userId)))
        .limit(1)

      if (sshKey[0]?.hetznerKeyId) {
        hetznerSshKeyIds = [sshKey[0].hetznerKeyId]
      }
    }

    // Generate cloud-init with subdomain for SSL
    const cloudInitScript = generateCloudInit(finalPassword, subdomain, DOMAIN)

    // Create in Hetzner with our password and optional SSH key
    const { serverId, ip } = await hetzner.createServer(
      `${name}-${id.slice(0, 8)}`,
      planId,
      location,
      finalPassword,
      hetznerSshKeyIds,
      process.env.HETZNER_SNAPSHOT_ID,
      cloudInitScript
    )

    // Create DNS record in Cloudflare pointing subdomain to instance IP
    try {
      await cloudflare.createDNSRecord(subdomain, ip)
      console.log(`Created DNS record: ${subdomain}.${DOMAIN} -> ${ip}`)
    } catch (dnsErr) {
      console.error('Failed to create DNS record:', dnsErr)
      // Continue anyway - DNS can be added manually if needed
    }

    // Save instance to database
    await db.insert(instances).values({
      id,
      userId,
      name,
      hetznerServerId: serverId.toString(),
      status: 'running',
      ip,
      planId,
      location,
      rootPassword: finalPassword,
      sshKeyId: sshKeyId || null,
      subdomain,
    })

    // Create volume if requested
    let createdVolume = null
    if (volumeSize && volumeSize >= 10) {
      try {
        const volumeId = crypto.randomUUID()
        const hetznerVolume = await hetzner.createVolume(
          `${name}-vol-${volumeId.slice(0, 8)}`,
          volumeSize,
          location,
          serverId
        )

        await db.insert(volumes).values({
          id: volumeId,
          userId,
          instanceId: id,
          name: `${name}-storage`,
          size: volumeSize,
          hetznerVolumeId: hetznerVolume.id,
          location,
          status: 'available',
        })

        createdVolume = {
          id: volumeId,
          size: volumeSize,
          name: `${name}-storage`,
        }
      } catch (volumeErr) {
        console.error('Failed to create volume:', volumeErr)
        // Continue without volume - instance is already created
      }
    }

    return c.json({
      id,
      name,
      status: 'running',
      ip,
      planId,
      location,
      subdomain,
      url: `https://${subdomain}.${DOMAIN}`,
      createdAt: new Date().toISOString(),
      rootPassword: finalPassword,
      volume: createdVolume,
    })
  } catch (err) {
    console.error('Create instance error:', err)
    return c.json({ error: err instanceof Error ? err.message : 'Failed to create instance' }, 500)
  }
})

// Start instance
app.post('/:id/start', async (c) => {
  try {
    const userId = c.get('userId')
    const id = c.req.param('id')

    const instance = await db
      .select()
      .from(instances)
      .where(and(eq(instances.id, id), eq(instances.userId, userId)))
      .limit(1)

    if (!instance[0] || !instance[0].hetznerServerId) {
      return c.json({ error: 'Instance not found' }, 404)
    }

    await hetzner.startServer(instance[0].hetznerServerId)
    await db
      .update(instances)
      .set({ status: 'starting' })
      .where(eq(instances.id, id))

    return c.json({ success: true })
  } catch (err) {
    console.error('Start instance error:', err)
    return c.json({ error: err instanceof Error ? err.message : 'Failed to start instance' }, 500)
  }
})

// Stop instance
app.post('/:id/stop', async (c) => {
  try {
    const userId = c.get('userId')
    const id = c.req.param('id')

    const instance = await db
      .select()
      .from(instances)
      .where(and(eq(instances.id, id), eq(instances.userId, userId)))
      .limit(1)

    if (!instance[0] || !instance[0].hetznerServerId) {
      return c.json({ error: 'Instance not found' }, 404)
    }

    await hetzner.stopServer(instance[0].hetznerServerId)
    await db
      .update(instances)
      .set({ status: 'stopping' })
      .where(eq(instances.id, id))

    return c.json({ success: true })
  } catch (err) {
    console.error('Stop instance error:', err)
    return c.json({ error: err instanceof Error ? err.message : 'Failed to stop instance' }, 500)
  }
})

// Restart instance
app.post('/:id/restart', async (c) => {
  try {
    const userId = c.get('userId')
    const id = c.req.param('id')

    const instance = await db
      .select()
      .from(instances)
      .where(and(eq(instances.id, id), eq(instances.userId, userId)))
      .limit(1)

    if (!instance[0] || !instance[0].hetznerServerId) {
      return c.json({ error: 'Instance not found' }, 404)
    }

    await hetzner.restartServer(instance[0].hetznerServerId)

    return c.json({ success: true })
  } catch (err) {
    console.error('Restart instance error:', err)
    return c.json({ error: err instanceof Error ? err.message : 'Failed to restart instance' }, 500)
  }
})

// Delete instance
app.delete('/:id', async (c) => {
  try {
    const userId = c.get('userId')
    const id = c.req.param('id')

    const instance = await db
      .select()
      .from(instances)
      .where(and(eq(instances.id, id), eq(instances.userId, userId)))
      .limit(1)

    if (!instance[0]) {
      return c.json({ error: 'Instance not found' }, 404)
    }

    // Get associated volumes
    const instanceVolumes = await db
      .select()
      .from(volumes)
      .where(eq(volumes.instanceId, id))

    // Delete volumes from Hetzner first (must detach before deleting server)
    for (const vol of instanceVolumes) {
      if (vol.hetznerVolumeId) {
        try {
          await hetzner.detachVolume(vol.hetznerVolumeId)
          await hetzner.deleteVolume(vol.hetznerVolumeId)
        } catch (volErr) {
          console.error('Failed to delete volume:', volErr)
        }
      }
    }

    // Delete volumes from database
    await db.delete(volumes).where(eq(volumes.instanceId, id))

    // Delete DNS record from Cloudflare
    if (instance[0].subdomain) {
      try {
        const dnsRecord = await cloudflare.findDNSRecord(instance[0].subdomain)
        if (dnsRecord) {
          await cloudflare.deleteDNSRecord(dnsRecord.id)
          console.log(`Deleted DNS record: ${instance[0].subdomain}.${DOMAIN}`)
        }
      } catch (dnsErr) {
        console.error('Failed to delete DNS record:', dnsErr)
      }
    }

    // Delete server from Hetzner
    if (instance[0].hetznerServerId) {
      await hetzner.deleteServer(instance[0].hetznerServerId)
    }

    // Delete instance from database
    await db.delete(instances).where(eq(instances.id, id))

    return c.json({ success: true })
  } catch (err) {
    console.error('Delete instance error:', err)
    return c.json({ error: err instanceof Error ? err.message : 'Failed to delete instance' }, 500)
  }
})

export default app
