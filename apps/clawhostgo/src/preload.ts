import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    invoke: (channel: string, ...args: unknown[]) =>
        ipcRenderer.invoke(channel, ...args),
    isDesktop: true,
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    getPlatform: () => ipcRenderer.invoke('get-platform'),
    openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
    openWindowed: (url: string) => ipcRenderer.invoke('open-windowed', url),
    getDnsStatus: () => ipcRenderer.invoke('getDnsStatus'),
    setupDns: () => ipcRenderer.invoke('setupDns')
})