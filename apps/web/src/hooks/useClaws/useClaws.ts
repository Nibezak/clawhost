import type { Claw } from '@/ts/Interfaces'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import CLAWS_QUERY_KEY from '@/hooks/useClaws/CLAWS_QUERY_KEY'

const useClaws = (options?: { refetchInterval?: number | false }) => {
    const queryClient = useQueryClient()

    const cachedClaws = queryClient.getQueryData<Claw[]>(CLAWS_QUERY_KEY)
    const hasTransitionalClaws = cachedClaws?.some((c) =>
        [
            'initializing',
            'starting',
            'stopping',
            'creating',
            'configuring',
            'migrating',
            'rebuilding',
            'restarting'
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

export default useClaws