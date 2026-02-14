import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import PLAYGROUND_AGENTS_QUERY_KEY from '@/hooks/usePlayground/PLAYGROUND_AGENTS_QUERY_KEY'

const useClawAgents = (clawId: string, enabled: boolean) => {
    return useQuery({
        queryKey: [PLAYGROUND_AGENTS_QUERY_KEY, clawId],
        queryFn: () => api.getClawAgents(clawId),
        enabled,
        staleTime: 30000,
        gcTime: 60000,
        refetchInterval: 30000,
        retry: 0
    })
}

export default useClawAgents