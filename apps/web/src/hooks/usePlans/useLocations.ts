import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib'
import LOCATIONS_QUERY_KEY from '@/hooks/usePlans/LOCATIONS_QUERY_KEY'

const useLocations = (provider?: string) => {
    return useQuery({
        queryKey: [...LOCATIONS_QUERY_KEY, provider || 'hetzner'],
        queryFn: () => api.getLocations(provider),
        staleTime: 10_000,
        refetchInterval: 10_000,
        retry: false
    })
}

export default useLocations