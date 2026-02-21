import path from 'path'
import { app } from 'electron'
import { execSync } from 'child_process'

const getNodeBinaryPath = (): string => {
    if (!app.isPackaged) {
        try {
            return execSync('which node', { encoding: 'utf-8' }).trim()
        } catch {
            return process.execPath
        }
    }
    const platform = process.platform
    const binary = platform === 'win32' ? 'node.exe' : 'node'
    return path.join(process.resourcesPath, 'node', 'bin', binary)
}

const getNpmPath = (): string => {
    if (!app.isPackaged) {
        try {
            return execSync('which npm', { encoding: 'utf-8' }).trim()
        } catch {
            return 'npm'
        }
    }
    const platform = process.platform
    const npmBin = platform === 'win32' ? 'npm.cmd' : 'npm'
    return path.join(process.resourcesPath, 'node', 'bin', npmBin)
}

export default { getNodeBinaryPath, getNpmPath }