import type { Claw, RenameClawData } from '@/ts/Interfaces'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib'
import CLAWS_QUERY_KEY from '@/hooks/useClaws/CLAWS_QUERY_KEY'
import ADMIN_CLAWS_QUERY_KEY from '@/hooks/useClaws/ADMIN_CLAWS_QUERY_KEY'

const useRenameClaw = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, name }: { id: string } & RenameClawData) =>
            api.renameClaw(id, { name }),
        onSuccess: (updatedClaw, { id }) => {
            queryClient.setQueryData<Claw[]>(CLAWS_QUERY_KEY, (old) =>
                old?.map((c) => (c.id === id ? { ...c, ...updatedClaw } : c))
            )
            queryClient.setQueryData<Claw[]>(ADMIN_CLAWS_QUERY_KEY, (old) =>
                old?.map((c) => (c.id === id ? { ...c, ...updatedClaw } : c))
            )
        }
    })
}

export default useRenameClaw