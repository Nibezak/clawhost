import type { Context } from 'hono'
import { hetzner } from '@/services/hetzner'

const getLocations = async (c: Context) => {
  try {
    const locations = await hetzner.getLocations()
    return c.json(locations)
  } catch (err) {
    console.error('Failed to fetch locations:', err)
    return c.json({ error: 'Failed to fetch locations' }, 500)
  }
}

export default getLocations
