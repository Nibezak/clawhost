import type { ApiStatus } from '@/ts/Types'

interface SpawnApiOptions {
    port: number
    apiPath: string
}

interface SpawnApiResult {
    port: number
    kill: () => void
}

interface ElectronAPI {
    getAppVersion: () => Promise<string>
    getPlatform: () => Promise<string>
    spawnApi: (port: number) => Promise<void>
    killApi: () => Promise<void>
    onApiReady: (callback: (port: number) => void) => void
}

interface AppState {
    apiPort: number | null
    apiStatus: ApiStatus
    setApiPort: (port: number | null) => void
    setApiStatus: (status: ApiStatus) => void
}

export type { SpawnApiOptions, SpawnApiResult, ElectronAPI, AppState }