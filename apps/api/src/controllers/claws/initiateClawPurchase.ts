import type { Context } from 'hono'
import { eq, and, count } from 'drizzle-orm'
import { db } from '@/db'
import { users, sshKeys, claws, pendingClaws } from '@/db/schema'
import { checkouts, customers } from '@/lib/polar'
import { generatePassword } from './helpers/index'
import { t } from '@openclaw/i18n'

const adjectives = [
  'cozy', 'swift', 'brave', 'calm', 'tiny', 'wild', 'warm', 'cool',
  'happy', 'lucky', 'fuzzy', 'snowy', 'dusty', 'misty', 'sunny',
  'sleepy', 'clever', 'gentle', 'mighty', 'silent', 'golden', 'cosmic',
  'polar', 'rusty', 'nimble', 'jolly', 'witty', 'noble', 'vivid', 'crisp',
]

const nouns = [
  'claw', 'panda', 'otter', 'fox', 'wolf', 'bear', 'falcon', 'lynx',
  'raven', 'crane', 'pike', 'owl', 'hare', 'frog', 'moth', 'finch',
  'cedar', 'maple', 'birch', 'reef', 'dune', 'peak', 'brook', 'grove',
  'ember', 'spark', 'drift', 'frost', 'cloud', 'storm',
]

// Shuffled pool of all combinations — cycles through every name before repeating
let namePool: string[] = []

function shufflePool() {
  namePool = []
  for (const adj of adjectives) {
    for (const noun of nouns) {
      namePool.push(`${adj}-${noun}`)
    }
  }
  // Fisher-Yates shuffle
  for (let i = namePool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[namePool[i], namePool[j]] = [namePool[j], namePool[i]]
  }
}

function generateClawName(): string {
  if (namePool.length === 0) {
    shufflePool()
  }
  return namePool.pop()!
}

/**
 * Get the Polar product ID for a given plan
 * Products are created per-plan using scripts/create-polar-products.ts
 * Environment variable format: POLAR_PRODUCT_CX11, POLAR_PRODUCT_CX22, etc.
 */
function getPolarProductId(planId: string): string | null {
  // Check environment variable (format: POLAR_PRODUCT_CX11=product_id)
  const envKey = `POLAR_PRODUCT_${planId.toUpperCase().replace(/-/g, '_')}`
  const envValue = process.env[envKey]
  
  if (envValue) return envValue
  else return null
}

const initiateClawPurchase = async (c: Context<{ Variables: { userId: string } }>) => {
  try {
    const userId = c.get('userId')
    const { name: rawName, planId, location, password, sshKeyId, volumeSize, priceMonthly } = await c.req.json<{
      name?: string
      planId: string
      location: string
      password?: string
      sshKeyId?: string
      volumeSize?: number
      priceMonthly: number // Price in dollars (already 2x markup from frontend)
    }>()

    if (!planId || !location || !priceMonthly) {
      return c.json({ error: t('api.missingRequiredFields') }, 400)
    }

    // Check claw limit
    const MAX_CLAWS_PER_ACCOUNT = 50
    const [{ value: clawCount }] = await db
      .select({ value: count() })
      .from(claws)
      .where(eq(claws.userId, userId))

    if (clawCount >= MAX_CLAWS_PER_ACCOUNT) {
      return c.json({
        error: t('api.clawLimitReached')
      }, 400)
    }

    // Generate a cozy random name if not provided
    const name = rawName || generateClawName()

    // Validate volume size if provided
    if (volumeSize !== undefined && (volumeSize < 10 || volumeSize > 10240)) {
      return c.json({ error: t('api.volumeSizeInvalid') }, 400)
    }

    // Get user info for Polar customer
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user[0]) {
      return c.json({ error: t('api.userNotFound') }, 404)
    }

    // Validate SSH key if provided
    if (sshKeyId) {
      const sshKey = await db
        .select()
        .from(sshKeys)
        .where(and(eq(sshKeys.id, sshKeyId), eq(sshKeys.userId, userId)))
        .limit(1)

      if (!sshKey[0]) {
        return c.json({ error: t('api.sshKeyNotFound') }, 404)
      }
    }

    // Get or create Polar customer
    let polarCustomerId = user[0].polarCustomerId

    if (!polarCustomerId) {
      const customer = await customers.getOrCreate({
        email: user[0].email,
        name: user[0].name || undefined,
        externalId: userId,
      })
      polarCustomerId = customer.id

      // Save customer ID to user
      await db
        .update(users)
        .set({ polarCustomerId })
        .where(eq(users.id, userId))
    }

    // Get product ID for this plan
    const productId = getPolarProductId(planId)
    if (!productId) {
      return c.json({ error: t('api.paymentNotConfigured') }, 400)
    }

    // Generate pending claw ID
    const pendingId = crypto.randomUUID()
    const finalPassword = password || generatePassword()

    // Create checkout session (product already has correct price)
    const checkout = await checkouts.create({
      productId,
      customerEmail: user[0].email,
      customerId: polarCustomerId,
      metadata: {
        pendingClawId: pendingId,
        userId,
        planId,
        location,
        name,
      },
    })

    // Calculate expiration (24 hours from now)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    // Store pending claw
    await db.insert(pendingClaws).values({
      id: pendingId,
      userId,
      checkoutId: checkout.id,
      name,
      planId,
      location,
      rootPassword: finalPassword,
      sshKeyId: sshKeyId || null,
      volumeSize: volumeSize || null,
      priceMonthly: Math.round(priceMonthly * 100), // Store in cents
      expiresAt,
    })

    return c.json({
      checkoutUrl: checkout.url,
      checkoutId: checkout.id,
      pendingClawId: pendingId,
      expiresAt: expiresAt.toISOString(),
    })
  } catch (err) {
    console.error('Initiate claw purchase error:', err)
    return c.json({ error: err instanceof Error ? err.message : t('api.failedToInitiatePurchase') }, 500)
  }
}

export default initiateClawPurchase
