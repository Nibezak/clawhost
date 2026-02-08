import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import SSH_KEYS_QUERY_KEY from '@/hooks/useSSHKeys/SSH_KEYS_QUERY_KEY'
import USER_STATS_QUERY_KEY from '@/hooks/useUser/USER_STATS_QUERY_KEY'

const useDeleteSSHKey = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.deleteSSHKey(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SSH_KEYS_QUERY_KEY })
            queryClient.invalidateQueries({ queryKey: USER_STATS_QUERY_KEY })
        }
    })
}

export default useDeleteSSHKey