import type { Context } from 'hono'
import { eq, desc } from 'drizzle-orm'
import { db } from '../../db'
import { sshKeys } from '../../db/schema'

const getSSHKeys = async (c: Context<{ Variables: { userId: string } }>) => {
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
    .orderBy(desc(sshKeys.createdAt))

  return c.json(keys)
}

export default getSSHKeys
