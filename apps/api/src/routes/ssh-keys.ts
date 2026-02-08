import { Hono } from 'hono'
import { getSSHKeys, createSSHKey, deleteSSHKey } from '@/controllers/ssh-keys'

const app = new Hono<{ Variables: { userId: string } }>()

app.get('/', getSSHKeys)
app.post('/', createSSHKey)
app.delete('/:id', deleteSSHKey)

export default app