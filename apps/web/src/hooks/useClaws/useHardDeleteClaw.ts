import type { Claw } from '@/ts/Interfaces'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import CLAWS_QUERY_KEY from '@/hooks/useClaws/CLAWS_QUERY_KEY'

const useHardDeleteClaw = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.hardDeleteClaw(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: CLAWS_QUERY_KEY })
            const previousClaws =
                queryClient.getQueryData<Claw[]>(CLAWS_QUERY_KEY)
            queryClient.setQueryData<Claw[]>(CLAWS_QUERY_KEY, (old) =>
                old?.filter((c) => c.id !== id)
            )
            return { previousClaws }
        },
        onError: (_err, _id, context) => {
            if (context?.previousClaws) {
                queryClient.setQueryData(CLAWS_QUERY_KEY, context.previousClaws)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: CLAWS_QUERY_KEY })
        }
    })
}

export default useHardDeleteClaw