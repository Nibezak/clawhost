import 'dotenv/config'
import { Polar } from '@polar-sh/sdk'
import { getProvider } from '@/services/provider'

const customPrices: Record<string, Record<string, number>> = {
    hetzner: {
        cx23: 10,
        cx33: 15,
        cx43: 20,
        cx53: 30,
        cpx11: 15,
        cpx21: 20,
        cpx31: 30,
        cpx41: 50,
        cpx51: 75,
        cax11: 10,
        cax21: 15,
        cax31: 25,
        cax41: 50,
        ccx13: 25,
        ccx23: 50,
        ccx33: 100,
        ccx43: 150,
        ccx53: 250,
        ccx63: 350
    },
    digitalocean: {
        's-1vcpu-512mb-10gb': 10,
        's-1vcpu-1gb': 15,
        's-1vcpu-2gb': 20,
        's-2vcpu-2gb': 30,
        's-2vcpu-4gb': 50,
        's-4vcpu-8gb': 75,
        's-8vcpu-16gb': 150
    }
}

async function main() {
    const providerName = (process.argv[2] || 'hetzner') as
        | 'hetzner'
        | 'digitalocean'

    const prices = customPrices[providerName]
    if (!prices) {
        console.error(`❌ Unknown provider: ${providerName}`)
        process.exit(1)
    }

    console.log(`🚀 Creating Polar products for ${providerName} plans...\n`)

    const accessToken = process.env.POLAR_ACCESS_TOKEN

    if (!accessToken || accessToken.includes('REPLACE')) {
        console.error('❌ POLAR_ACCESS_TOKEN is not set in .env')
        process.exit(1)
    }

    const polar = new Polar({ accessToken })

    console.log(`📦 Fetching ${providerName} server types...`)
    const provider = getProvider(providerName)
    const serverTypes = await provider.getServerTypes()
    console.log(`   Found ${serverTypes.length} server types\n`)

    const whitelistedPlans = serverTypes.filter(
        (st) => prices[st.name] !== undefined
    )
    console.log(`   ${whitelistedPlans.length} plans in whitelist\n`)

    const createdProducts: {
        planId: string
        productId: string
        price: number
    }[] = []
    const envLines: string[] = []

    for (const plan of whitelistedPlans) {
        const priceMonthly = prices[plan.name]
        const priceCents = Math.round(priceMonthly * 100)

        const productName = `Claw - ${plan.description}`
        const productDescription = `${plan.description} (${plan.cores} vCPU, ${plan.memory}GB RAM, ${plan.disk}GB SSD)`

        console.log(`Creating: ${productName}`)
        console.log(`   Specs: ${productDescription}`)
        console.log(`   Price: $${priceMonthly}/mo (${priceCents} cents)`)

        try {
            const product = await polar.products.create({
                name: productName,
                description: productDescription,
                recurringInterval: 'month',
                prices: [
                    {
                        amountType: 'fixed',
                        priceAmount: priceCents,
                        priceCurrency: 'usd'
                    }
                ]
            })

            createdProducts.push({
                planId: plan.name,
                productId: product.id,
                price: priceMonthly
            })

            const envKey = `POLAR_PRODUCT_${providerName.toUpperCase()}_${plan.name.toUpperCase().replace(/-/g, '_')}`
            envLines.push(`${envKey}=${product.id}`)

            console.log(`   ✅ Created: ${product.id}\n`)
        } catch (err) {
            console.error(
                `   ❌ Failed: ${err instanceof Error ? err.message : err}\n`
            )
        }
    }

    console.log('\n' + '='.repeat(60))
    console.log('📋 SUMMARY')
    console.log('='.repeat(60))
    console.log(`\nCreated ${createdProducts.length} products\n`)

    if (createdProducts.length > 0) {
        console.log('Add these to your .env file:\n')
        console.log(`# Polar Product IDs for ${providerName} (auto-generated)`)
        envLines.forEach((line) => console.log(line))
        console.log('')
    }

    console.log('\nProduct mapping:')
    console.log('-'.repeat(60))
    console.log('Plan ID'.padEnd(20) + 'Price'.padEnd(12) + 'Product ID')
    console.log('-'.repeat(60))
    createdProducts.forEach((p) => {
        console.log(
            p.planId.padEnd(20) + `$${p.price}/mo`.padEnd(12) + p.productId
        )
    })
    console.log('-'.repeat(60))
}

main().catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
})