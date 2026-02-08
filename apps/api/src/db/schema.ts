import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    name: text('name'),
    polarCustomerId: text('polar_customer_id'),
    createdAt: timestamp('created_at').defaultNow().notNull()
})

export const claws = pgTable('claws', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    name: text('name').notNull(),
    hetznerServerId: text('hetzner_server_id'),
    status: text('status').notNull().default('creating'),
    ip: text('ip'),
    planId: text('plan_id').notNull(),
    location: text('location'),
    rootPassword: text('root_password'),
    sshKeyId: text('ssh_key_id').references(() => sshKeys.id),
    subdomain: text('subdomain'),
    gatewayToken: text('gateway_token'),
    polarSubscriptionId: text('polar_subscription_id'),
    polarProductId: text('polar_product_id'),
    polarCustomerId: text('polar_customer_id'),
    subscriptionStatus: text('subscription_status').default('pending'),
    deletionScheduledAt: timestamp('deletion_scheduled_at'),
    createdAt: timestamp('created_at').defaultNow().notNull()
})

export const pendingClaws = pgTable('pending_claws', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    checkoutId: text('checkout_id').notNull().unique(),
    name: text('name').notNull(),
    planId: text('plan_id').notNull(),
    location: text('location').notNull(),
    rootPassword: text('root_password'),
    sshKeyId: text('ssh_key_id').references(() => sshKeys.id),
    volumeSize: integer('volume_size'),
    priceMonthly: integer('price_monthly').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    expiresAt: timestamp('expires_at').notNull()
})

export const sshKeys = pgTable('ssh_keys', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    name: text('name').notNull(),
    publicKey: text('public_key').notNull(),
    fingerprint: text('fingerprint').notNull(),
    hetznerKeyId: integer('hetzner_key_id'),
    createdAt: timestamp('created_at').defaultNow().notNull()
})

export const volumes = pgTable('volumes', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    clawId: text('claw_id').references(() => claws.id),
    name: text('name').notNull(),
    size: integer('size').notNull(),
    hetznerVolumeId: integer('hetzner_volume_id'),
    location: text('location').notNull(),
    status: text('status').notNull().default('creating'),
    createdAt: timestamp('created_at').defaultNow().notNull()
})