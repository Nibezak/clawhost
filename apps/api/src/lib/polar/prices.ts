import type {
    CacheEntry,
    PolarItemsResult,
    PolarProductMapping,
    PolarProductRaw
} from '@/ts/Interfaces'
import type { PolarPriceMap } from '@/ts/Types'

import getPolarClient from '@/lib/polar/getPolarClient'
import getPolarConfig from '@/lib/polar/getPolarConfig'

const PRICE_CACHE_TTL = 60 * 60 * 1000

let priceCache: CacheEntry<PolarPriceMap> | null = null

const KNOWN_PROVIDERS = ['digitalocean', 'vultr']

const parseEnvVarMapping = (): Map<string, PolarProductMapping> => {
    const mapping = new Map<string, PolarProductMapping>()

    for (const [key, value] of Object.entries(process.env)) {
        if (!key.startsWith('POLAR_PRODUCT_') || !value?.trim()) continue

        const suffix = key.slice('POLAR_PRODUCT_'.length).toLowerCase()
        const productId = value.trim()

        let provider = 'hetzner'
        let planSlug = suffix

        for (const p of KNOWN_PROVIDERS) {
            if (suffix.startsWith(`${p}_`)) {
                provider = p
                planSlug = suffix.slice(p.length + 1)
                break
            }
        }

        const planId = planSlug.replace(/_/g, '-')
        mapping.set(productId, { provider, planId })
    }

    return mapping
}

const fetchPricesFromPolar = async (): Promise<PolarPriceMap> => {
    const polar = getPolarClient()
    const config = getPolarConfig()
    const envMapping = parseEnvVarMapping()

    const allItems: PolarProductRaw[] = []
    let page = 1

    while (true) {
        const result = await polar.products.list({
            organizationId: config.organizationId,
            page,
            limit: 100
        })

        const batch =
            'result' in result
                ? (result.result as PolarItemsResult)
                : (result as unknown as PolarItemsResult)

        const items = (batch.items || []) as PolarProductRaw[]
        if (items.length === 0) break
        allItems.push(...items)
        page++
    }

    const priceMap: PolarPriceMap = {}

    for (const product of allItems) {
        if (product.isArchived) continue

        const mapping = envMapping.get(product.id)
        if (!mapping) continue

        const price = product.prices?.[0]
        if (!price) continue

        if (!priceMap[mapping.provider]) {
            priceMap[mapping.provider] = {}
        }

        priceMap[mapping.provider][mapping.planId] = price.priceAmount / 100
    }

    return priceMap
}

const getPlanPrices = async (): Promise<PolarPriceMap> => {
    if (priceCache && Date.now() < priceCache.expiry) {
        return priceCache.data
    }

    const prices = await fetchPricesFromPolar()
    priceCache = { data: prices, expiry: Date.now() + PRICE_CACHE_TTL }
    return prices
}

export default getPlanPrices