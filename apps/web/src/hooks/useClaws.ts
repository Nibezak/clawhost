import type { Claw, CreateClawData } from '@/ts/Interfaces'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const CLAWS_QUERY_KEY = ['claws'] as const

export function useClaws(options?: { sync?: boolean; refetchInterval?: number | false }) {
  const queryClient = useQueryClient()

  // Check if any claws are in transitional states (need syncing)
  const cachedClaws = queryClient.getQueryData<Claw[]>(CLAWS_QUERY_KEY)
  const hasTransitionalClaws = cachedClaws?.some((c) =>
    ['initializing', 'starting', 'stopping', 'creating', 'migrating', 'rebuilding'].includes(
      c.status
    )
  )

  const shouldSync = options?.sync ?? hasTransitionalClaws
  const refetchInterval = options?.refetchInterval ?? (hasTransitionalClaws ? 5000 : false)

  return useQuery({
    queryKey: CLAWS_QUERY_KEY,
    queryFn: () => api.getClaws(shouldSync),
    placeholderData: (previousData) => previousData,
    refetchInterval,
  })
}

export function useClaw(id: string, options?: { sync?: boolean }) {
  return useQuery({
    queryKey: ['claw', id],
    queryFn: () => api.getClaw(id, options?.sync),
    enabled: !!id,
  })
}

export function useCreateClaw() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateClawData) => api.createClaw(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLAWS_QUERY_KEY })
    },
  })
}

export function useStartClaw() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.startClaw(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLAWS_QUERY_KEY })
    },
  })
}

export function useStopClaw() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.stopClaw(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLAWS_QUERY_KEY })
    },
  })
}

export function useRestartClaw() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.restartClaw(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLAWS_QUERY_KEY })
    },
  })
}

export function useDeleteClaw() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteClaw(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLAWS_QUERY_KEY })
    },
  })
}

export function useSyncClaw() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.syncClaw(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLAWS_QUERY_KEY })
    },
  })
}
