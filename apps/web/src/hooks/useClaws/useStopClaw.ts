import type { Claw } from '@/ts/Interfaces'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import CLAWS_QUERY_KEY from '@/hooks/useClaws/CLAWS_QUERY_KEY'

const useStopClaw = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.stopClaw(id),
        onSuccess: (updatedClaw, id) => {
            queryClient.setQueryData<Claw[]>(CLAWS_QUERY_KEY, (old) =>
                old?.map((c) => (c.id === id ? { ...c, ...updatedClaw } : c))
            )
        }
    })
}

export default useStopClaw