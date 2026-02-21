import type { IpcMainInvokeEvent } from 'electron'

import { ipcMain } from 'electron'
import { configStore, versionManager } from '@/main/services'

const registerClawVersionHandlers = (): void => {
    ipcMain.handle(
        'getClawVersion',
        (_event: IpcMainInvokeEvent, id: string) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')
            return { version: claw.version || null }
        }
    )

    ipcMain.handle(
        'getClawVersions',
        async (_event: IpcMainInvokeEvent, id: string) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')

            const available = await versionManager.getAvailableVersions()
            const latest = await versionManager.getLatestVersion()

            return {
                versions: available,
                currentVersion: claw.version || null,
                latestVersion: latest
            }
        }
    )

    ipcMain.handle(
        'installClawVersion',
        async (_event: IpcMainInvokeEvent, id: string, version: string) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')

            await versionManager.installVersion(version)

            configStore.updateClaw(id, { version })

            const config = configStore.readConfig()
            if (!config.defaultVersion) {
                config.defaultVersion = version
                configStore.writeConfig(config)
            }

            return { success: true, version }
        }
    )

    ipcMain.handle(
        'browseClawHubSkills',
        async (
            _event: IpcMainInvokeEvent,
            id: string,
            params?: { query?: string; page?: number; limit?: number }
        ) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')

            try {
                const queryStr = new URLSearchParams()
                if (params?.query) queryStr.set('query', params.query)
                if (params?.page) queryStr.set('page', String(params.page))
                if (params?.limit) queryStr.set('limit', String(params.limit))

                const url = `http://localhost:${claw.port}/clawhub/skills${queryStr.toString() ? `?${queryStr}` : ''}`
                const res = await fetch(url)
                return await res.json()
            } catch {
                return { skills: [], total: 0, page: 1, limit: 20 }
            }
        }
    )

    ipcMain.handle(
        'getClawHubInstalled',
        async (
            _event: IpcMainInvokeEvent,
            id: string,
            data?: { agentId?: string }
        ) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')

            try {
                const body = data?.agentId ? { agentId: data.agentId } : {}
                const res = await fetch(
                    `http://localhost:${claw.port}/clawhub/installed`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    }
                )
                return await res.json()
            } catch {
                return { skills: [] }
            }
        }
    )

    ipcMain.handle(
        'installClawHubSkill',
        async (
            _event: IpcMainInvokeEvent,
            id: string,
            data: Record<string, unknown>
        ) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')

            const res = await fetch(
                `http://localhost:${claw.port}/clawhub/install`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }
            )
            return await res.json()
        }
    )

    ipcMain.handle(
        'removeClawHubSkill',
        async (
            _event: IpcMainInvokeEvent,
            id: string,
            data: Record<string, unknown>
        ) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')

            const res = await fetch(
                `http://localhost:${claw.port}/clawhub/remove`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }
            )
            return await res.json()
        }
    )

    ipcMain.handle(
        'updateClawHubSkill',
        async (
            _event: IpcMainInvokeEvent,
            id: string,
            data: Record<string, unknown>
        ) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')

            const res = await fetch(
                `http://localhost:${claw.port}/clawhub/update`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }
            )
            return await res.json()
        }
    )

    ipcMain.handle(
        'checkClawHubUpdates',
        async (
            _event: IpcMainInvokeEvent,
            id: string,
            data?: { agentId?: string }
        ) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')

            try {
                const body = data?.agentId ? { agentId: data.agentId } : {}
                const res = await fetch(
                    `http://localhost:${claw.port}/clawhub/updates`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    }
                )
                return await res.json()
            } catch {
                return { updates: [] }
            }
        }
    )
}

export default registerClawVersionHandlers