import type { CheckoutSession, CreateCheckoutParams } from '@/ts/Interfaces'
import { getPolarClient, getPolarConfig } from '@/lib/polar/client'

export const checkouts = {
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