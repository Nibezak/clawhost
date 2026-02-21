import type { UpdateFeatureRequestStatusData } from '@/ts/Interfaces'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import FEATURE_REQUESTS_QUERY_KEY from '@/hooks/useFeatureRequests/FEATURE_REQUESTS_QUERY_KEY'

const useUpdateFeatureRequestStatus = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data
        }: {
            id: string
            data: UpdateFeatureRequestStatusData
        }) => api.updateFeatureRequestStatus(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [...FEATURE_REQUESTS_QUERY_KEY]
            })
        }
    })
}

export default useUpdateFeatureRequestStatus