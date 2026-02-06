import type { Context } from 'hono'
import { hetzner } from '../../services/hetzner'

const getVolumePricing = async (c: Context) => {
  try {
    const pricing = await hetzner.getVolumePricing()
    return c.json({
      pricePerGbMonthly: Math.ceil(pricing.pricePerGbMonthly * 3 * 1000) / 1000, // 3x markup
      minSize: 10, // Hetzner minimum
      maxSize: 10240, // 10TB max
    })
  } catch (err) {
    console.error('Failed to fetch volume pricing:', err)
    return c.json({ error: 'Failed to fetch volume pricing' }, 500)
  }
}

export default getVolumePricing
