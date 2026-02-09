import { Hono } from 'hono'
import {
    getClaws,
    getClaw,
    createClaw,
    initiateClawPurchase,
    syncClaw,
    startClaw,
    stopClaw,
    restartClaw,
    deleteClaw,
    cancelDeletion,
    hardDeleteClaw,
    getClawDiagnostics,
    getClawLogs,
    repairClaw,
    getClawConfig,
    updateClawConfig
} from '@/controllers/claws'

const app = new Hono<{ Variables: { userId: string } }>()

app.get('/', getClaws)
app.get('/:id', getClaw)
app.post('/', createClaw) // Direct creation (for free tier or testing)
app.post('/purchase', initiateClawPurchase) // Paid creation with Polar checkout
app.post('/:id/sync', syncClaw)
app.post('/:id/start', startClaw)
app.post('/:id/stop', stopClaw)
app.post('/:id/restart', restartClaw)
app.post('/:id/cancel-deletion', cancelDeletion)
app.post('/:id/hard-delete', hardDeleteClaw)
app.post('/:id/diagnostics/status', getClawDiagnostics)
app.post('/:id/diagnostics/logs', getClawLogs)
app.post('/:id/diagnostics/repair', repairClaw)
app.post('/:id/config', getClawConfig)
app.put('/:id/config', updateClawConfig)
app.delete('/:id', deleteClaw)

export default app