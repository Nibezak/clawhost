import { Hono } from 'hono'
import { getPlans, getLocations, getVolumePricing } from '@/controllers/plans'

const app = new Hono()

app.get('/', getPlans)
app.get('/locations', getLocations)
app.get('/volume-pricing', getVolumePricing)

export default app