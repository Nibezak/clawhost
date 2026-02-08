import type { Context } from 'hono'
import type { ProviderType } from '@/ts/Types'

import { getProvider } from '@/services/provider'
import { t } from '@openclaw/i18n'

const getVolumePricing = async (c: Context) => {
    try {
        const providerName = (c.req.query('provider') ||
            'hetzner') as ProviderType
        const provider = getProvider(providerName)
        const pricing = await provider.getVolumePricing()
        return c.json({
            pricePerGbMonthly:
                Math.ceil(pricing.pricePerGbMonthly * 3 * 1000) / 1000,
            minSize: 10,
            maxSize: 10240
        })
    } catch (err) {
        console.error('Failed to fetch volume pricing:', err)
        return c.json({ error: t('api.failedToFetchVolumePricing') }, 500)
    }
}

export default getVolumePricing