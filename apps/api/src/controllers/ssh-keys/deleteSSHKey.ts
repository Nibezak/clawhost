import type { AuthenticatedContext } from '@/ts/Types'

import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { sshKeys } from '@/db/schema'
import { getProvider } from '@/services/provider'
import { ok, fail } from '@/lib/response'
import { t } from '@openclaw/i18n'

const deleteSSHKey = async (c: AuthenticatedContext) => {
    try {
        const userId = c.get('userId')
        const id = c.req.param('id')

        const key = await db
            .select()
            .from(sshKeys)
            .where(and(eq(sshKeys.id, id), eq(sshKeys.userId, userId)))
            .limit(1)

        if (!key[0]) {
            return fail(c, t('api.sshKeyNotFound'), 404)
        }

        if (key[0].providerKeyId) {
            try {
                await getProvider('hetzner').deleteSSHKey(key[0].providerKeyId)
            } catch (err) {
                console.error('Failed to delete SSH key from Hetzner:', err)
            }
        }

        if (key[0].digitaloceanKeyId) {
            try {
                await getProvider('digitalocean').deleteSSHKey(
                    key[0].digitaloceanKeyId
                )
            } catch (err) {
                console.error(
                    'Failed to delete SSH key from DigitalOcean:',
                    err
                )
            }
        }

        if (key[0].vultrKeyId) {
            try {
                await getProvider('vultr').deleteSSHKey(key[0].vultrKeyId)
            } catch (err) {
                console.error('Failed to delete SSH key from Vultr:', err)
            }
        }

        await db.delete(sshKeys).where(eq(sshKeys.id, id))

        return ok(c, null, t('api.sshKeyDeleted'))
    } catch (err) {
        console.error('Delete SSH key error:', err)
        return fail(
            c,
            err instanceof Error ? err.message : t('api.failedToDeleteSshKey'),
            500
        )
    }
}

export default deleteSSHKey