import type { Context } from 'hono'
import { hetzner } from '../../services/hetzner'

// Custom pricing per plan (in dollars) - order defines display order
const planOrder = [
  // CX series - Best value shared vCPU
  'cx23', 'cx33', 'cx43', 'cx53',
  // CPX series - AMD shared vCPU
  'cpx11', 'cpx21', 'cpx31', 'cpx41', 'cpx51',
  // CAX series - ARM efficient
  'cax11', 'cax21', 'cax31', 'cax41',
  // CCX series - Dedicated CPU premium
  'ccx13', 'ccx23', 'ccx33', 'ccx43', 'ccx53', 'ccx63',
]

const customPrices: Record<string, number> = {
  cx23: 10, cx33: 15, cx43: 20, cx53: 30,
  cpx11: 15, cpx21: 20, cpx31: 30, cpx41: 50, cpx51: 75,
  cax11: 10, cax21: 15, cax31: 25, cax41: 50,
  ccx13: 25, ccx23: 50, ccx33: 100, ccx43: 150, ccx53: 250, ccx63: 350,
}

const getPlans = async (c: Context) => {
  try {
    const serverTypes = await hetzner.getServerTypes()

    // Only include plans with custom pricing, sorted by planOrder
    const plans = serverTypes
      .filter((t) => customPrices[t.name] !== undefined)
      .map((t) => ({
        id: t.name,
        name: t.description,
        cpu: t.cores,
        memory: t.memory,
        disk: t.disk,
        priceMonthly: customPrices[t.name],
        architecture: t.architecture,
      }))
      .sort((a, b) => planOrder.indexOf(a.id) - planOrder.indexOf(b.id))

    return c.json(plans)
  } catch (err) {
    console.error('Failed to fetch plans:', err)
    return c.json({ error: 'Failed to fetch plans' }, 500)
  }
}

export default getPlans
