import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib'
import PLAN_AVAILABILITY_QUERY_KEY from '@/hooks/usePlans/PLAN_AVAILABILITY_QUERY_KEY'

const usePlanAvailability = (provider?: string) => {
    return useQuery({
        queryKey: [...PLAN_AVAILABILITY_QUERY_KEY, provider || 'hetzner'],
        queryFn: () => api.getPlanAvailability(provider),
        staleTime: 10_000,
        refetchInterval: 10_000,
        retry: false
    })
}

export default usePlanAvailability