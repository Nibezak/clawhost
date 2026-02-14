import type { UpdateClawFileParams } from '@/ts/Interfaces'

import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'

const useUpdateClawFile = () => {
    return useMutation({
        mutationFn: ({ id, data }: UpdateClawFileParams) =>
            api.updateClawFile(id, data)
    })
}

export default useUpdateClawFile