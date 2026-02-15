import type { Context } from 'hono'

export type ProviderType = 'hetzner' | 'digitalocean' | 'vultr'

export type AuthenticatedContext = Context<{ Variables: { userId: string } }>

export type SubscriptionStatus =
    | 'active'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'past_due'
    | 'trialing'
    | 'unpaid'
    | 'revoked'

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

export type UserRole = 'user' | 'admin'

export type Environment = 'development' | 'production'