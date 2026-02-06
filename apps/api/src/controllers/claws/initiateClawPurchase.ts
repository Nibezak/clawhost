import type { Context } from 'hono'
import { eq, and } from 'drizzle-orm'
import { db } from '../../db'
import { users, sshKeys, pendingClaws } from '../../db/schema'
import { checkouts, customers } from '../../lib/polar'
import { generatePassword } from './helpers/index'

/**
 * Get the Polar product ID for a given plan
 * Products are created per-plan using scripts/create-polar-products.ts
 * Environment variable format: POLAR_PRODUCT_CX11, POLAR_PRODUCT_CX22, etc.
 */
function getPolarProductId(planId: string): string | null {
  // Check environment variable (format: POLAR_PRODUCT_CX11=product_id)
  const envKey = `POLAR_PRODUCT_${planId.toUpperCase().replace(/-/g, '_')}`
  const envValue = process.env[envKey]
  if (envValue) {
    return envValue
  }

  // Fallback to a default product ID (if set)
  return process.env.POLAR_DEFAULT_PRODUCT_ID || null
}

const initiateClawPurchase = async (c: Context<{ Variables: { userId: string } }>) => {
  try {
    const userId = c.get('userId')
    const { name, planId, location, password, sshKeyId, volumeSize, priceMonthly } = await c.req.json<{
      name: string
      planId: string
      location: string
      password?: string
      sshKeyId?: string
      volumeSize?: number
      priceMonthly: number // Price in dollars (already 2x markup from frontend)
    }>()

    if (!name || !planId || !location || !priceMonthly) {
      return c.json({ error: 'Missing required fields' }, 400)
    }

    // Validate volume size if provided
    if (volumeSize !== undefined && (volumeSize < 10 || volumeSize > 10240)) {
      return c.json({ error: 'Volume size must be between 10 and 10240 GB' }, 400)
    }

    // Get user info for Polar customer
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user[0]) {
      return c.json({ error: 'User not found' }, 404)
    }

    // Validate SSH key if provided
    if (sshKeyId) {
      const sshKey = await db
        .select()
        .from(sshKeys)
        .where(and(eq(sshKeys.id, sshKeyId), eq(sshKeys.userId, userId)))
        .limit(1)

      if (!sshKey[0]) {
        return c.json({ error: 'SSH key not found' }, 404)
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
      return c.json({ error: 'Payment not configured for this plan' }, 400)
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
    return c.json({ error: err instanceof Error ? err.message : 'Failed to initiate purchase' }, 500)
  }
}

export default initiateClawPurchase
