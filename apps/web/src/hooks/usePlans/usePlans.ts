import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import PLANS_QUERY_KEY from '@/hooks/usePlans/PLANS_QUERY_KEY'

const usePlans = (provider?: string) => {
    return useQuery({
        queryKey: [...PLANS_QUERY_KEY, provider || 'hetzner'],
        queryFn: () => api.getPlans(provider),
        staleTime: Infinity
    })
}

export default usePlans