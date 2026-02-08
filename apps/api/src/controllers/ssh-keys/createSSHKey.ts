import type { Context } from 'hono'
import { eq, count } from 'drizzle-orm'
import { db } from '@/db'
import { sshKeys } from '@/db/schema'
import { hetzner } from '@/services/hetzner'
import { t } from '@openclaw/i18n'

const MAX_SSH_KEYS_PER_ACCOUNT = 50

const createSSHKey = async (c: Context<{ Variables: { userId: string } }>) => {
    try {
        const userId = c.get('userId')
        const { name, publicKey } = await c.req.json<{
            name: string
            publicKey: string
        }>()

        if (!name || !publicKey) {
            return c.json({ error: t('api.nameAndKeyRequired') }, 400)
        }

        // Check SSH key limit
        const [{ value: keyCount }] = await db
            .select({ value: count() })
            .from(sshKeys)
            .where(eq(sshKeys.userId, userId))

        if (keyCount >= MAX_SSH_KEYS_PER_ACCOUNT) {
            return c.json(
                {
                    error: t('api.sshKeyLimitReached')
                },
                400
            )
        }

        // Validate SSH key format
        if (!publicKey.startsWith('ssh-') && !publicKey.startsWith('ecdsa-')) {
            return c.json({ error: t('api.invalidSshKeyFormat') }, 400)
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
            hetznerKeyId: hetznerKey.id
        })

        return c.json({
            id,
            name,
            fingerprint: hetznerKey.fingerprint,
            publicKey,
            createdAt: new Date().toISOString()
        })
    } catch (err) {
        console.error('Create SSH key error:', err)
        return c.json(
            {
                error:
                    err instanceof Error
                        ? err.message
                        : t('api.failedToCreateSshKey')
            },
            500
        )
    }
}

export default createSSHKey