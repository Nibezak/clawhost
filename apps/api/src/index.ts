import 'dotenv/config'

import type { Server } from 'http'
import { serve } from '@hono/node-server'
import { readFileSync } from 'fs'
import { resolve } from 'path'

import app from '@/app'
import setupTerminalSocket from '@/services/terminalSocket'

const port = Number(process.env.PORT)
const pkg = JSON.parse(readFileSync(resolve(import.meta.dirname, '../package.json'), 'utf-8'))

const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`
const green = (s: string) => `\x1b[32m${s}\x1b[0m`

const server = serve(
    {
        fetch: app.fetch,
        port,
        hostname: '0.0.0.0'
    },
    () => {
        console.info('')
        console.info(`  ${cyan(bold('OPENCLAW API'))}  ${green(`v${pkg.version}`)}`)
        console.info('')
        console.info(`  ${dim('➜')}  ${bold('Local:')}   ${cyan(`http://localhost:${port}/`)}`)
        console.info(`  ${dim('➜')}  ${bold('Network:')} ${cyan(`http://0.0.0.0:${port}/`)}`)
        console.info('')
    }
)

setupTerminalSocket(server as Server)