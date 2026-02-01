import type { CreateSSHKeyData, SSHKey } from '@/ts/Interfaces'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const SSH_KEYS_QUERY_KEY = ['sshKeys'] as const

export function useSSHKeys() {
  const queryClient = useQueryClient()
  const cachedKeys = queryClient.getQueryData<SSHKey[]>(SSH_KEYS_QUERY_KEY)

  return {
    ...useQuery({
      queryKey: SSH_KEYS_QUERY_KEY,
      queryFn: api.getSSHKeys,
      placeholderData: (previousData) => previousData,
    }),
    cachedCount: cachedKeys?.length ?? 0,
  }
}

export function useCreateSSHKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSSHKeyData) => api.createSSHKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SSH_KEYS_QUERY_KEY })
    },
  })
}

export function useDeleteSSHKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteSSHKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SSH_KEYS_QUERY_KEY })
    },
  })
}
