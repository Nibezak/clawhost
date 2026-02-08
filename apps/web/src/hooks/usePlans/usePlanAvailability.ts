import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import PLAN_AVAILABILITY_QUERY_KEY from '@/hooks/usePlans/PLAN_AVAILABILITY_QUERY_KEY'

const usePlanAvailability = () => {
    return useQuery({
        queryKey: PLAN_AVAILABILITY_QUERY_KEY,
        queryFn: api.getPlanAvailability,
        staleTime: Infinity
    })
}

export default usePlanAvailability