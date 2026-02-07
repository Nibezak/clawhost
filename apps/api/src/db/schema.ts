import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Firebase UID
  email: text('email').notNull().unique(),
  name: text('name'),
  polarCustomerId: text('polar_customer_id'), // Polar customer ID
  createdAt: timestamp('created_at').defaultNow().notNull(),
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
  subdomain: text('subdomain'), // Unique subdomain slug (e.g., "abc123" for abc123.clawhost.cloud)
  gatewayToken: text('gateway_token'), // Token for authenticating with the gateway
  // Polar subscription fields
  polarSubscriptionId: text('polar_subscription_id'), // Polar subscription ID
  polarProductId: text('polar_product_id'), // Polar product ID used for this claw
  polarCustomerId: text('polar_customer_id'), // Polar customer ID
  subscriptionStatus: text('subscription_status').default('pending'), // pending, active, canceled, past_due, revoked
  deletionScheduledAt: timestamp('deletion_scheduled_at'), // When the claw is scheduled to be deleted (null = not scheduled)
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Pending claw creations (waiting for payment)
export const pendingClaws = pgTable('pending_claws', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  checkoutId: text('checkout_id').notNull().unique(), // Polar checkout session ID
  name: text('name').notNull(),
  planId: text('plan_id').notNull(),
  location: text('location').notNull(),
  rootPassword: text('root_password'),
  sshKeyId: text('ssh_key_id').references(() => sshKeys.id),
  volumeSize: integer('volume_size'), // Optional volume size in GB
  priceMonthly: integer('price_monthly').notNull(), // Price in cents
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(), // Checkout sessions expire
})

export const sshKeys = pgTable('ssh_keys', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  name: text('name').notNull(),
  publicKey: text('public_key').notNull(),
  fingerprint: text('fingerprint').notNull(),
  hetznerKeyId: integer('hetzner_key_id'), // Hetzner's SSH key ID
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const volumes = pgTable('volumes', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  clawId: text('claw_id').references(() => claws.id),
  name: text('name').notNull(),
  size: integer('size').notNull(), // Size in GB
  hetznerVolumeId: integer('hetzner_volume_id'),
  location: text('location').notNull(),
  status: text('status').notNull().default('creating'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
