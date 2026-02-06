import type { Context } from 'hono'
import crypto from 'crypto'
import { getPolarConfig } from './client'

// Polar webhook event types
export type WebhookEventType =
  | 'checkout.created'
  | 'checkout.updated'
  | 'subscription.created'
  | 'subscription.active'
  | 'subscription.updated'
  | 'subscription.canceled'
  | 'subscription.revoked'
  | 'subscription.uncanceled'
  | 'order.created'
  | 'order.paid'
  | 'order.refunded'

export interface WebhookEvent<T = unknown> {
  type: WebhookEventType
  data: T
}

export interface SubscriptionWebhookData {
  id: string
  status: string
  customerId: string
  customerEmail?: string
  productId: string
  priceId?: string
  amount: number
  currency: string
  currentPeriodStart?: string
  currentPeriodEnd?: string
  cancelAtPeriodEnd: boolean
  canceledAt?: string
  endedAt?: string
  metadata?: Record<string, string>
}

export interface CheckoutWebhookData {
  id: string
  status: string
  customerId?: string
  customerEmail?: string
  productId: string
  subscriptionId?: string
  amount: number
  currency: string
  metadata?: Record<string, string>
}

/**
 * Verify webhook signature from Polar
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

/**
 * Parse and verify a webhook request
 */
export async function parseWebhook(c: Context): Promise<WebhookEvent | null> {
  const config = getPolarConfig()

  if (!config.webhookSecret) {
    console.error('POLAR_WEBHOOK_SECRET is not configured')
    return null
  }

  const signature = c.req.header('webhook-signature') || c.req.header('x-polar-signature')
  if (!signature) {
    console.error('Missing webhook signature header')
    return null
  }

  const payload = await c.req.text()

  // Verify signature
  if (!verifyWebhookSignature(payload, signature, config.webhookSecret)) {
    console.error('Invalid webhook signature')
    return null
  }

  try {
    const event = JSON.parse(payload) as WebhookEvent
    return event
  } catch {
    console.error('Failed to parse webhook payload')
    return null
  }
}

export type WebhookHandlers = {
  onCheckoutCreated?: (data: CheckoutWebhookData) => Promise<void>
  onCheckoutUpdated?: (data: CheckoutWebhookData) => Promise<void>
  onSubscriptionCreated?: (data: SubscriptionWebhookData) => Promise<void>
  onSubscriptionActive?: (data: SubscriptionWebhookData) => Promise<void>
  onSubscriptionUpdated?: (data: SubscriptionWebhookData) => Promise<void>
  onSubscriptionCanceled?: (data: SubscriptionWebhookData) => Promise<void>
  onSubscriptionRevoked?: (data: SubscriptionWebhookData) => Promise<void>
}

/**
 * Handle a webhook event with provided handlers
 */
export async function handleWebhook(
  event: WebhookEvent,
  handlers: WebhookHandlers
): Promise<void> {
  switch (event.type) {
    case 'checkout.created':
      await handlers.onCheckoutCreated?.(event.data as CheckoutWebhookData)
      break
    case 'checkout.updated':
      await handlers.onCheckoutUpdated?.(event.data as CheckoutWebhookData)
      break
    case 'subscription.created':
      await handlers.onSubscriptionCreated?.(event.data as SubscriptionWebhookData)
      break
    case 'subscription.active':
      await handlers.onSubscriptionActive?.(event.data as SubscriptionWebhookData)
      break
    case 'subscription.updated':
      await handlers.onSubscriptionUpdated?.(event.data as SubscriptionWebhookData)
      break
    case 'subscription.canceled':
      await handlers.onSubscriptionCanceled?.(event.data as SubscriptionWebhookData)
      break
    case 'subscription.revoked':
      await handlers.onSubscriptionRevoked?.(event.data as SubscriptionWebhookData)
      break
  }
}
