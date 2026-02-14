import type { UseProfileOptions } from '@/ts/Interfaces'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import PROFILE_QUERY_KEY from '@/hooks/useUser/PROFILE_QUERY_KEY'

const useProfile = (options?: UseProfileOptions) => {
    return useQuery({
        queryKey: PROFILE_QUERY_KEY,
        queryFn: api.getProfile,
        enabled: options?.enabled ?? true,
        staleTime: options?.staleTime ?? Infinity
    })
}

export default useProfile