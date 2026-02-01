import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Firebase UID
  email: text('email').notNull().unique(),
  name: text('name'),
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
  createdAt: timestamp('created_at').defaultNow().notNull(),
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
