import type { Context } from 'hono'
import type { ProviderType } from '@/ts/Types'

import { getProvider } from '@/services/provider'
import { t } from '@openclaw/i18n'

const hetznerPlanOrder = [
    'cx23',
    'cx33',
    'cx43',
    'cx53',
    'cpx11',
    'cpx21',
    'cpx31',
    'cpx41',
    'cpx51',
    'cax11',
    'cax21',
    'cax31',
    'cax41',
    'ccx13',
    'ccx23',
    'ccx33',
    'ccx43',
    'ccx53',
    'ccx63'
]

const digitaloceanPlanOrder = [
    's-1vcpu-512mb-10gb',
    's-1vcpu-1gb',
    's-1vcpu-2gb',
    's-2vcpu-2gb',
    's-2vcpu-4gb',
    's-4vcpu-8gb',
    's-8vcpu-16gb'
]

const hetznerCustomPrices: Record<string, number> = {
    cx23: 10,
    cx33: 15,
    cx43: 20,
    cx53: 30,
    cpx11: 15,
    cpx21: 20,
    cpx31: 30,
    cpx41: 50,
    cpx51: 75,
    cax11: 10,
    cax21: 15,
    cax31: 25,
    cax41: 50,
    ccx13: 25,
    ccx23: 50,
    ccx33: 100,
    ccx43: 150,
    ccx53: 250,
    ccx63: 350
}

const digitaloceanCustomPrices: Record<string, number> = {
    's-1vcpu-512mb-10gb': 10,
    's-1vcpu-1gb': 15,
    's-1vcpu-2gb': 20,
    's-2vcpu-2gb': 30,
    's-2vcpu-4gb': 50,
    's-4vcpu-8gb': 75,
    's-8vcpu-16gb': 150
}

const disabledPlans = new Set([
    's-1vcpu-512mb-10gb',
    's-1vcpu-1gb'
])

const planConfigs: Record<
    ProviderType,
    { order: string[]; prices: Record<string, number> }
> = {
    hetzner: { order: hetznerPlanOrder, prices: hetznerCustomPrices },
    digitalocean: {
        order: digitaloceanPlanOrder,
        prices: digitaloceanCustomPrices
    }
}

const getPlans = async (c: Context) => {
    try {
        const providerName = (c.req.query('provider') ||
            'hetzner') as ProviderType
        const config = planConfigs[providerName]

        if (!config) {
            return c.json({ error: t('api.invalidProvider') }, 400)
        }

        const provider = getProvider(providerName)
        const serverTypes = await provider.getServerTypes()

        const plans = serverTypes
            .filter((st) => config.prices[st.name] !== undefined)
            .map((st) => ({
                id: st.name,
                name: st.description,
                cpu: st.cores,
                memory: st.memory,
                disk: st.disk,
                priceMonthly: config.prices[st.name],
                architecture: st.architecture,
                disabled: disabledPlans.has(st.name)
            }))
            .sort(
                (a, b) =>
                    config.order.indexOf(a.id) - config.order.indexOf(b.id)
            )

        return c.json(plans)
    } catch (err) {
        console.error('Failed to fetch plans:', err)
        return c.json({ error: t('api.failedToFetchPlans') }, 500)
    }
}

export default getPlans