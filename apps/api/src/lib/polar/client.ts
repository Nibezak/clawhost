import { Polar } from '@polar-sh/sdk'

let polarClient: Polar | null = null

export function getPolarClient(): Polar {
  if (polarClient) {
    return polarClient
  }

  const accessToken = process.env.POLAR_ACCESS_TOKEN
  if (!accessToken) {
    throw new Error('POLAR_ACCESS_TOKEN is not set')
  }

  polarClient = new Polar({
    accessToken,
  })

  return polarClient
}

export function getPolarConfig() {
    const url = process.env.CLIENT
    const http = url?.includes('localhost') ? 'http' : 'https'
    
    const successUrl = `${http}://${url}/claws?payment=success&checkout_id={CHECKOUT_ID}`
    const cancelUrl = `${http}://${url}/claws?payment=success`

    return {
        organizationId: process.env.POLAR_ORGANIZATION_ID,
        successUrl,
        cancelUrl,
        webhookSecret: process.env.POLAR_WEBHOOK_SECRET,
    }
}