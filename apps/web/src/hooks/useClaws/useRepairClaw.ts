import type { Claw } from '@/ts/Interfaces'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import CLAWS_QUERY_KEY from '@/hooks/useClaws/CLAWS_QUERY_KEY'
import ADMIN_CLAWS_QUERY_KEY from '@/hooks/useClaws/ADMIN_CLAWS_QUERY_KEY'

const useRepairClaw = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.repairClaw(id),
        onSuccess: (data, id) => {
            if (data.success) {
                queryClient.setQueryData<Claw[]>(CLAWS_QUERY_KEY, (old) =>
                    old?.map((c) =>
                        c.id === id ? { ...c, status: 'running' as const } : c
                    )
                )
                queryClient.setQueryData<Claw[]>(ADMIN_CLAWS_QUERY_KEY, (old) =>
                    old?.map((c) =>
                        c.id === id ? { ...c, status: 'running' as const } : c
                    )
                )
            }
        }
    })
}

export default useRepairClaw