import type { ChildProcess } from 'child_process'

import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import configStore from '@/main/services/configStore'
import nodeBinary from '@/main/services/nodeBinary'

const processes = new Map<string, ChildProcess>()

const parseEnvFile = (envPath: string): Record<string, string> => {
    const env: Record<string, string> = {}
    if (!fs.existsSync(envPath)) return env
    const content = fs.readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const eqIndex = trimmed.indexOf('=')
        if (eqIndex === -1) continue
        const key = trimmed.slice(0, eqIndex).trim()
        const value = trimmed.slice(eqIndex + 1).trim()
        env[key] = value
    }
    return env
}

const startGateway = async (
    clawId: string,
    clawDir: string,
    port: number,
    version: string,
    token: string
): Promise<void> => {
    if (processes.has(clawId)) {
        await stopGateway(clawId)
    }

    const versionDir = configStore.getVersionDir(version)
    const openclawBin = path.join(
        versionDir,
        'node_modules',
        '.bin',
        'openclaw'
    )

    if (!fs.existsSync(openclawBin)) {
        throw new Error(`OpenClaw version ${version} is not installed`)
    }

    const nodePath = nodeBinary.getNodeBinaryPath()
    const envPath = path.join(clawDir, '.env')
    const logPath = path.join(clawDir, 'gateway.log')
    const clawEnv = parseEnvFile(envPath)

    const logStream = fs.createWriteStream(logPath, { flags: 'a' })

    const child = spawn(
        nodePath,
        [openclawBin, 'gateway', '--port', String(port)],
        {
            cwd: clawDir,
            env: {
                ...process.env,
                ...clawEnv,
                OPENCLAW_GATEWAY_TOKEN: token,
                NODE_ENV: 'production'
            },
            stdio: ['ignore', 'pipe', 'pipe'],
            detached: false
        }
    )

    if (child.stdout) child.stdout.pipe(logStream)
    if (child.stderr) child.stderr.pipe(logStream)

    child.on('exit', (code) => {
        processes.delete(clawId)
        logStream.end()
        if (code !== 0 && code !== null) {
            const timestamp = new Date().toISOString()
            fs.appendFileSync(
                logPath,
                `\n[${timestamp}] Process exited with code ${code}\n`
            )
        }
    })

    child.on('error', (err) => {
        processes.delete(clawId)
        logStream.end()
        const timestamp = new Date().toISOString()
        fs.appendFileSync(
            path.join(clawDir, 'gateway.log'),
            `\n[${timestamp}] Process error: ${err.message}\n`
        )
    })

    processes.set(clawId, child)
}

const stopGateway = async (clawId: string): Promise<void> => {
    const child = processes.get(clawId)
    if (!child) return

    return new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
            child.kill('SIGKILL')
            processes.delete(clawId)
            resolve()
        }, 5000)

        child.on('exit', () => {
            clearTimeout(timeout)
            processes.delete(clawId)
            resolve()
        })

        child.kill('SIGTERM')
    })
}

const restartGateway = async (
    clawId: string,
    clawDir: string,
    port: number,
    version: string,
    token: string
): Promise<void> => {
    await stopGateway(clawId)
    await startGateway(clawId, clawDir, port, version, token)
}

const isRunning = (clawId: string): boolean => {
    const child = processes.get(clawId)
    if (!child) return false
    return !child.killed && child.exitCode === null
}

const getProcessInfo = (clawId: string): { pid: number } | null => {
    const child = processes.get(clawId)
    if (!child || child.killed || child.exitCode !== null) return null
    return { pid: child.pid || 0 }
}

const getLogs = (clawDir: string, lines: number = 100): string => {
    const logPath = path.join(clawDir, 'gateway.log')
    if (!fs.existsSync(logPath)) return ''
    const content = fs.readFileSync(logPath, 'utf-8')
    const allLines = content.split('\n')
    return allLines.slice(-lines).join('\n')
}

const stopAll = async (): Promise<void> => {
    const stopPromises = Array.from(processes.keys()).map((id) =>
        stopGateway(id)
    )
    await Promise.all(stopPromises)
}

export default {
    startGateway,
    stopGateway,
    restartGateway,
    isRunning,
    getProcessInfo,
    getLogs,
    stopAll
}