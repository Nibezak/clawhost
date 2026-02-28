import type { CacheEntry, ServerStatus } from '@/ts/Interfaces'
import type { ProviderType } from '@/ts/Types'

import { cache } from '@/services/provider/getProvider'

const updateCachedServerStatus = (provider: ProviderType, serverId: string, status: string) => {
    const serversEntry = cache.get(`${provider}:servers`) as CacheEntry<Map<string, ServerStatus>> | undefined
    if (serversEntry?.data) {
        const server = serversEntry.data.get(serverId)
        if (server) {
            server.status = status
        }
    }

    const serverEntry = cache.get(`${provider}:server:${serverId}`) as CacheEntry<ServerStatus> | undefined
    if (serverEntry?.data) {
        serverEntry.data.status = status
    }
}

export default updateCachedServerStatus