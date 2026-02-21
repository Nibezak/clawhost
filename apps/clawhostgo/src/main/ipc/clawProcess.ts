import type { IpcMainInvokeEvent } from 'electron'

import { ipcMain } from 'electron'
import { configStore, processManager } from '@/main/services'

const registerClawProcessHandlers = (): void => {
    ipcMain.handle(
        'startClaw',
        async (_event: IpcMainInvokeEvent, id: string) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')

            if (!claw.version) {
                throw new Error(
                    'No OpenClaw version assigned to this claw. Install a version first.'
                )
            }

            const clawDir = configStore.getClawDir(claw.name)
            await processManager.startGateway(
                claw.id,
                clawDir,
                claw.port,
                claw.version,
                claw.gatewayToken
            )

            return {
                id: claw.id,
                name: claw.name,
                provider: 'local',
                status: 'running',
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
    )

    ipcMain.handle(
        'stopClaw',
        async (_event: IpcMainInvokeEvent, id: string) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')

            await processManager.stopGateway(id)

            return {
                id: claw.id,
                name: claw.name,
                provider: 'local',
                status: 'stopped',
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
    )

    ipcMain.handle(
        'restartClaw',
        async (_event: IpcMainInvokeEvent, id: string) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')

            if (!claw.version) {
                throw new Error('No OpenClaw version assigned to this claw.')
            }

            const clawDir = configStore.getClawDir(claw.name)
            await processManager.restartGateway(
                claw.id,
                clawDir,
                claw.port,
                claw.version,
                claw.gatewayToken
            )

            return {
                id: claw.id,
                name: claw.name,
                provider: 'local',
                status: 'running',
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
    )

    ipcMain.handle(
        'getClawDiagnostics',
        (_event: IpcMainInvokeEvent, id: string) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')

            const running = processManager.isRunning(id)
            const info = processManager.getProcessInfo(id)

            const service = running
                ? `openclaw-gateway: active (running)\n  PID: ${info?.pid || 'unknown'}`
                : 'openclaw-gateway: inactive (stopped)'

            const port = running
                ? `Port ${claw.port}: listening`
                : `Port ${claw.port}: not listening`

            const memInfo = process.memoryUsage()
            const memory = `Heap Used: ${Math.round(memInfo.heapUsed / 1024 / 1024)}MB / Heap Total: ${Math.round(memInfo.heapTotal / 1024 / 1024)}MB`

            return { service, port, memory }
        }
    )

    ipcMain.handle('getClawLogs', (_event: IpcMainInvokeEvent, id: string) => {
        const claw = configStore.findClaw(id)
        if (!claw) throw new Error('Claw not found')

        const clawDir = configStore.getClawDir(claw.name)
        const logs = processManager.getLogs(clawDir, 100)
        return { logs }
    })

    ipcMain.handle(
        'repairClaw',
        async (_event: IpcMainInvokeEvent, id: string) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')

            if (!claw.version) {
                throw new Error('No OpenClaw version assigned.')
            }

            const clawDir = configStore.getClawDir(claw.name)
            await processManager.restartGateway(
                claw.id,
                clawDir,
                claw.port,
                claw.version,
                claw.gatewayToken
            )

            return { success: true }
        }
    )

    ipcMain.handle(
        'reinstallClaw',
        async (_event: IpcMainInvokeEvent, id: string) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')

            if (processManager.isRunning(id)) {
                await processManager.stopGateway(id)
            }

            if (claw.version) {
                const clawDir = configStore.getClawDir(claw.name)
                await processManager.startGateway(
                    claw.id,
                    clawDir,
                    claw.port,
                    claw.version,
                    claw.gatewayToken
                )
            }

            return { success: true }
        }
    )
}

export default registerClawProcessHandlers