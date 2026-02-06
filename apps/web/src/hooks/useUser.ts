import type { UpdateProfileData } from '@/ts/Interfaces'
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const PROFILE_QUERY_KEY = ['profile'] as const
export const USER_STATS_QUERY_KEY = ['userStats'] as const
export const BILLING_HISTORY_QUERY_KEY = ['billingHistory'] as const

export function useProfile(options?: { enabled?: boolean; staleTime?: number }) {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: api.getProfile,
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? Infinity,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileData) => api.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
    },
  })
}

export function useUserStats() {
  return useQuery({
    queryKey: USER_STATS_QUERY_KEY,
    queryFn: api.getUserStats,
    staleTime: Infinity,
  })
}

export function useBillingHistory(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...BILLING_HISTORY_QUERY_KEY, page, limit],
    queryFn: () => api.getBillingHistory(page, limit),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
}
