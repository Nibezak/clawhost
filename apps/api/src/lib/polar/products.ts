import { getPolarClient, getPolarConfig } from './client'

export interface PolarProduct {
  id: string
  name: string
  description?: string
  isRecurring: boolean
  isArchived: boolean
}

export const products = {
  /**
   * Get all products for the organization
   */
  async list(): Promise<PolarProduct[]> {
    const polar = getPolarClient()
    const config = getPolarConfig()

    const result = await polar.products.list({
      organizationId: config.organizationId,
    })

    const items = 'result' in result ? result.result : (result as unknown as { items: unknown[] }).items || []

    return (items as Array<{
      id: string
      name: string
      description?: string | null
      isRecurring: boolean
      isArchived: boolean
    }>).map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description ?? undefined,
      isRecurring: product.isRecurring,
      isArchived: product.isArchived,
    }))
  },

  /**
   * Get a product by ID
   */
  async get(productId: string): Promise<PolarProduct | null> {
    const polar = getPolarClient()

    try {
      const product = await polar.products.get({ id: productId })
      return {
        id: product.id,
        name: product.name,
        description: product.description ?? undefined,
        isRecurring: product.isRecurring,
        isArchived: product.isArchived,
      }
    } catch {
      return null
    }
  },

  /**
   * Create a new recurring product for a plan
   */
  async create(data: {
    name: string
    description?: string
    priceAmountCents: number
    recurringInterval?: 'month' | 'year'
  }): Promise<PolarProduct> {
    const polar = getPolarClient()
    const config = getPolarConfig()

    const product = await polar.products.create({
      name: data.name,
      description: data.description,
      organizationId: config.organizationId,
      // Use type assertion for the prices array as the SDK types may vary
      prices: [
        {
          amountType: 'fixed' as const,
          priceAmount: data.priceAmountCents,
          priceCurrency: 'usd',
        },
      ] as Parameters<typeof polar.products.create>[0]['prices'],
    })

    return {
      id: product.id,
      name: product.name,
      description: product.description ?? undefined,
      isRecurring: product.isRecurring,
      isArchived: product.isArchived,
    }
  },

  /**
   * Archive a product (soft delete)
   */
  async archive(productId: string): Promise<void> {
    const polar = getPolarClient()
    await polar.products.update({
      id: productId,
      productUpdate: {
        isArchived: true,
      },
    })
  },
}
