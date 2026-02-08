import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import CLAWS_QUERY_KEY from '@/hooks/useClaws/CLAWS_QUERY_KEY'
import USER_STATS_QUERY_KEY from '@/hooks/useUser/USER_STATS_QUERY_KEY'

const useDeleteClaw = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.deleteClaw(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CLAWS_QUERY_KEY })
            queryClient.invalidateQueries({ queryKey: USER_STATS_QUERY_KEY })
        }
    })
}

export default useDeleteClaw