import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

const useClawFiles = (clawId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['claw-files', clawId],
        queryFn: () => api.listClawFiles(clawId),
        enabled,
        gcTime: 0
    })
}

export default useClawFiles