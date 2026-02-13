import type { Context } from 'hono'
import type { CreateSSHKeyBody } from '@/ts/Interfaces'

import { eq, count } from 'drizzle-orm'
import { db } from '@/db'
import { sshKeys } from '@/db/schema'
import { getProvider } from '@/services/provider'
import { ok, fail } from '@/lib/response'
import { t } from '@openclaw/i18n'

const MAX_SSH_KEYS_PER_ACCOUNT = 50

const createSSHKey = async (c: Context<{ Variables: { userId: string } }>) => {
    try {
        const userId = c.get('userId')
        const { name, publicKey } = await c.req.json<CreateSSHKeyBody>()

        if (!name || !publicKey) {
            return fail(c, t('api.nameAndKeyRequired'), 400)
        }

        const [{ value: keyCount }] = await db
            .select({ value: count() })
            .from(sshKeys)
            .where(eq(sshKeys.userId, userId))

        if (keyCount >= MAX_SSH_KEYS_PER_ACCOUNT) {
            return fail(c, t('api.sshKeyLimitReached'), 400)
        }

        if (!publicKey.startsWith('ssh-') && !publicKey.startsWith('ecdsa-')) {
            return fail(c, t('api.invalidSshKeyFormat'), 400)
        }

        const keyLabel = `${name}-${userId.slice(0, 8)}`

        const hetznerProvider = getProvider('hetzner')
        const hetznerKey = await hetznerProvider.createSSHKey(
            keyLabel,
            publicKey
        )

        let digitaloceanKeyId: number | null = null
        try {
            const doProvider = getProvider('digitalocean')
            const doKey = await doProvider.createSSHKey(keyLabel, publicKey)
            digitaloceanKeyId = doKey.id
        } catch (err) {
            console.error('Failed to register SSH key with DigitalOcean:', err)
        }

        let vultrKeyId: number | null = null
        try {
            const vultrProvider = getProvider('vultr')
            const vultrKey = await vultrProvider.createSSHKey(
                keyLabel,
                publicKey
            )
            vultrKeyId = vultrKey.id
        } catch (err) {
            console.error('Failed to register SSH key with Vultr:', err)
        }

        const id = crypto.randomUUID()
        await db.insert(sshKeys).values({
            id,
            userId,
            name,
            publicKey,
            fingerprint: hetznerKey.fingerprint,
            providerKeyId: hetznerKey.id,
            digitaloceanKeyId,
            vultrKeyId
        })

        return ok(
            c,
            {
                id,
                name,
                fingerprint: hetznerKey.fingerprint,
                publicKey,
                createdAt: new Date().toISOString()
            },
            t('api.sshKeyCreated')
        )
    } catch (err) {
        console.error('Create SSH key error:', err)
        return fail(
            c,
            err instanceof Error ? err.message : t('api.failedToCreateSshKey'),
            500
        )
    }
}

export default createSSHKey