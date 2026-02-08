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
 * Verify webhook signature from Polar (Standard Webhooks format)
 * Polar signs: `${webhookId}.${timestamp}.${body}` using HMAC-SHA256
 * The secret is base64-encoded and prefixed with "whsec_"
 */
export function verifyWebhookSignature(
    payload: string,
    webhookId: string,
    timestamp: string,
    signatureHeader: string,
    secret: string
): boolean {
    // Build the signed content: id.timestamp.body
    const signedContent = `${webhookId}.${timestamp}.${payload}`

    // Try multiple secret formats since Polar's format may vary
    const secretVariants = [
        // Raw secret as UTF-8 (no prefix stripping, no base64 decode)
        Buffer.from(secret),
        // Strip polar_whs_ prefix, base64 decode
        secret.startsWith('polar_whs_')
            ? Buffer.from(secret.slice(10), 'base64')
            : null,
        // Strip whsec_ prefix, base64 decode
        secret.startsWith('whsec_')
            ? Buffer.from(secret.slice(6), 'base64')
            : null,
        // Full secret as base64
        Buffer.from(secret, 'base64'),
        // Strip polar_whs_ prefix, use as UTF-8
        secret.startsWith('polar_whs_') ? Buffer.from(secret.slice(10)) : null
    ].filter(Boolean) as Buffer[]

    // Extract v1 signatures from header
    const receivedSigs = signatureHeader
        .split(' ')
        .filter((s) => s.startsWith('v1,'))
        .map((s) => s.slice(3))

    for (const secretBytes of secretVariants) {
        const expectedSignature = crypto
            .createHmac('sha256', secretBytes)
            .update(signedContent)
            .digest('base64')

        for (const received of receivedSigs) {
            try {
                if (
                    crypto.timingSafeEqual(
                        Buffer.from(received),
                        Buffer.from(expectedSignature)
                    )
                ) {
                    return true
                }
            } catch {
                // Length mismatch, continue
            }
        }
    }

    return false
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

    const webhookId = c.req.header('webhook-id')
    const timestamp = c.req.header('webhook-timestamp')
    const signature = c.req.header('webhook-signature')

    if (!webhookId || !timestamp || !signature) {
        console.error('Missing webhook headers')
        return null
    }

    const payload = await c.req.text()

    // Verify signature
    if (
        !verifyWebhookSignature(
            payload,
            webhookId,
            timestamp,
            signature,
            config.webhookSecret
        )
    ) {
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
    onSubscriptionUncanceled?: (data: SubscriptionWebhookData) => Promise<void>
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
            await handlers.onCheckoutCreated?.(
                event.data as CheckoutWebhookData
            )
            break
        case 'checkout.updated':
            await handlers.onCheckoutUpdated?.(
                event.data as CheckoutWebhookData
            )
            break
        case 'subscription.created':
            await handlers.onSubscriptionCreated?.(
                event.data as SubscriptionWebhookData
            )
            break
        case 'subscription.active':
            await handlers.onSubscriptionActive?.(
                event.data as SubscriptionWebhookData
            )
            break
        case 'subscription.updated':
            await handlers.onSubscriptionUpdated?.(
                event.data as SubscriptionWebhookData
            )
            break
        case 'subscription.canceled':
            await handlers.onSubscriptionCanceled?.(
                event.data as SubscriptionWebhookData
            )
            break
        case 'subscription.revoked':
            await handlers.onSubscriptionRevoked?.(
                event.data as SubscriptionWebhookData
            )
            break
        case 'subscription.uncanceled':
            await handlers.onSubscriptionUncanceled?.(
                event.data as SubscriptionWebhookData
            )
            break
    }
}