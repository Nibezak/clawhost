import type { Context } from 'hono'
import type { ProviderType } from '@/ts/Types'

import { getProvider } from '@/services/provider'
import { t } from '@openclaw/i18n'

const getLocations = async (c: Context) => {
    try {
        const providerName = (c.req.query('provider') ||
            'hetzner') as ProviderType
        const provider = getProvider(providerName)
        const locations = await provider.getLocations()
        return c.json(locations)
    } catch (err) {
        console.error('Failed to fetch locations:', err)
        return c.json({ error: t('api.failedToFetchLocations') }, 500)
    }
}

export default getLocations