import { execSync, execFile } from 'child_process'
import fs from 'fs'
import path from 'path'
import configStore from '@/main/services/configStore'
import nodeBinary from '@/main/services/nodeBinary'

interface VersionEntry {
    version: string
    installed: boolean
    date: string | null
}

const listInstalled = (): string[] => {
    const versionsDir = path.join(configStore.getBaseDir(), 'versions')
    if (!fs.existsSync(versionsDir)) return []
    return fs.readdirSync(versionsDir).filter((name) => {
        const binPath = path.join(
            versionsDir,
            name,
            'node_modules',
            '.bin',
            'openclaw'
        )
        return fs.existsSync(binPath)
    })
}

const installVersion = (version: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const versionDir = configStore.getVersionDir(version)
        if (!fs.existsSync(versionDir)) {
            fs.mkdirSync(versionDir, { recursive: true })
        }

        const nodePath = nodeBinary.getNodeBinaryPath()
        const npmPath = nodeBinary.getNpmPath()

        execFile(
            npmPath,
            ['install', `openclaw@${version}`, '--prefix', versionDir],
            {
                env: {
                    ...process.env,
                    PATH: `${path.dirname(nodePath)}:${process.env.PATH}`
                },
                timeout: 120000
            },
            (error) => {
                if (error) {
                    try {
                        fs.rmSync(versionDir, { recursive: true, force: true })
                    } catch {}
                    reject(
                        new Error(
                            `Failed to install OpenClaw ${version}: ${error.message}`
                        )
                    )
                    return
                }
                resolve()
            }
        )
    })
}

const getAvailableVersions = async (): Promise<VersionEntry[]> => {
    try {
        const nodePath = nodeBinary.getNodeBinaryPath()
        const output = execSync(
            `${nodePath} -e "fetch('https://registry.npmjs.org/openclaw').then(r=>r.json()).then(d=>{const versions=Object.keys(d.versions).reverse();const times=d.time||{};console.log(JSON.stringify(versions.map(v=>({version:v,date:times[v]||null}))))})"`,
            { encoding: 'utf-8', timeout: 15000 }
        )
        const versions = JSON.parse(output.trim()) as Array<{
            version: string
            date: string | null
        }>
        const installed = new Set(listInstalled())
        return versions.map((v) => ({
            version: v.version,
            installed: installed.has(v.version),
            date: v.date
        }))
    } catch {
        const installed = listInstalled()
        return installed.map((v) => ({
            version: v,
            installed: true,
            date: null
        }))
    }
}

const getLatestVersion = async (): Promise<string | null> => {
    try {
        const nodePath = nodeBinary.getNodeBinaryPath()
        const output = execSync(
            `${nodePath} -e "fetch('https://registry.npmjs.org/openclaw/latest').then(r=>r.json()).then(d=>console.log(d.version))"`,
            { encoding: 'utf-8', timeout: 10000 }
        )
        return output.trim()
    } catch {
        return null
    }
}

const getVersionBinaryPath = (version: string): string => {
    return path.join(
        configStore.getVersionDir(version),
        'node_modules',
        '.bin',
        'openclaw'
    )
}

export default {
    listInstalled,
    installVersion,
    getAvailableVersions,
    getLatestVersion,
    getVersionBinaryPath
}