interface ElectronAPI {
    invoke: (channel: string, ...args: unknown[]) => Promise<unknown>
    isDesktop: boolean
    getAppVersion: () => Promise<string>
    getPlatform: () => Promise<string>
}

interface LocalClawConfig {
    id: string
    name: string
    port: number
    version: string
    gatewayToken: string
    createdAt: string
}

interface ConfigFile {
    claws: LocalClawConfig[]
    defaultVersion: string
    portRange: {
        min: number
        max: number
    }
}

export type { ElectronAPI, LocalClawConfig, ConfigFile }