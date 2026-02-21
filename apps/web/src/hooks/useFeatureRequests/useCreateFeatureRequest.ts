import type { CreateFeatureRequestData } from '@/ts/Interfaces'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import FEATURE_REQUESTS_QUERY_KEY from '@/hooks/useFeatureRequests/FEATURE_REQUESTS_QUERY_KEY'

const useCreateFeatureRequest = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateFeatureRequestData) =>
            api.createFeatureRequest(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [...FEATURE_REQUESTS_QUERY_KEY]
            })
        }
    })
}

export default useCreateFeatureRequest