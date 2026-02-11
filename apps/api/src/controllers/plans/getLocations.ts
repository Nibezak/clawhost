import type { Context } from 'hono'
import type { ProviderType } from '@/ts/Types'

import { getProvider } from '@/services/provider'
import { ok, fail } from '@/lib/response'
import { t } from '@openclaw/i18n'

const getLocations = async (c: Context) => {
    try {
        const providerName = (c.req.query('provider') ||
            'hetzner') as ProviderType
        const provider = getProvider(providerName)
        const locations = await provider.getLocations()
        return ok(c, locations, t('api.locationsFetched'))
    } catch (err) {
        console.error('Failed to fetch locations:', err)
        return fail(c, t('api.failedToFetchLocations'), 500)
    }
}

export default getLocations