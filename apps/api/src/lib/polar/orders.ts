import { getPolarClient } from './client'

export interface PolarOrder {
    id: string
    status: string
    subtotalAmount: number
    discountAmount: number
    totalAmount: number
    taxAmount: number
    currency: string
    billingReason: string
    productName: string | null
    productId: string | null
    subscriptionId: string | null
    discountName: string | null
    createdAt: string
}

export interface PolarOrdersPage {
    items: PolarOrder[]
    totalCount: number
    maxPage: number
}

export const orders = {
    /**
     * List orders for a customer with pagination
     */
    async listByCustomer(
        customerId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<PolarOrdersPage> {
        const polar = getPolarClient()

        try {
            const result = await polar.orders.list({
                customerId,
                page,
                limit,
                sorting: ['-created_at']
            })

            const data =
                'result' in result
                    ? result.result
                    : (result as unknown as {
                          items: unknown[]
                          pagination: { totalCount: number; maxPage: number }
                      })

            const items = (data.items || []) as Array<{
                id: string
                status: string
                amount: number
                subtotalAmount: number
                discountAmount: number
                taxAmount: number
                currency?: string
                billingReason: string
                product?: { name: string; id: string } | null
                productId?: string | null
                subscriptionId?: string | null
                discount?: { name: string } | null
                createdAt: Date | string
            }>

            return {
                items: items.map((order) => ({
                    id: order.id,
                    status: order.status,
                    subtotalAmount: order.subtotalAmount ?? order.amount ?? 0,
                    discountAmount: order.discountAmount ?? 0,
                    totalAmount: order.amount ?? 0,
                    taxAmount: order.taxAmount ?? 0,
                    currency: order.currency ?? 'usd',
                    billingReason: order.billingReason,
                    productName: order.product?.name ?? null,
                    productId: order.product?.id ?? order.productId ?? null,
                    subscriptionId: order.subscriptionId ?? null,
                    discountName: order.discount?.name ?? null,
                    createdAt:
                        order.createdAt instanceof Date
                            ? order.createdAt.toISOString()
                            : String(order.createdAt)
                })),
                totalCount: data.pagination?.totalCount ?? 0,
                maxPage: data.pagination?.maxPage ?? 1
            }
        } catch {
            return { items: [], totalCount: 0, maxPage: 1 }
        }
    },

    /**
     * Get invoice URL for a specific order
     */
    async getInvoiceUrl(orderId: string): Promise<string> {
        const polar = getPolarClient()
        const invoice = await polar.orders.invoice({ id: orderId })
        return invoice.url
    }
}