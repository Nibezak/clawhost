import type { GatewayConnectionState } from '@/ts/Types'

import { useState, useEffect } from 'react'
import { SharedGateway } from '@/lib/gateway'

const useGatewayState = (
    subdomain: string | null,
    gatewayToken: string | null
): GatewayConnectionState => {
    const [state, setState] = useState<GatewayConnectionState>('disconnected')

    useEffect(() => {
        if (!subdomain || !gatewayToken) {
            setState('disconnected')
            return
        }

        const client = SharedGateway.acquire(subdomain, gatewayToken)

        const handleState = (newState: GatewayConnectionState) => {
            setState(newState)
        }

        client.addStateListener(handleState)
        setState(client.state)

        return () => {
            client.removeStateListener(handleState)
            SharedGateway.release(subdomain)
        }
    }, [subdomain, gatewayToken])

    return state
}

export default useGatewayState