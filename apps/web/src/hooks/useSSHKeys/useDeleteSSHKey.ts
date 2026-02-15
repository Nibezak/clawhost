import type { SSHKey } from '@/ts/Interfaces'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import SSH_KEYS_QUERY_KEY from '@/hooks/useSSHKeys/SSH_KEYS_QUERY_KEY'
import USER_STATS_QUERY_KEY from '@/hooks/useUser/USER_STATS_QUERY_KEY'

const useDeleteSSHKey = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.deleteSSHKey(id),
        onSuccess: (_response, id) => {
            queryClient.setQueryData<SSHKey[]>(SSH_KEYS_QUERY_KEY, (old) =>
                old?.filter((k) => k.id !== id)
            )
            queryClient.invalidateQueries({ queryKey: USER_STATS_QUERY_KEY })
        }
    })
}

export default useDeleteSSHKey