import type { FeatureRequestSortBy } from '@/ts/Types'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { useAuth } from '@/lib/auth'
import FEATURE_REQUESTS_QUERY_KEY from '@/hooks/useFeatureRequests/FEATURE_REQUESTS_QUERY_KEY'

const useFeatureRequests = (sort?: FeatureRequestSortBy) => {
    const { user } = useAuth()

    return useQuery({
        queryKey: [...FEATURE_REQUESTS_QUERY_KEY, sort ?? 'upvotes'],
        queryFn: () =>
            user
                ? api.getFeatureRequests(sort)
                : api.getFeatureRequestsPublic(sort),
        placeholderData: (previousData) => previousData,
        refetchInterval: 30000
    })
}

export default useFeatureRequests