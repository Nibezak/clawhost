interface ElectronAPI {
    getAppVersion: () => Promise<string>
    getPlatform: () => Promise<string>
    spawnApi: (port: number) => Promise<void>
    killApi: () => Promise<void>
    onApiReady: (callback: (port: number) => void) => void
}

interface Window {
    electronAPI: ElectronAPI
}