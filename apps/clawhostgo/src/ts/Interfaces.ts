interface ElectronAPI {
    invoke: (channel: string, ...args: unknown[]) => Promise<unknown>
    isDesktop: boolean
    getAppVersion: () => Promise<string>
    getPlatform: () => Promise<string>
    openExternal: (url: string) => Promise<void>
    openWindowed: (url: string) => Promise<void>
    getDnsStatus: () => Promise<boolean>
    setupDns: () => Promise<boolean>
}

interface LocalClawConfig {
    id: string
    name: string
    port: number
    version: string
    gatewayToken: string
    subdomain: string
    createdAt: string
}

interface ConfigFile {
    claws: LocalClawConfig[]
    defaultVersion: string
    portRange: {
        min: number
        max: number
    }
    userName?: string
    createdAt?: string
    setupComplete?: boolean
}

interface CertPaths {
    key: string
    cert: string
    ca: string
}

interface CreateClawData {
    name: string
}

interface RenameClawData {
    name: string
}

interface ReadClawFileData {
    path: string
}

interface UpdateProfileData {
    name?: string
}

export type {
    ElectronAPI,
    LocalClawConfig,
    ConfigFile,
    CertPaths,
    CreateClawData,
    RenameClawData,
    ReadClawFileData,
    UpdateProfileData
}