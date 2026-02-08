import type { Context } from 'hono'
import { hetzner } from '@/services/hetzner'
import { t } from '@openclaw/i18n'

const getLocations = async (c: Context) => {
    try {
        const locations = await hetzner.getLocations()
        return c.json(locations)
    } catch (err) {
        console.error('Failed to fetch locations:', err)
        return c.json({ error: t('api.failedToFetchLocations') }, 500)
    }
}

export default getLocations