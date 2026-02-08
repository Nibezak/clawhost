import { getPolarClient, getPolarConfig } from './client'

export interface CheckoutSession {
    id: string
    url: string
    status: string
    customerId?: string
    customerEmail?: string
    productId: string
    amount: number
    currency: string
    metadata?: Record<string, string>
}

export interface CreateCheckoutParams {
    productId: string
    customerEmail: string
    customerId?: string
    successUrl?: string
    cancelUrl?: string
    metadata?: Record<string, string>
}

export const checkouts = {
    /**
     * Create a checkout session for a subscription
     * Product already has the correct price (created via scripts/create-polar-products.ts)
     */
    async create(params: CreateCheckoutParams): Promise<CheckoutSession> {
        const polar = getPolarClient()
        const config = getPolarConfig()

        const checkout = await polar.checkouts.create({
            products: [params.productId],
            customerEmail: params.customerEmail,
            customerId: params.customerId,
            successUrl: params.successUrl || config.successUrl,
            metadata: params.metadata
        })

        return {
            id: checkout.id,
            url: checkout.url,
            status: checkout.status,
            customerId: checkout.customerId ?? undefined,
            customerEmail: checkout.customerEmail ?? undefined,
            productId: params.productId,
            amount: checkout.totalAmount ?? 0,
            currency: checkout.currency ?? 'usd',
            metadata: checkout.metadata as Record<string, string> | undefined
        }
    },

    /**
     * Get a checkout session by ID
     */
    async get(checkoutId: string): Promise<CheckoutSession | null> {
        const polar = getPolarClient()

        try {
            const checkout = await polar.checkouts.get({ id: checkoutId })
            return {
                id: checkout.id,
                url: checkout.url,
                status: checkout.status,
                customerId: checkout.customerId ?? undefined,
                customerEmail: checkout.customerEmail ?? undefined,
                productId: checkout.productId ?? '',
                amount: checkout.totalAmount ?? 0,
                currency: checkout.currency ?? 'usd',
                metadata: checkout.metadata as
                    | Record<string, string>
                    | undefined
            }
        } catch {
            return null
        }
    }
}