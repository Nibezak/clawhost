import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib'

const useClawLogs = (clawId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['claw-logs', clawId],
        queryFn: () => api.getClawLogs(clawId),
        enabled,
        refetchInterval: 3000,
        gcTime: 0
    })
}

export default useClawLogs