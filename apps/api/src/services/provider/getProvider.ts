import type { CacheEntry, CloudProvider } from '@/ts/Interfaces'
import type { ProviderType } from '@/ts/Types'

import hetzner from '@/services/hetzner'
import digitalocean from '@/services/digitalocean'
import vultr from '@/services/vultr'

const CACHE_TTL = 5 * 60 * 1000

const cache = new Map<string, CacheEntry<unknown>>()

const cached = <T>(key: string, fn: () => Promise<T>): Promise<T> => {
    const entry = cache.get(key)
    if (entry && Date.now() < entry.expiry)
        return Promise.resolve(entry.data as T)
    return fn().then((data) => {
        cache.set(key, { data, expiry: Date.now() + CACHE_TTL })
        return data
    })
}

const providers: Record<ProviderType, CloudProvider> = {
    hetzner,
    digitalocean,
    vultr
}

const wrappedProviders = new Map<ProviderType, CloudProvider>()

const getProvider = (provider: ProviderType): CloudProvider => {
    const p = providers[provider]
    if (!p) {
        throw new Error(`Unknown provider: ${provider}`)
    }

    const existing = wrappedProviders.get(provider)
    if (existing) return existing

    const wrapped: CloudProvider = {
        ...p,
        getServerTypes: () =>
            cached(`${provider}:serverTypes`, () => p.getServerTypes()),
        getLocations: () =>
            cached(`${provider}:locations`, () => p.getLocations()),
        getRawServerTypes: () =>
            cached(`${provider}:rawServerTypes`, () => p.getRawServerTypes()),
        getDatacenters: () =>
            cached(`${provider}:datacenters`, () => p.getDatacenters()),
        getVolumePricing: () =>
            cached(`${provider}:volumePricing`, () => p.getVolumePricing())
    }

    wrappedProviders.set(provider, wrapped)
    return wrapped
}

export default getProvider