import type { Context } from 'hono'
import { hetzner } from '../../services/hetzner'

const getPlans = async (c: Context) => {
  try {
    const serverTypes = await hetzner.getServerTypes()

    // Add 20% markup to all server types
    const plans = serverTypes
      .map((t) => ({
        id: t.name,
        name: t.description,
        cpu: t.cores,
        memory: t.memory,
        disk: t.disk,
        priceHourly: Math.ceil(t.priceHourly * 1.2 * 1000) / 1000, // 20% markup
        priceMonthly: Math.ceil(t.priceMonthly * 1.2 * 100) / 100, // 20% markup
        architecture: t.architecture,
      }))
      .sort((a, b) => a.priceMonthly - b.priceMonthly)

    return c.json(plans)
  } catch (err) {
    console.error('Failed to fetch plans:', err)
    return c.json({ error: 'Failed to fetch plans' }, 500)
  }
}

export default getPlans
