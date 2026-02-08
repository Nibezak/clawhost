import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import PLANS_QUERY_KEY from '@/hooks/usePlans/PLANS_QUERY_KEY'

const usePlans = () => {
    return useQuery({
        queryKey: PLANS_QUERY_KEY,
        queryFn: api.getPlans,
        staleTime: Infinity
    })
}

export default usePlans