import type { IpcMainInvokeEvent } from 'electron'

import { ipcMain } from 'electron'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { configStore, processManager } from '@/main/services'

const DEFAULT_OPENCLAW_CONFIG = (gatewayToken: string) => ({
    gateway: {
        mode: 'local',
        auth: {
            mode: 'token',
            token: gatewayToken
        },
        controlUi: {
            allowInsecureAuth: true
        },
        trustedProxies: ['127.0.0.1', '::1']
    },
    channels: {
        whatsapp: { dmPolicy: 'open', allowFrom: ['*'] },
        telegram: { dmPolicy: 'open', allowFrom: ['*'] },
        discord: {},
        slack: {},
        signal: { dmPolicy: 'open', allowFrom: ['*'] }
    },
    agents: {
        defaults: {
            sandbox: { mode: 'off' }
        }
    }
})

const mapClawToResponse = (claw: ReturnType<typeof configStore.findClaw>) => {
    if (!claw) return null
    return {
        id: claw.id,
        name: claw.name,
        provider: 'local',
        status: processManager.isRunning(claw.id) ? 'running' : 'stopped',
        ip: 'localhost',
        planId: 'local',
        location: 'local',
        rootPassword: null,
        sshKeyId: null,
        providerServerId: null,
        subdomain: `local:${claw.port}`,
        gatewayToken: claw.gatewayToken,
        subscriptionStatus: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        volumes: [],
        ownerEmail: null,
        deletionScheduledAt: null,
        createdAt: claw.createdAt,
        port: claw.port
    }
}

const registerClawHandlers = (): void => {
    ipcMain.handle('getClaws', () => {
        const config = configStore.readConfig()
        return config.claws.map((claw) => mapClawToResponse(claw))
    })

    ipcMain.handle('getClaw', (_event: IpcMainInvokeEvent, id: string) => {
        const claw = configStore.findClaw(id)
        return mapClawToResponse(claw)
    })

    ipcMain.handle(
        'createClaw',
        (_event: IpcMainInvokeEvent, data: { name: string }) => {
            const config = configStore.readConfig()
            const nameRegex = /^[a-zA-Z0-9-]+$/
            if (!data.name || !nameRegex.test(data.name)) {
                throw new Error(
                    'Invalid claw name. Use only letters, numbers, and hyphens.'
                )
            }

            const duplicate = config.claws.find(
                (c) => c.name.toLowerCase() === data.name.toLowerCase()
            )
            if (duplicate) {
                throw new Error('A claw with this name already exists.')
            }

            const id = crypto.randomUUID()
            const port = configStore.getNextAvailablePort()
            const gatewayToken = crypto.randomBytes(32).toString('hex')
            const version = config.defaultVersion || ''

            const clawDir = configStore.getClawDir(data.name)
            fs.mkdirSync(clawDir, { recursive: true })
            fs.mkdirSync(path.join(clawDir, 'agents', 'main', 'agent'), {
                recursive: true
            })

            const openclawConfig = DEFAULT_OPENCLAW_CONFIG(gatewayToken)
            fs.writeFileSync(
                path.join(clawDir, 'openclaw.json'),
                JSON.stringify(openclawConfig, null, 4)
            )
            fs.writeFileSync(path.join(clawDir, '.env'), '')

            const newClaw = {
                id,
                name: data.name,
                port,
                version,
                gatewayToken,
                createdAt: new Date().toISOString()
            }

            configStore.addClaw(newClaw)
            return mapClawToResponse(newClaw)
        }
    )

    ipcMain.handle(
        'deleteClaw',
        async (_event: IpcMainInvokeEvent, id: string) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')

            if (processManager.isRunning(id)) {
                await processManager.stopGateway(id)
            }

            const clawDir = configStore.getClawDir(claw.name)
            if (fs.existsSync(clawDir)) {
                fs.rmSync(clawDir, { recursive: true, force: true })
            }

            configStore.removeClaw(id)
            return { success: true }
        }
    )

    ipcMain.handle(
        'renameClaw',
        (_event: IpcMainInvokeEvent, id: string, data: { name: string }) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')

            const nameRegex = /^[a-zA-Z0-9-]+$/
            if (!data.name || !nameRegex.test(data.name)) {
                throw new Error(
                    'Invalid claw name. Use only letters, numbers, and hyphens.'
                )
            }

            const config = configStore.readConfig()
            const duplicate = config.claws.find(
                (c) =>
                    c.id !== id &&
                    c.name.toLowerCase() === data.name.toLowerCase()
            )
            if (duplicate) {
                throw new Error('A claw with this name already exists.')
            }

            const oldDir = configStore.getClawDir(claw.name)
            const newDir = configStore.getClawDir(data.name)

            if (fs.existsSync(oldDir)) {
                fs.renameSync(oldDir, newDir)
            }

            configStore.updateClaw(id, { name: data.name })
            const updated = configStore.findClaw(id)
            return mapClawToResponse(updated)
        }
    )

    ipcMain.handle('syncClaw', (_event: IpcMainInvokeEvent, id: string) => {
        const claw = configStore.findClaw(id)
        if (!claw) throw new Error('Claw not found')
        return mapClawToResponse(claw)
    })

    ipcMain.handle(
        'cancelDeletion',
        (_event: IpcMainInvokeEvent, id: string) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')
            return mapClawToResponse(claw)
        }
    )

    ipcMain.handle(
        'hardDeleteClaw',
        async (_event: IpcMainInvokeEvent, id: string) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')

            if (processManager.isRunning(id)) {
                await processManager.stopGateway(id)
            }

            const clawDir = configStore.getClawDir(claw.name)
            if (fs.existsSync(clawDir)) {
                fs.rmSync(clawDir, { recursive: true, force: true })
            }

            configStore.removeClaw(id)
            return { success: true }
        }
    )

    ipcMain.handle('getNextAvailablePort', () => {
        return configStore.getNextAvailablePort()
    })
}

export default registerClawHandlers