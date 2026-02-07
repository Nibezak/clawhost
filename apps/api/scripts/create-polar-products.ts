/**
 * Script to create Polar products for each Hetzner plan
 *
 * Usage:
 *   pnpm --filter api exec tsx scripts/create-polar-products.ts
 *
 * Make sure your .env has:
 *   - POLAR_ACCESS_TOKEN
 *   - POLAR_ORGANIZATION_ID
 *   - HETZNER_API_TOKEN
 */

import 'dotenv/config'
import { Polar } from '@polar-sh/sdk'
import { hetzner } from '../src/services/hetzner'

async function main() {
  console.log('🚀 Creating Polar products for each Hetzner plan...\n')

  // Validate env vars
  const accessToken = process.env.POLAR_ACCESS_TOKEN

  if (!accessToken || accessToken.includes('REPLACE')) {
    console.error('❌ POLAR_ACCESS_TOKEN is not set in .env')
    process.exit(1)
  }

  // Initialize Polar client
  const polar = new Polar({ accessToken })

  // Fetch Hetzner plans
  console.log('📦 Fetching Hetzner server types...')
  const serverTypes = await hetzner.getServerTypes()
  console.log(`   Found ${serverTypes.length} server types\n`)

  // Track created products
  const createdProducts: { planId: string; productId: string; price: number }[] = []
  const envLines: string[] = []

  for (const plan of serverTypes) {
    // Calculate price with 2x markup (convert to cents)
    const priceMonthly = Math.ceil(plan.priceMonthly * 2 * 100) / 100
    const priceCents = Math.round(priceMonthly * 100)

    const productName = `Claw - ${plan.name.toUpperCase()}`
    const productDescription = `${plan.description} (${plan.cores} vCPU, ${plan.memory}GB RAM, ${plan.disk}GB SSD)`

    console.log(`Creating: ${productName}`)
    console.log(`   Specs: ${productDescription}`)
    console.log(`   Price: $${priceMonthly}/mo (${priceCents} cents)`)

    try {
      const product = await polar.products.create({
        name: productName,
        description: productDescription,
        prices: [
          {
            amountType: 'fixed',
            priceAmount: priceCents,
            priceCurrency: 'usd',
            recurringInterval: 'month',
          } as Record<string, unknown>,
        ],
      })

      createdProducts.push({
        planId: plan.name,
        productId: product.id,
        price: priceMonthly,
      })

      // Create env variable name (e.g., cx11 -> POLAR_PRODUCT_CX11)
      const envKey = `POLAR_PRODUCT_${plan.name.toUpperCase().replace(/-/g, '_')}`
      envLines.push(`${envKey}=${product.id}`)

      console.log(`   ✅ Created: ${product.id}\n`)
    } catch (err) {
      console.error(`   ❌ Failed: ${err instanceof Error ? err.message : err}\n`)
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📋 SUMMARY')
  console.log('='.repeat(60))
  console.log(`\nCreated ${createdProducts.length} products\n`)

  if (createdProducts.length > 0) {
    console.log('Add these to your .env file:\n')
    console.log('# Polar Product IDs (auto-generated)')
    envLines.forEach((line) => console.log(line))
    console.log('')
  }

  // Also show a table
  console.log('\nProduct mapping:')
  console.log('-'.repeat(60))
  console.log('Plan ID'.padEnd(15) + 'Price'.padEnd(12) + 'Product ID')
  console.log('-'.repeat(60))
  createdProducts.forEach((p) => {
    console.log(
      p.planId.padEnd(15) +
      `$${p.price}/mo`.padEnd(12) +
      p.productId
    )
  })
  console.log('-'.repeat(60))
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
