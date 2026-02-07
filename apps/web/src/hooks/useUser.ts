import type { UpdateProfileData } from '@/ts/Interfaces'
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

export function useBillingHistory(limit: number = 10) {
  return useInfiniteQuery({
    queryKey: [...BILLING_HISTORY_QUERY_KEY, limit],
    queryFn: ({ pageParam }) => api.getBillingHistory(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 5 * 60 * 1000,
  })
}
