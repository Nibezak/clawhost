import type { UpdateClawConfigParams } from '@/ts/Interfaces'

import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

const useUpdateClawConfig = () => {
    return useMutation({
        mutationFn: ({ id, data }: UpdateClawConfigParams) =>
            api.updateClawConfig(id, data)
    })
}

export default useUpdateClawConfig