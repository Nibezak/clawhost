import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

const useClawDiagnostics = (clawId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['claw-diagnostics', clawId],
        queryFn: () => api.getClawDiagnostics(clawId),
        enabled,
        refetchInterval: 5000,
        gcTime: 0
    })
}

export default useClawDiagnostics