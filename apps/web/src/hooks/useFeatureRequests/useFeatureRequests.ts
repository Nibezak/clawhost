import type { FeatureRequestSortBy } from '@/ts/Types'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { useAuth } from '@/lib/auth'
import FEATURE_REQUESTS_QUERY_KEY from '@/hooks/useFeatureRequests/FEATURE_REQUESTS_QUERY_KEY'

const useFeatureRequests = (sort?: FeatureRequestSortBy) => {
    const { user, loading } = useAuth()

    return useQuery({
        queryKey: [...FEATURE_REQUESTS_QUERY_KEY, sort ?? 'upvotes', !!user],
        queryFn: () =>
            user
                ? api.getFeatureRequests(sort)
                : api.getFeatureRequestsPublic(sort),
        enabled: !loading,
        refetchInterval: 30000,
        gcTime: 0
    })
}

export default useFeatureRequests