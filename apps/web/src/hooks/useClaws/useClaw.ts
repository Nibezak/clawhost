import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

const useClaw = (id: string, options?: { sync?: boolean }) => {
    return useQuery({
        queryKey: ['claw', id],
        queryFn: () => api.getClaw(id, options?.sync),
        enabled: !!id
    })
}

export default useClaw