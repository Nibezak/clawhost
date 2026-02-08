import type {
    WebhookEvent,
    WebhookHandlers,
    CheckoutWebhookData,
    SubscriptionWebhookData
} from '@/ts/Interfaces'

const handleWebhook = async (
    event: WebhookEvent,
    handlers: WebhookHandlers
): Promise<void> => {
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

export default handleWebhook