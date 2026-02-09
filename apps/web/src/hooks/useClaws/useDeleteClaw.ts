import type { Claw } from '@/ts/Interfaces'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import CLAWS_QUERY_KEY from '@/hooks/useClaws/CLAWS_QUERY_KEY'
import USER_STATS_QUERY_KEY from '@/hooks/useUser/USER_STATS_QUERY_KEY'

const useDeleteClaw = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.deleteClaw(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: CLAWS_QUERY_KEY })
            const previousClaws =
                queryClient.getQueryData<Claw[]>(CLAWS_QUERY_KEY)
            queryClient.setQueryData<Claw[]>(CLAWS_QUERY_KEY, (old) =>
                old?.map((c) =>
                    c.id === id
                        ? {
                              ...c,
                              deletionScheduledAt: new Date().toISOString()
                          }
                        : c
                )
            )
            return { previousClaws }
        },
        onSuccess: (response, id) => {
            if (response.claw) {
                queryClient.setQueryData<Claw[]>(CLAWS_QUERY_KEY, (old) =>
                    old?.map((c) =>
                        c.id === id ? { ...c, ...response.claw } : c
                    )
                )
            }
        },
        onError: (_err, _id, context) => {
            if (context?.previousClaws) {
                queryClient.setQueryData(CLAWS_QUERY_KEY, context.previousClaws)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: CLAWS_QUERY_KEY })
            queryClient.invalidateQueries({ queryKey: USER_STATS_QUERY_KEY })
        }
    })
}

export default useDeleteClaw