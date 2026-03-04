import type { Context } from 'hono'
import type { PlanOrder } from '@/ts/Interfaces'
import type { ProviderType } from '@/ts/Types'

import { getProvider } from '@/services/provider'
import { inputValidation } from '@openclaw/shared'
import { ok, fail } from '@/lib/response'
import { t } from '@openclaw/i18n'
import { getPlanPrices } from '@/lib/polar'

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

const vultrPlanOrder = [
    'vc2-1c-1gb',
    'vc2-1c-2gb',
    'vc2-2c-2gb',
    'vc2-2c-4gb',
    'vc2-4c-8gb',
    'vc2-6c-16gb',
    'vc2-8c-32gb',
    'vc2-16c-64gb',
    'vhp-1c-1gb-amd',
    'vhp-1c-2gb-amd',
    'vhp-2c-2gb-amd',
    'vhp-2c-4gb-amd',
    'vhp-4c-8gb-amd',
    'vhp-4c-12gb-amd',
    'vhp-8c-16gb-amd',
    'vhp-12c-24gb-amd',
    'vhf-1c-2gb',
    'vhf-2c-4gb',
    'vhf-3c-8gb',
    'vhf-4c-16gb',
    'vhf-8c-32gb',
    'vhf-12c-48gb'
]

const providerLimits: Partial<Record<ProviderType, number>> = {
    hetzner: 80
}

const planOrders: Record<ProviderType, PlanOrder> = {
    hetzner: { order: hetznerPlanOrder },
    digitalocean: { order: digitaloceanPlanOrder },
    vultr: { order: vultrPlanOrder }
}

const getPlans = async (c: Context) => {
    try {
        const providerName = (c.req.query('provider') ||
            'hetzner') as ProviderType
        const config = planOrders[providerName]

        if (!config) {
            return fail(c, t('api.invalidProvider'), 400)
        }

        const provider = getProvider(providerName)
        const limit = providerLimits[providerName]

        const [serverTypes, servers, priceMap] = await Promise.all([
            provider.getServerTypes(),
            limit
                ? provider.getServers().catch(() => null)
                : Promise.resolve(null),
            getPlanPrices()
        ])

        const atCapacity = servers && limit ? servers.size >= limit : false
        const prices = priceMap[providerName] ?? {}

        const plans = serverTypes
            .filter(
                (st) =>
                    prices[st.name] !== undefined &&
                    config.order.includes(st.name) &&
                    st.memory >= inputValidation.MIN_MEMORY_GB.MIN
            )
            .map((st) => ({
                id: st.name,
                name: st.description,
                cpu: st.cores,
                memory: st.memory,
                disk: st.disk,
                priceMonthly: prices[st.name],
                architecture: st.architecture,
                disabled: atCapacity
            }))
            .sort(
                (a, b) =>
                    config.order.indexOf(a.id) - config.order.indexOf(b.id)
            )

        return ok(c, { plans, atCapacity }, t('api.plansFetched'))
    } catch (err) {
        console.error('Failed to fetch plans:', err)
        return fail(c, t('api.failedToFetchPlans'), 500)
    }
}

export default getPlans