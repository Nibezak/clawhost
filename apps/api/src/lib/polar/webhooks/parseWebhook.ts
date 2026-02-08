import type { Context } from 'hono'
import type { WebhookEvent } from '@/ts/Interfaces'

import getPolarConfig from '@/lib/polar/getPolarConfig'
import verifyWebhookSignature from '@/lib/polar/webhooks/verifyWebhookSignature'

const parseWebhook = async (c: Context): Promise<WebhookEvent | null> => {
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

export default parseWebhook