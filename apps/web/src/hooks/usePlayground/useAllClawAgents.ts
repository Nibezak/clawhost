import type { Claw } from '@/ts/Interfaces'

import { useQueries } from '@tanstack/react-query'
import { clawStatus } from '@openclaw/shared'
import { api } from '@/lib'
import PLAYGROUND_AGENTS_QUERY_KEY from '@/hooks/usePlayground/PLAYGROUND_AGENTS_QUERY_KEY'

const useAllClawAgents = (claws: Claw[]) => {
    return useQueries({
        queries: claws.map((claw) => ({
            queryKey: [PLAYGROUND_AGENTS_QUERY_KEY, claw.id],
            queryFn: () => api.getClawAgents(claw.id),
            enabled: (claw.status === clawStatus.running || claw.status === clawStatus.unreachable) && !!claw.ip,
            staleTime: 30000,
            gcTime: 60000,
            refetchInterval: 30000,
            retry: 0
        }))
    })
}

export default useAllClawAgents