import type { Server } from 'http'

import { serve } from '@hono/node-server'
import app from '@/app'
import setupTerminalSocket from '@/services/terminalSocket'

const port = Number(process.env.PORT)

const server = serve({
    fetch: app.fetch,
    port
})

setupTerminalSocket(server as Server)