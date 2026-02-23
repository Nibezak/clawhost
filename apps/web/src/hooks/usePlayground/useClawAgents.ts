import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib'
import PLAYGROUND_AGENTS_QUERY_KEY from '@/hooks/usePlayground/PLAYGROUND_AGENTS_QUERY_KEY'

const useClawAgents = (clawId: string, enabled: boolean) => {
    return useQuery({
        queryKey: [PLAYGROUND_AGENTS_QUERY_KEY, clawId],
        queryFn: () => api.getClawAgents(clawId),
        enabled,
        staleTime: 3000,
        gcTime: 0,
        refetchInterval: 3000,
        retry: 0
    })
}

export default useClawAgents