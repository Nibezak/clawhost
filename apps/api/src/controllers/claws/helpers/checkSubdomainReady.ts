import { DOMAIN } from '@/controllers/claws/helpers/constants'

const checkSubdomainReady = async (subdomain: string): Promise<boolean> => {
    try {
        const response = await fetch(`https://${subdomain}.${DOMAIN}`, {
            signal: AbortSignal.timeout(3000)
        })
        return response.ok
    } catch {
        return false
    }
}

export default checkSubdomainReady