import {
    pgTable,
    text,
    timestamp,
    integer,
    index,
    unique
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    name: text('name'),
    polarCustomerId: text('polar_customer_id'),
    role: text('role').notNull().default('user'),
    createdAt: timestamp('created_at', { withTimezone: true })
        .defaultNow()
        .notNull()
})

export const claws = pgTable(
    'claws',
    {
        id: text('id').primaryKey(),
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        name: text('name').notNull(),
        provider: text('provider').notNull().default('hetzner'),
        providerServerId: text('provider_server_id'),
        status: text('status').notNull().default('creating'),
        ip: text('ip'),
        planId: text('plan_id').notNull(),
        location: text('location'),
        rootPassword: text('root_password'),
        sshKeyId: text('ssh_key_id').references(() => sshKeys.id, {
            onDelete: 'set null'
        }),
        subdomain: text('subdomain').unique(),
        gatewayToken: text('gateway_token'),
        model: text('model'),
        polarSubscriptionId: text('polar_subscription_id').unique(),
        polarProductId: text('polar_product_id'),
        polarCustomerId: text('polar_customer_id'),
        subscriptionStatus: text('subscription_status').default('pending'),
        deletionScheduledAt: timestamp('deletion_scheduled_at', {
            withTimezone: true
        }),
        createdAt: timestamp('created_at', { withTimezone: true })
            .defaultNow()
            .notNull()
    },
    (table) => [
        index('claws_user_id_idx').on(table.userId),
        index('claws_polar_subscription_id_idx').on(table.polarSubscriptionId),
        index('claws_subdomain_idx').on(table.subdomain)
    ]
)

export const pendingClaws = pgTable(
    'pending_claws',
    {
        id: text('id').primaryKey(),
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        checkoutId: text('checkout_id').notNull().unique(),
        name: text('name').notNull(),
        provider: text('provider').notNull().default('hetzner'),
        planId: text('plan_id').notNull(),
        location: text('location').notNull(),
        rootPassword: text('root_password'),
        sshKeyId: text('ssh_key_id').references(() => sshKeys.id, {
            onDelete: 'set null'
        }),
        volumeSize: integer('volume_size'),
        model: text('model'),
        apiToken: text('api_token'),
        priceMonthly: integer('price_monthly').notNull(),
        createdAt: timestamp('created_at', { withTimezone: true })
            .defaultNow()
            .notNull(),
        expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
    },
    (table) => [
        index('pending_claws_user_id_idx').on(table.userId),
        index('pending_claws_expires_at_idx').on(table.expiresAt)
    ]
)

export const sshKeys = pgTable(
    'ssh_keys',
    {
        id: text('id').primaryKey(),
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        name: text('name').notNull(),
        publicKey: text('public_key').notNull(),
        fingerprint: text('fingerprint').notNull(),
        providerKeyId: integer('provider_key_id'),
        digitaloceanKeyId: integer('digitalocean_key_id'),
        vultrKeyId: integer('vultr_key_id'),
        createdAt: timestamp('created_at', { withTimezone: true })
            .defaultNow()
            .notNull()
    },
    (table) => [
        index('ssh_keys_user_id_idx').on(table.userId),
        unique('ssh_keys_user_fingerprint').on(table.userId, table.fingerprint)
    ]
)

export const rateLimits = pgTable('rate_limits', {
    key: text('key').primaryKey(),
    lastSentAt: timestamp('last_sent_at', { withTimezone: true }).notNull()
})

export const otpCodes = pgTable(
    'otp_codes',
    {
        id: text('id').primaryKey(),
        email: text('email').notNull(),
        codeHash: text('code_hash').notNull(),
        attempts: integer('attempts').notNull().default(0),
        expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
        createdAt: timestamp('created_at', { withTimezone: true })
            .defaultNow()
            .notNull()
    },
    (table) => [index('otp_codes_email_idx').on(table.email)]
)

export const clawExports = pgTable(
    'claw_exports',
    {
        id: text('id').primaryKey(),
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        clawId: text('claw_id')
            .notNull()
            .references(() => claws.id, { onDelete: 'cascade' }),
        fileSize: integer('file_size'),
        createdAt: timestamp('created_at', { withTimezone: true })
            .defaultNow()
            .notNull()
    },
    (table) => [index('claw_exports_claw_id_idx').on(table.clawId)]
)

export const volumes = pgTable(
    'volumes',
    {
        id: text('id').primaryKey(),
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        clawId: text('claw_id').references(() => claws.id, {
            onDelete: 'cascade'
        }),
        name: text('name').notNull(),
        size: integer('size').notNull(),
        providerVolumeId: integer('provider_volume_id'),
        location: text('location').notNull(),
        status: text('status').notNull().default('creating'),
        createdAt: timestamp('created_at', { withTimezone: true })
            .defaultNow()
            .notNull()
    },
    (table) => [
        index('volumes_user_id_idx').on(table.userId),
        index('volumes_claw_id_idx').on(table.clawId)
    ]
)