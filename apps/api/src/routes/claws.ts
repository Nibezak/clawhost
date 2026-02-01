import { Hono } from 'hono'
import {
  getClaws,
  getClaw,
  createClaw,
  syncClaw,
  startClaw,
  stopClaw,
  restartClaw,
  deleteClaw,
} from '../controllers/claws'

const app = new Hono<{ Variables: { userId: string } }>()

app.get('/', getClaws)
app.get('/:id', getClaw)
app.post('/', createClaw)
app.post('/:id/sync', syncClaw)
app.post('/:id/start', startClaw)
app.post('/:id/stop', stopClaw)
app.post('/:id/restart', restartClaw)
app.delete('/:id', deleteClaw)

export default app
