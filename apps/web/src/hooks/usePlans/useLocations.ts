import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import LOCATIONS_QUERY_KEY from '@/hooks/usePlans/LOCATIONS_QUERY_KEY'

const useLocations = (provider?: string) => {
    return useQuery({
        queryKey: [...LOCATIONS_QUERY_KEY, provider || 'hetzner'],
        queryFn: () => api.getLocations(provider),
        staleTime: Infinity
    })
}

export default useLocations