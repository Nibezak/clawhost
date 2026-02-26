import type { FeatureRequestsListResponse } from '@/ts/Interfaces'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import FEATURE_REQUESTS_QUERY_KEY from '@/hooks/useFeatureRequests/FEATURE_REQUESTS_QUERY_KEY'

const useDeleteFeatureRequest = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.deleteFeatureRequest(id),
        onSuccess: (_data, id) => {
            const queries =
                queryClient.getQueriesData<FeatureRequestsListResponse>({
                    queryKey: [...FEATURE_REQUESTS_QUERY_KEY]
                })

            queries.forEach(([queryKey, data]) => {
                if (!data) return
                queryClient.setQueryData<FeatureRequestsListResponse>(
                    queryKey,
                    {
                        ...data,
                        items: data.items.filter((item) => item.id !== id),
                        total: Math.max(data.total - 1, 0)
                    }
                )
            })
        }
    })
}

export default useDeleteFeatureRequest