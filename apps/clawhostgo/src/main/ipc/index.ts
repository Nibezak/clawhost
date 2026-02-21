import { ipcMain, app } from 'electron'
import registerClawHandlers from '@/main/ipc/claws'
import registerClawProcessHandlers from '@/main/ipc/clawProcess'
import registerClawConfigHandlers from '@/main/ipc/clawConfig'
import registerClawFileHandlers from '@/main/ipc/clawFiles'
import registerClawVersionHandlers from '@/main/ipc/clawVersions'
import registerStubHandlers from '@/main/ipc/stubs'

const registerAllHandlers = (): void => {
    ipcMain.handle('get-app-version', () => app.getVersion())
    ipcMain.handle('get-platform', () => process.platform)

    registerClawHandlers()
    registerClawProcessHandlers()
    registerClawConfigHandlers()
    registerClawFileHandlers()
    registerClawVersionHandlers()
    registerStubHandlers()
}

export default registerAllHandlers