import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

const useClawFile = (clawId: string, path: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['claw-file', clawId, path],
        queryFn: () => api.readClawFile(clawId, path),
        enabled: enabled && path.length > 0,
        gcTime: 0
    })
}

export default useClawFile