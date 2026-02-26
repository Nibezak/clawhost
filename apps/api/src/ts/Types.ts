import type { Context } from 'hono'

export type ProviderType = 'hetzner' | 'digitalocean' | 'vultr'

export type HonoEnv = { Variables: { userId: string } }

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

export type UserRole = 'user' | 'admin'

export type Environment = 'development' | 'production'

export type ClawFileType =
    | 'json'
    | 'markdown'
    | 'javascript'
    | 'typescript'
    | 'yaml'
    | 'text'
    | 'unknown'

export type FeatureRequestStatus =
    | 'awaiting_approval'
    | 'requested'
    | 'marked_for_implementation'
    | 'implemented'

export type FeatureRequestPlatform = 'desktop' | 'mobile' | 'web'

export type FeatureRequestSortBy = 'newest' | 'upvotes'