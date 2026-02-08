import type { CreateSSHKeyData } from '@/ts/Interfaces'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { USER_STATS_QUERY_KEY } from './useUser'

export const SSH_KEYS_QUERY_KEY = ['sshKeys'] as const

export function useSSHKeys() {
    return useQuery({
        queryKey: SSH_KEYS_QUERY_KEY,
        queryFn: api.getSSHKeys,
        placeholderData: (previousData) => previousData,
        staleTime: Infinity
    })
}

export function useCreateSSHKey() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateSSHKeyData) => api.createSSHKey(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SSH_KEYS_QUERY_KEY })
            queryClient.invalidateQueries({ queryKey: USER_STATS_QUERY_KEY })
        }
    })
}

export function useDeleteSSHKey() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.deleteSSHKey(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SSH_KEYS_QUERY_KEY })
            queryClient.invalidateQueries({ queryKey: USER_STATS_QUERY_KEY })
        }
    })
}