import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    getPlatform: () => ipcRenderer.invoke('get-platform'),
    spawnApi: (port: number) => ipcRenderer.invoke('spawn-api', port),
    killApi: () => ipcRenderer.invoke('kill-api'),
    onApiReady: (callback: (port: number) => void) =>
        ipcRenderer.on('api-ready', (_event, port) => callback(port))
})