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
  return {
    organizationId: process.env.POLAR_ORGANIZATION_ID,
    successUrl: process.env.POLAR_SUCCESS_URL,
    cancelUrl: process.env.POLAR_CANCEL_URL,
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET,
  }
}