import type { InitiateClawPurchaseBody } from '@/ts/Interfaces'
import type { AuthenticatedContext, BillingInterval, ProviderType } from '@/ts/Types'

import crypto from 'crypto'
import { eq, and, count, lt } from 'drizzle-orm'
import { inputValidation, clawProvider, billingInterval } from '@openclaw/shared'
import { db } from '@/db'
import { users, sshKeys, claws, pendingClaws } from '@/db/schema'
import { checkouts, customers } from '@/lib/polar'
import { generatePassword } from '@/controllers/claws/helpers'
import { getProvider } from '@/services/provider'
import { t } from '@openclaw/i18n'
import { ok, fail } from '@/lib/response'
import { getEnvironment } from '@/lib/environment'

const adjectives = [
    'cozy',
    'swift',
    'brave',
    'calm',
    'tiny',
    'wild',
    'warm',
    'cool',
    'happy',
    'lucky',
    'fuzzy',
    'snowy',
    'dusty',
    'misty',
    'sunny',
    'sleepy',
    'clever',
    'gentle',
    'mighty',
    'silent',
    'golden',
    'cosmic',
    'polar',
    'rusty',
    'nimble',
    'jolly',
    'witty',
    'noble',
    'vivid',
    'crisp'
]

const nouns = [
    'claw',
    'panda',
    'otter',
    'fox',
    'wolf',
    'bear',
    'falcon',
    'lynx',
    'raven',
    'crane',
    'pike',
    'owl',
    'hare',
    'frog',
    'moth',
    'finch',
    'cedar',
    'maple',
    'birch',
    'reef',
    'dune',
    'peak',
    'brook',
    'grove',
    'ember',
    'spark',
    'drift',
    'frost',
    'cloud',
    'storm'
]

let lastPendingCleanup = 0
const CLEANUP_INTERVAL = 60 * 60 * 1000

let namePool: string[] = []

const shufflePool = () => {
    namePool = []
    for (const adj of adjectives) {
        for (const noun of nouns) {
            namePool.push(`${adj}-${noun}`)
        }
    }
    for (let i = namePool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[namePool[i], namePool[j]] = [namePool[j], namePool[i]]
    }
}

const generateClawName = (): string => {
    if (namePool.length === 0) {
        shufflePool()
    }
    return namePool.pop()!
}

const PLAN_TO_POLAR: Record<string, string> = {
    'cx23': 'CX23',
    'cx33': 'CX33',
    'cx43': 'CX43',
    'cx53': 'CX53',
    'cpx11': 'CPX11',
    'cpx21': 'CPX21',
    'cpx31': 'CPX31',
    'cpx41': 'CPX41',
    'cpx51': 'CPX51',
    'cax11': 'CAX11',
    'cax21': 'CAX21',
    'cax31': 'CAX31',
    'cax41': 'CAX41',
    'ccx13': 'CCX13',
    'ccx23': 'CCX23',
    'ccx33': 'CCX33',
    'ccx43': 'CCX43',
    'ccx53': 'CCX53',
    'ccx63': 'CCX63',
    's-1vcpu-512mb-10gb': 'DC11',
    's-1vcpu-1gb': 'DC12',
    's-1vcpu-2gb': 'DC13',
    's-2vcpu-2gb': 'DC21',
    's-2vcpu-4gb': 'DC22',
    's-4vcpu-8gb': 'DC41',
    's-8vcpu-16gb': 'DC81',
    'vc2-1c-1gb': 'VC11',
    'vc2-1c-2gb': 'VC12',
    'vc2-2c-2gb': 'VC21',
    'vc2-2c-4gb': 'VC22',
    'vc2-4c-8gb': 'VC41',
    'vc2-6c-16gb': 'VC61',
    'vc2-8c-32gb': 'VC81',
    'vc2-16c-64gb': 'VC161',
    'vhf-1c-2gb': 'VF11',
    'vhf-2c-4gb': 'VF21',
    'vhf-3c-8gb': 'VF31',
    'vhf-4c-16gb': 'VF41',
    'vhf-8c-32gb': 'VF81',
    'vhf-12c-48gb': 'VF121',
    'vhp-1c-1gb-amd': 'VA11',
    'vhp-1c-2gb-amd': 'VA12',
    'vhp-2c-2gb-amd': 'VA21',
    'vhp-2c-4gb-amd': 'VA22',
    'vhp-4c-8gb-amd': 'VA41',
    'vhp-4c-12gb-amd': 'VA42',
    'vhp-8c-16gb-amd': 'VA81',
    'vhp-12c-24gb-amd': 'VA121'
}

const getPolarProductId = (
    planId: string,
    interval: BillingInterval = billingInterval.MONTH
): string | null => {
    const polarName = PLAN_TO_POLAR[planId.toLowerCase()]
    if (!polarName) return null

    const suffix = interval === billingInterval.YEAR ? '_YEARLY' : '_MONTHLY'
    const envKey = `POLAR_PRODUCT_${polarName}${suffix}`
    const envValue = process.env[envKey]

    if (envValue) return envValue
    else return null
}

const initiateClawPurchase = async (c: AuthenticatedContext) => {
    try {
        if (Date.now() - lastPendingCleanup > CLEANUP_INTERVAL) {
            await db
                .delete(pendingClaws)
                .where(lt(pendingClaws.expiresAt, new Date()))
            lastPendingCleanup = Date.now()
        }

        const userId = c.get('userId')
        const {
            name: rawName,
            provider: providerName,
            planId,
            location,
            password,
            sshKeyId,
            volumeSize,
            priceMonthly,
            billingInterval: rawBillingInterval
        } = await c.req.json<InitiateClawPurchaseBody>()

        const billingCycle = rawBillingInterval === billingInterval.YEAR ? billingInterval.YEAR : billingInterval.MONTH

        if (!planId || !location || !priceMonthly) {
            return fail(c, t('api.missingRequiredFields'), 400)
        }

        const validProviders: ProviderType[] = [
            'hetzner',
            'digitalocean',
            'vultr'
        ]
        if (
            providerName &&
            !validProviders.includes(providerName as ProviderType)
        ) {
            return fail(c, t('api.invalidProvider'), 400)
        }

        const resolvedProvider = (providerName ||
            clawProvider.hetzner) as ProviderType
        if (resolvedProvider !== clawProvider.hetzner) {
            try {
                const hetznerService = getProvider(
                    clawProvider.hetzner as ProviderType
                )
                const hetznerTypes = await hetznerService.getServerTypes()
                if (hetznerTypes.length > 0) {
                    return fail(c, t('api.providerNotAllowed'), 400)
                }
            } catch {}
        }

        const provider = getProvider(resolvedProvider)
        const [serverTypes, locations] = await Promise.all([
            provider.getServerTypes(),
            provider.getLocations()
        ])

        const selectedPlan = serverTypes.find((st) => st.name === planId)

        if (!selectedPlan) {
            return fail(c, t('api.invalidPlan'), 400)
        }

        if (selectedPlan.memory < inputValidation.MIN_MEMORY_GB.MIN) {
            return fail(c, t('api.planBelowMinimumMemory'), 400)
        }

        const selectedLocation = locations.find((l) => l.id === location)
        if (!selectedLocation || selectedLocation.disabled) {
            return fail(c, t('api.invalidLocation'), 400)
        }

        if (provider.getRawServerTypes && provider.getDatacenters) {
            const [rawTypes, datacenters] = await Promise.all([
                provider.getRawServerTypes(),
                provider.getDatacenters()
            ])
            const serverTypeId = rawTypes.find(
                (st) => st.name === planId
            )?.id
            if (serverTypeId) {
                const available = datacenters.some(
                    (dc) =>
                        dc.locationName === location &&
                        dc.availableServerTypeIds.includes(serverTypeId)
                )
                if (!available) {
                    return fail(c, t('api.planNotAvailableAtLocation'), 400)
                }
            }
        }

        const name = rawName || generateClawName()

        if (
            volumeSize !== undefined &&
            (volumeSize < inputValidation.VOLUME_SIZE.MIN ||
                volumeSize > inputValidation.VOLUME_SIZE.MAX)
        ) {
            return fail(
                c,
                t('api.volumeSizeInvalid', {
                    min: inputValidation.VOLUME_SIZE.MIN,
                    max: inputValidation.VOLUME_SIZE.MAX
                }),
                400
            )
        }

        const [clawCountResult, userResult, sshKeyResult] = await Promise.all([
            db
                .select({ value: count() })
                .from(claws)
                .where(eq(claws.userId, userId)),
            db.select().from(users).where(eq(users.id, userId)).limit(1),
            sshKeyId
                ? db
                      .select()
                      .from(sshKeys)
                      .where(
                          and(
                              eq(sshKeys.id, sshKeyId),
                              eq(sshKeys.userId, userId)
                          )
                      )
                      .limit(1)
                : Promise.resolve(null)
        ])

        if (clawCountResult[0].value >= inputValidation.CLAWS_PER_ACCOUNT.MAX) {
            return fail(
                c,
                t('api.clawLimitReached', {
                    max: inputValidation.CLAWS_PER_ACCOUNT.MAX
                }),
                400
            )
        }

        if (!userResult[0]) {
            return fail(c, t('api.userNotFound'), 404)
        }

        if (sshKeyId && (!sshKeyResult || !sshKeyResult[0])) {
            return fail(c, t('api.sshKeyNotFound'), 404)
        }

        let polarCustomerId = userResult[0].polarCustomerId

        if (!polarCustomerId) {
            const customer = await customers.getOrCreate({
                email: userResult[0].email,
                name: userResult[0].name || undefined,
                externalId: userId
            })
            polarCustomerId = customer.id

            await db
                .update(users)
                .set({ polarCustomerId })
                .where(eq(users.id, userId))
        }

        const productId = getPolarProductId(planId, billingCycle)
        if (!productId) {
            return fail(c, t('api.paymentNotConfigured'), 400)
        }

        const pendingId = crypto.randomUUID()
        const finalPassword = password || generatePassword()

        const checkout = await checkouts.create({
            productId,
            customerEmail: userResult[0].email,
            customerId: polarCustomerId,
            metadata: {
                pendingClawId: pendingId,
                userId,
                planId,
                location,
                name,
                billingInterval: billingCycle,
                environment: getEnvironment(c)
            }
        })

        const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

        await db.insert(pendingClaws).values({
            id: pendingId,
            userId,
            checkoutId: checkout.id,
            name,
            provider: providerName || 'hetzner',
            planId,
            location,
            rootPassword: finalPassword,
            sshKeyId: sshKeyId || null,
            volumeSize: volumeSize || null,
            priceMonthly: Math.round(priceMonthly * 100),
            billingInterval: billingCycle,
            expiresAt
        })

        return ok(
            c,
            {
                checkoutUrl: checkout.url,
                checkoutId: checkout.id,
                pendingClawId: pendingId,
                expiresAt: expiresAt.toISOString()
            },
            t('api.clawPurchaseInitiated')
        )
    } catch {
        return fail(c, t('api.failedToInitiatePurchase'), 500)
    }
}

export default initiateClawPurchase