import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

const useClawConfig = (clawId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['claw-config', clawId],
        queryFn: () => api.getClawConfig(clawId),
        enabled,
        gcTime: 0
    })
}

export default useClawConfig