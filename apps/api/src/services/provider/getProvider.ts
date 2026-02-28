import type { CloudProvider } from '@/ts/Interfaces'
import type { ProviderType } from '@/ts/Types'

import hetzner from '@/services/hetzner'
import digitalocean from '@/services/digitalocean'
import vultr from '@/services/vultr'
import cache from '@/services/provider/cache'

const CACHE_TTL = 5 * 60 * 1000
const SERVERS_CACHE_TTL = 10 * 1000

const cached = <T>(
    key: string,
    fn: () => Promise<T>,
    ttl = CACHE_TTL
): Promise<T> => {
    const entry = cache.get(key)
    if (entry && Date.now() < entry.expiry)
        return Promise.resolve(entry.data as T)
    return fn().then((data) => {
        cache.set(key, { data, expiry: Date.now() + ttl })
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
        getServer: (serverId: string) =>
            cached(
                `${provider}:server:${serverId}`,
                () => p.getServer(serverId),
                SERVERS_CACHE_TTL
            ),
        getServers: () =>
            cached(
                `${provider}:servers`,
                () => p.getServers(),
                SERVERS_CACHE_TTL
            ),
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