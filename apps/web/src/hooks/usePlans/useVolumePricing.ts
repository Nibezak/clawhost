import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import VOLUME_PRICING_QUERY_KEY from '@/hooks/usePlans/VOLUME_PRICING_QUERY_KEY'

const useVolumePricing = (provider?: string) => {
    return useQuery({
        queryKey: [...VOLUME_PRICING_QUERY_KEY, provider || 'hetzner'],
        queryFn: () => api.getVolumePricing(provider),
        staleTime: Infinity
    })
}

export default useVolumePricing