import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib'

const useClawDiagnostics = (clawId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['claw-diagnostics', clawId],
        queryFn: () => api.getClawDiagnostics(clawId),
        enabled,
        refetchInterval: 3000,
        gcTime: 0
    })
}

export default useClawDiagnostics