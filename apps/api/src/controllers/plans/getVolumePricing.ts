import type { Context } from 'hono'
import type { ProviderType } from '@/ts/Types'

import { getProvider } from '@/services/provider'
import { ok, fail } from '@/lib/response'
import { t } from '@openclaw/i18n'

const getVolumePricing = async (c: Context) => {
    try {
        const providerName = (c.req.query('provider') ||
            'hetzner') as ProviderType
        const provider = getProvider(providerName)
        const pricing = await provider.getVolumePricing()
        return ok(
            c,
            {
                pricePerGbMonthly:
                    Math.ceil(pricing.pricePerGbMonthly * 3 * 1000) / 1000,
                minSize: 10,
                maxSize: 10240
            },
            t('api.volumePricingFetched')
        )
    } catch (err) {
        console.error('Failed to fetch volume pricing:', err)
        return fail(c, t('api.failedToFetchVolumePricing'), 500)
    }
}

export default getVolumePricing