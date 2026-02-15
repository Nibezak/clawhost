import type { SSHKey, CreateSSHKeyData } from '@/ts/Interfaces'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib'
import SSH_KEYS_QUERY_KEY from '@/hooks/useSSHKeys/SSH_KEYS_QUERY_KEY'
import USER_STATS_QUERY_KEY from '@/hooks/useUser/USER_STATS_QUERY_KEY'

const useCreateSSHKey = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateSSHKeyData) => api.createSSHKey(data),
        onSuccess: (newKey) => {
            queryClient.setQueryData<SSHKey[]>(SSH_KEYS_QUERY_KEY, (old) =>
                old ? [...old, newKey] : [newKey]
            )
            queryClient.invalidateQueries({ queryKey: USER_STATS_QUERY_KEY })
        }
    })
}

export default useCreateSSHKey