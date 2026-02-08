import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import CLAWS_QUERY_KEY from '@/hooks/useClaws/CLAWS_QUERY_KEY'

const useHardDeleteClaw = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.hardDeleteClaw(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CLAWS_QUERY_KEY })
        }
    })
}

export default useHardDeleteClaw