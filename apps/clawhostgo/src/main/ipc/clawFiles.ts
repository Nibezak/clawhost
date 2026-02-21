import type { IpcMainInvokeEvent } from 'electron'

import { ipcMain } from 'electron'
import fs from 'fs'
import path from 'path'
import { configStore } from '@/main/services'

const isPathSafe = (clawDir: string, filePath: string): boolean => {
    const resolved = path.resolve(clawDir, filePath)
    return resolved.startsWith(clawDir)
}

const getFileType = (name: string): string => {
    const ext = path.extname(name).toLowerCase()
    const typeMap: Record<string, string> = {
        '.json': 'json',
        '.yaml': 'yaml',
        '.yml': 'yaml',
        '.md': 'markdown',
        '.js': 'javascript',
        '.ts': 'typescript',
        '.txt': 'text',
        '.env': 'env',
        '.log': 'log',
        '.sh': 'shell',
        '.py': 'python',
        '.toml': 'toml',
        '.cfg': 'config',
        '.conf': 'config',
        '.ini': 'config'
    }
    return typeMap[ext] || 'text'
}

const registerClawFileHandlers = (): void => {
    ipcMain.handle(
        'listClawFiles',
        (_event: IpcMainInvokeEvent, id: string, data?: { path?: string }) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')

            const clawDir = configStore.getClawDir(claw.name)
            const targetDir = data?.path
                ? path.join(clawDir, data.path)
                : clawDir

            if (!isPathSafe(clawDir, data?.path || '.')) {
                throw new Error('Invalid path')
            }

            if (!fs.existsSync(targetDir)) {
                return { files: [] }
            }

            const entries = fs.readdirSync(targetDir, { withFileTypes: true })
            const files = entries
                .filter((e) => !e.name.startsWith('.') || e.name === '.env')
                .map((entry) => ({
                    name: entry.name,
                    path: path.relative(
                        clawDir,
                        path.join(targetDir, entry.name)
                    ),
                    isDirectory: entry.isDirectory(),
                    type: entry.isDirectory()
                        ? 'directory'
                        : getFileType(entry.name),
                    size: entry.isDirectory()
                        ? 0
                        : fs.statSync(path.join(targetDir, entry.name)).size
                }))

            return { files }
        }
    )

    ipcMain.handle(
        'readClawFile',
        (_event: IpcMainInvokeEvent, id: string, data: { path: string }) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')

            const clawDir = configStore.getClawDir(claw.name)
            if (!isPathSafe(clawDir, data.path)) {
                throw new Error('Invalid path')
            }

            const filePath = path.join(clawDir, data.path)
            if (!fs.existsSync(filePath)) {
                throw new Error('File not found')
            }

            const content = fs.readFileSync(filePath, 'utf-8')
            return { content, type: getFileType(data.path) }
        }
    )

    ipcMain.handle(
        'updateClawFile',
        (
            _event: IpcMainInvokeEvent,
            id: string,
            data: { path: string; content: string }
        ) => {
            const claw = configStore.findClaw(id)
            if (!claw) throw new Error('Claw not found')

            const clawDir = configStore.getClawDir(claw.name)
            if (!isPathSafe(clawDir, data.path)) {
                throw new Error('Invalid path')
            }

            const filePath = path.join(clawDir, data.path)
            const dir = path.dirname(filePath)
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true })
            }

            fs.writeFileSync(filePath, data.content)
            return { success: true }
        }
    )

    ipcMain.handle('exportClaw', (_event: IpcMainInvokeEvent, id: string) => {
        const claw = configStore.findClaw(id)
        if (!claw) throw new Error('Claw not found')

        const clawDir = configStore.getClawDir(claw.name)
        return { path: clawDir }
    })
}

export default registerClawFileHandlers