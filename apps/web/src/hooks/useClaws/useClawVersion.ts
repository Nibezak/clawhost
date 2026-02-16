import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib'

const useClawVersion = (clawId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['claw-version', clawId],
        queryFn: () => api.getClawVersion(clawId),
        enabled,
        staleTime: 60000,
        gcTime: 0,
        retry: 1
    })
}

export default useClawVersion