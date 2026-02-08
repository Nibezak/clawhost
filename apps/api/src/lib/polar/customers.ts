import { getPolarClient } from './client'

export interface PolarCustomer {
    id: string
    email: string
    name?: string
    externalId?: string
}

export const customers = {
    /**
     * Create a new customer in Polar
     */
    async create(data: {
        email: string
        name?: string
        externalId: string // Our user ID
    }): Promise<PolarCustomer> {
        const polar = getPolarClient()

        const customer = await polar.customers.create({
            email: data.email,
            name: data.name,
            externalId: data.externalId
        })

        return {
            id: customer.id,
            email: customer.email,
            name: customer.name ?? undefined,
            externalId: customer.externalId ?? undefined
        }
    },

    /**
     * Get customer by external ID (our user ID)
     */
    async getByExternalId(externalId: string): Promise<PolarCustomer | null> {
        const polar = getPolarClient()

        try {
            const customer = await polar.customers.getExternal({ externalId })
            return {
                id: customer.id,
                email: customer.email,
                name: customer.name ?? undefined,
                externalId: customer.externalId ?? undefined
            }
        } catch {
            return null
        }
    },

    /**
     * Get or create customer
     */
    async getOrCreate(data: {
        email: string
        name?: string
        externalId: string
    }): Promise<PolarCustomer> {
        const existing = await this.getByExternalId(data.externalId)
        if (existing) {
            return existing
        }
        return this.create(data)
    },

    /**
     * Get customer by ID
     */
    async get(customerId: string): Promise<PolarCustomer | null> {
        const polar = getPolarClient()

        try {
            const customer = await polar.customers.get({ id: customerId })
            return {
                id: customer.id,
                email: customer.email,
                name: customer.name ?? undefined,
                externalId: customer.externalId ?? undefined
            }
        } catch {
            return null
        }
    }
}