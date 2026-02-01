import type { UpdateProfileData } from '@/ts/Interfaces'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const PROFILE_QUERY_KEY = ['profile'] as const
export const USER_STATS_QUERY_KEY = ['userStats'] as const

export function useProfile(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: api.getProfile,
    enabled: options?.enabled ?? true,
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
  })
}
