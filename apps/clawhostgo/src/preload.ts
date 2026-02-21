import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    invoke: (channel: string, ...args: unknown[]) =>
        ipcRenderer.invoke(channel, ...args),
    isDesktop: true,
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    getPlatform: () => ipcRenderer.invoke('get-platform')
})