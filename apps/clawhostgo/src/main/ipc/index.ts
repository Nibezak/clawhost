import { ipcMain, app, shell, BrowserWindow } from 'electron'
import registerClawHandlers from '@/main/ipc/claws'
import registerClawProcessHandlers from '@/main/ipc/clawProcess'
import registerClawConfigHandlers from '@/main/ipc/clawConfig'
import registerClawFileHandlers from '@/main/ipc/clawFiles'
import registerClawVersionHandlers from '@/main/ipc/clawVersions'
import registerStubHandlers from '@/main/ipc/stubs'
import { dnsResolver } from '@/main/services'

const registerAllHandlers = (): void => {
    ipcMain.handle('get-app-version', () => app.getVersion())
    ipcMain.handle('get-platform', () => process.platform)
    ipcMain.handle('open-external', (_event: unknown, url: string) =>
        shell.openExternal(url)
    )
    ipcMain.handle('open-windowed', (_event: unknown, url: string) => {
        const win = new BrowserWindow({
            width: 1280,
            height: 800,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true
            }
        })
        win.setMenuBarVisibility(false)
        win.loadURL(url)
    })
    ipcMain.handle('getDnsStatus', () => dnsResolver.isDnsSetup())
    ipcMain.handle('setupDns', () => dnsResolver.setupResolver())
    registerClawHandlers()
    registerClawProcessHandlers()
    registerClawConfigHandlers()
    registerClawFileHandlers()
    registerClawVersionHandlers()
    registerStubHandlers()
}

export default registerAllHandlers