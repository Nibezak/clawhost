import type {
    EditFeatureRequestData,
    FeatureRequestsListResponse
} from '@/ts/Interfaces'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import FEATURE_REQUESTS_QUERY_KEY from '@/hooks/useFeatureRequests/FEATURE_REQUESTS_QUERY_KEY'
import sortFeatureRequests from '@/hooks/useFeatureRequests/sortFeatureRequests'

const useEditFeatureRequest = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data
        }: {
            id: string
            data: EditFeatureRequestData
        }) => api.editFeatureRequest(id, data),
        onSuccess: (_result, { id, data }) => {
            const queries =
                queryClient.getQueriesData<FeatureRequestsListResponse>({
                    queryKey: [...FEATURE_REQUESTS_QUERY_KEY]
                })

            queries.forEach(([queryKey, cached]) => {
                if (!cached) return
                const sort = (queryKey[1] as string) ?? 'upvotes'
                queryClient.setQueryData<FeatureRequestsListResponse>(
                    queryKey,
                    {
                        ...cached,
                        items: sortFeatureRequests(
                            cached.items.map((item) =>
                                item.id === id
                                    ? { ...item, ...data }
                                    : item
                            ),
                            sort
                        )
                    }
                )
            })

            queryClient.invalidateQueries({
                queryKey: [...FEATURE_REQUESTS_QUERY_KEY]
            })
        }
    })
}

export default useEditFeatureRequest