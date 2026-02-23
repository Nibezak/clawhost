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

interface Window {
    electronAPI: ElectronAPI
}