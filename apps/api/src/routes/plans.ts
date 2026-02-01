import { Hono } from 'hono'
import { hetzner } from '../services/hetzner'

const app = new Hono()

// Get all available server types with 20% markup
app.get('/', async (c) => {
  try {
    const serverTypes = await hetzner.getServerTypes()

    // Add 20% markup to all server types
    const plans = serverTypes
      .map(t => ({
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
})

// Get all available locations
app.get('/locations', async (c) => {
  try {
    const locations = await hetzner.getLocations()
    return c.json(locations)
  } catch (err) {
    console.error('Failed to fetch locations:', err)
    return c.json({ error: 'Failed to fetch locations' }, 500)
  }
})

// Get volume pricing with 20% markup
app.get('/volume-pricing', async (c) => {
  try {
    const pricing = await hetzner.getVolumePricing()
    return c.json({
      pricePerGbMonthly: Math.ceil(pricing.pricePerGbMonthly * 1.2 * 1000) / 1000, // 20% markup
      minSize: 10, // Hetzner minimum
      maxSize: 10240, // 10TB max
    })
  } catch (err) {
    console.error('Failed to fetch volume pricing:', err)
    return c.json({ error: 'Failed to fetch volume pricing' }, 500)
  }
})

export default app
