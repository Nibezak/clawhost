import type { FirebaseUser } from '@/ts/Interfaces'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

const PROFILE_QUERY_KEY = ['profile'] as const

const useProfile = (user: FirebaseUser | null) => {
    return useQuery({
        queryKey: PROFILE_QUERY_KEY,
        queryFn: () => api.getProfile(),
        enabled: !!user,
        staleTime: Infinity
    })
}

export default useProfile
export { PROFILE_QUERY_KEY }