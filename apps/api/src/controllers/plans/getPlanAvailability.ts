import type { Context } from 'hono'

import { hetzner } from '@/services/hetzner'
import { t } from '@openclaw/i18n'

const customPrices: Record<string, number> = {
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
}

const getPlanAvailability = async (c: Context) => {
    try {
        const [serverTypes, datacenters] = await Promise.all([
            hetzner.getRawServerTypes(),
            hetzner.getDatacenters()
        ])

        const nameToId = new Map<string, number>()
        for (const st of serverTypes) {
            nameToId.set(st.name, st.id)
        }

        const availability: Record<string, string[]> = {}

        for (const planName of Object.keys(customPrices)) {
            const serverTypeId = nameToId.get(planName)
            if (!serverTypeId) continue

            const locations = new Set<string>()
            for (const dc of datacenters) {
                if (dc.server_types.available.includes(serverTypeId)) {
                    locations.add(dc.location.name)
                }
            }

            availability[planName] = Array.from(locations)
        }

        return c.json(availability)
    } catch (err) {
        console.error('Failed to fetch plan availability:', err)
        return c.json({ error: t('api.failedToFetchPlanAvailability') }, 500)
    }
}

export default getPlanAvailability