import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import FEATURE_REQUESTS_QUERY_KEY from '@/hooks/useFeatureRequests/FEATURE_REQUESTS_QUERY_KEY'

const useDeleteFeatureRequest = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.deleteFeatureRequest(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [...FEATURE_REQUESTS_QUERY_KEY]
            })
        }
    })
}

export default useDeleteFeatureRequest