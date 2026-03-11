import type { Context } from 'hono'

export type ProviderType = 'hetzner' | 'digitalocean' | 'vultr'

export type HonoEnv = { Variables: { userId: string; isAdmin: boolean } }

export type AuthenticatedContext = Context<HonoEnv>

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

export type AuthMethod = 'email' | 'google' | 'github'

import type { userRole } from '@openclaw/shared'

export type UserRole = (typeof userRole)[keyof typeof userRole]

export type Environment = 'development' | 'production'

export type ClawFileType =
    | 'json'
    | 'markdown'
    | 'javascript'
    | 'typescript'
    | 'yaml'
    | 'text'
    | 'unknown'

export type PiperVoiceQuality = 'low' | 'medium' | 'high'

export type BillingInterval = 'month' | 'year'

export type PolarPriceMap = Record<string, Record<string, number>>