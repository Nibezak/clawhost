/**
 * One-time script to configure Polar customer portal settings.
 * Disables plan changes and cancellation in the customer portal.
 *
 * Usage: pnpm --filter api exec tsx ../../scripts/configure-polar-portal.ts
 * Requires: POLAR_ACCESS_TOKEN and POLAR_ORGANIZATION_ID in apps/api/.env
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

// Parse .env file manually to avoid dotenv dependency
const envPath = resolve(import.meta.dirname ?? __dirname, '../apps/api/.env')
const envContent = readFileSync(envPath, 'utf-8')
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eqIndex = trimmed.indexOf('=')
  if (eqIndex === -1) continue
  const key = trimmed.slice(0, eqIndex).trim()
  const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '')
  if (!process.env[key]) process.env[key] = value
}

const POLAR_ACCESS_TOKEN = process.env.POLAR_ACCESS_TOKEN
const POLAR_ORGANIZATION_ID = process.env.POLAR_ORGANIZATION_ID

if (!POLAR_ACCESS_TOKEN || !POLAR_ORGANIZATION_ID) {
  console.error('Missing POLAR_ACCESS_TOKEN or POLAR_ORGANIZATION_ID in apps/api/.env')
  process.exit(1)
}

const BASE_URL = 'https://api.polar.sh'

async function configurePortal() {
  console.log(`Configuring Polar organization: ${POLAR_ORGANIZATION_ID}\n`)

  // First, get current organization settings
  const getRes = await fetch(`${BASE_URL}/v1/organizations/${POLAR_ORGANIZATION_ID}`, {
    headers: { Authorization: `Bearer ${POLAR_ACCESS_TOKEN}` },
  })

  if (!getRes.ok) {
    console.error('Failed to fetch organization:', await getRes.text())
    process.exit(1)
  }

  const org = await getRes.json()
  console.log('Current customer_portal_settings:', JSON.stringify(org.customer_portal_settings, null, 2))
  console.log('Current subscription_settings:', JSON.stringify(org.subscription_settings, null, 2))
  console.log()

  // Update organization to disable plan changes and customer updates
  const updateRes = await fetch(`${BASE_URL}/v1/organizations/${POLAR_ORGANIZATION_ID}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${POLAR_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer_portal_settings: {
        subscription: {
          update_plan: false,
          update_seats: false,
        },
        usage: {
          show: org.customer_portal_settings?.usage?.show ?? true,
        },
      },
      subscription_settings: {
        ...org.subscription_settings,
        allow_customer_updates: false,
      },
    }),
  })

  if (!updateRes.ok) {
    console.error('Failed to update organization:', await updateRes.text())
    process.exit(1)
  }

  const updated = await updateRes.json()
  console.log('Updated customer_portal_settings:', JSON.stringify(updated.customer_portal_settings, null, 2))
  console.log('Updated subscription_settings:', JSON.stringify(updated.subscription_settings, null, 2))
  console.log('\nPortal configured successfully. Plan changes and subscription modifications are now disabled.')
}

configurePortal().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
