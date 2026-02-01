import { Hono } from 'hono'
import { eq, and } from 'drizzle-orm'
import { db } from '../db'
import { sshKeys } from '../db/schema'
import { hetzner } from '../services/hetzner'

const app = new Hono<{ Variables: { userId: string } }>()

// Get all SSH keys for user
app.get('/', async (c) => {
  const userId = c.get('userId')

  const keys = await db
    .select({
      id: sshKeys.id,
      name: sshKeys.name,
      fingerprint: sshKeys.fingerprint,
      publicKey: sshKeys.publicKey,
      createdAt: sshKeys.createdAt,
    })
    .from(sshKeys)
    .where(eq(sshKeys.userId, userId))

  return c.json(keys)
})

// Create SSH key
app.post('/', async (c) => {
  try {
    const userId = c.get('userId')
    const { name, publicKey } = await c.req.json<{
      name: string
      publicKey: string
    }>()

    if (!name || !publicKey) {
      return c.json({ error: 'Name and public key are required' }, 400)
    }

    // Validate SSH key format
    if (!publicKey.startsWith('ssh-') && !publicKey.startsWith('ecdsa-')) {
      return c.json({ error: 'Invalid SSH public key format' }, 400)
    }

    // Create in Hetzner first
    const hetznerKey = await hetzner.createSSHKey(
      `${name}-${userId.slice(0, 8)}`,
      publicKey
    )

    // Save to database
    const id = crypto.randomUUID()
    await db.insert(sshKeys).values({
      id,
      userId,
      name,
      publicKey,
      fingerprint: hetznerKey.fingerprint,
      hetznerKeyId: hetznerKey.id,
    })

    return c.json({
      id,
      name,
      fingerprint: hetznerKey.fingerprint,
      publicKey,
      createdAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Create SSH key error:', err)
    return c.json(
      { error: err instanceof Error ? err.message : 'Failed to create SSH key' },
      500
    )
  }
})

// Delete SSH key
app.delete('/:id', async (c) => {
  try {
    const userId = c.get('userId')
    const id = c.req.param('id')

    const key = await db
      .select()
      .from(sshKeys)
      .where(and(eq(sshKeys.id, id), eq(sshKeys.userId, userId)))
      .limit(1)

    if (!key[0]) {
      return c.json({ error: 'SSH key not found' }, 404)
    }

    // Delete from Hetzner if we have the ID
    if (key[0].hetznerKeyId) {
      await hetzner.deleteSSHKey(key[0].hetznerKeyId)
    }

    // Delete from database
    await db.delete(sshKeys).where(eq(sshKeys.id, id))

    return c.json({ success: true })
  } catch (err) {
    console.error('Delete SSH key error:', err)
    return c.json(
      { error: err instanceof Error ? err.message : 'Failed to delete SSH key' },
      500
    )
  }
})

export default app
