import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import CLAWS_QUERY_KEY from '@/hooks/useClaws/CLAWS_QUERY_KEY'
import ADMIN_CLAWS_QUERY_KEY from '@/hooks/useClaws/ADMIN_CLAWS_QUERY_KEY'

const useSyncClaw = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.syncClaw(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CLAWS_QUERY_KEY })
            queryClient.invalidateQueries({ queryKey: ADMIN_CLAWS_QUERY_KEY })
        }
    })
}

export default useSyncClaw