import type { FeatureRequestsListResponse } from '@/ts/Interfaces'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import FEATURE_REQUESTS_QUERY_KEY from '@/hooks/useFeatureRequests/FEATURE_REQUESTS_QUERY_KEY'

const useUpvoteFeatureRequest = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.upvoteFeatureRequest(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({
                queryKey: [...FEATURE_REQUESTS_QUERY_KEY]
            })

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
                        items: data.items.map((item) =>
                            item.id === id
                                ? {
                                      ...item,
                                      hasUpvoted: !item.hasUpvoted,
                                      upvoteCount: item.hasUpvoted
                                          ? item.upvoteCount - 1
                                          : item.upvoteCount + 1
                                  }
                                : item
                        )
                    }
                )
            })

            return { queries }
        },
        onError: (_err, _id, context) => {
            if (context?.queries) {
                context.queries.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data)
                })
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: [...FEATURE_REQUESTS_QUERY_KEY]
            })
        }
    })
}

export default useUpvoteFeatureRequest