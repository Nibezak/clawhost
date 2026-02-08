import type { Claw, CreateClawData, PurchaseClawData } from '@/ts/Interfaces'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { USER_STATS_QUERY_KEY } from './useUser'

export const CLAWS_QUERY_KEY = ['claws'] as const

export function useClaws(options?: { refetchInterval?: number | false }) {
    const queryClient = useQueryClient()

    // Poll faster when claws are in transitional states
    const cachedClaws = queryClient.getQueryData<Claw[]>(CLAWS_QUERY_KEY)
    const hasTransitionalClaws = cachedClaws?.some((c) =>
        [
            'initializing',
            'starting',
            'stopping',
            'creating',
            'migrating',
            'rebuilding'
        ].includes(c.status)
    )

    const refetchInterval =
        options?.refetchInterval ?? (hasTransitionalClaws ? 5000 : false)

    return useQuery({
        queryKey: CLAWS_QUERY_KEY,
        queryFn: () => api.getClaws(),
        placeholderData: (previousData) => previousData,
        staleTime: Infinity,
        refetchInterval
    })
}

export function useClaw(id: string, options?: { sync?: boolean }) {
    return useQuery({
        queryKey: ['claw', id],
        queryFn: () => api.getClaw(id, options?.sync),
        enabled: !!id
    })
}

export function useCreateClaw() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateClawData) => api.createClaw(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CLAWS_QUERY_KEY })
            queryClient.invalidateQueries({ queryKey: USER_STATS_QUERY_KEY })
        }
    })
}

export function usePurchaseClaw() {
    return useMutation({
        mutationFn: (data: PurchaseClawData) => api.purchaseClaw(data)
        // No cache invalidation here - user will be redirected to checkout
    })
}

export function useStartClaw() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.startClaw(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CLAWS_QUERY_KEY })
        }
    })
}

export function useStopClaw() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.stopClaw(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CLAWS_QUERY_KEY })
        }
    })
}

export function useRestartClaw() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.restartClaw(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CLAWS_QUERY_KEY })
        }
    })
}

export function useDeleteClaw() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.deleteClaw(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CLAWS_QUERY_KEY })
            queryClient.invalidateQueries({ queryKey: USER_STATS_QUERY_KEY })
        }
    })
}

export function useCancelDeletion() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.cancelDeletion(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CLAWS_QUERY_KEY })
        }
    })
}

export function useSyncClaw() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.syncClaw(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CLAWS_QUERY_KEY })
        }
    })
}