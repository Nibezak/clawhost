import type {
    CreateFeatureRequestData,
    FeatureRequest,
    FeatureRequestsListResponse
} from '@/ts/Interfaces'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import FEATURE_REQUESTS_QUERY_KEY from '@/hooks/useFeatureRequests/FEATURE_REQUESTS_QUERY_KEY'
import sortFeatureRequests from '@/hooks/useFeatureRequests/sortFeatureRequests'

const useCreateFeatureRequest = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateFeatureRequestData) =>
            api.createFeatureRequest(data),
        onSuccess: (newItem: FeatureRequest) => {
            const queries =
                queryClient.getQueriesData<FeatureRequestsListResponse>({
                    queryKey: [...FEATURE_REQUESTS_QUERY_KEY]
                })

            queries.forEach(([queryKey, data]) => {
                if (!data) return
                if (data.items.some((i) => i.id === newItem.id)) return
                const sort = (queryKey[1] as string) ?? 'upvotes'
                queryClient.setQueryData<FeatureRequestsListResponse>(
                    queryKey,
                    {
                        ...data,
                        items: sortFeatureRequests(
                            [newItem, ...data.items],
                            sort
                        ),
                        total: data.total + 1
                    }
                )
            })

            queryClient.invalidateQueries({
                queryKey: [...FEATURE_REQUESTS_QUERY_KEY]
            })
        }
    })
}

export default useCreateFeatureRequest