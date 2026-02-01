import type { Context } from 'hono'
import { eq, and } from 'drizzle-orm'
import { db } from '../../db'
import { sshKeys } from '../../db/schema'
import { hetzner } from '../../services/hetzner'

const deleteSSHKey = async (c: Context<{ Variables: { userId: string } }>) => {
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
    return c.json({ error: err instanceof Error ? err.message : 'Failed to delete SSH key' }, 500)
  }
}

export default deleteSSHKey
