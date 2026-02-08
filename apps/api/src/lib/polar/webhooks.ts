import type { Context } from 'hono'
import type {
    WebhookEvent,
    WebhookHandlers,
    CheckoutWebhookData,
    SubscriptionWebhookData
} from '@/ts/Interfaces'
import crypto from 'crypto'
import { getPolarConfig } from './client'

export function verifyWebhookSignature(
    payload: string,
    webhookId: string,
    timestamp: string,
    signatureHeader: string,
    secret: string
): boolean {
    const signedContent = `${webhookId}.${timestamp}.${payload}`

    const secretVariants = [
        Buffer.from(secret),
        secret.startsWith('polar_whs_')
            ? Buffer.from(secret.slice(10), 'base64')
            : null,
        secret.startsWith('whsec_')
            ? Buffer.from(secret.slice(6), 'base64')
            : null,
        Buffer.from(secret, 'base64'),
        secret.startsWith('polar_whs_') ? Buffer.from(secret.slice(10)) : null
    ].filter(Boolean) as Buffer[]

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