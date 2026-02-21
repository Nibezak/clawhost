import { ipcMain } from 'electron'
import { configStore } from '@/main/services'

const registerStubHandlers = (): void => {
    ipcMain.handle('getPlans', () => {
        return {
            plans: [{
                id: 'local',
                name: 'Local',
                cpu: 0,
                memory: 0,
                disk: 0,
                priceMonthly: 0,
                architecture: process.arch
            }],
            atCapacity: false
        }
    })

    ipcMain.handle('getLocations', () => {
        return [{
            id: 'local',
            name: 'Local',
            city: 'Local',
            country: 'Local',
            disabled: false
        }]
    })

    ipcMain.handle('getVolumePricing', () => {
        return { pricePerGbMonthly: 0, minSize: 0, maxSize: 0 }
    })

    ipcMain.handle('getPlanAvailability', () => {
        return []
    })

    ipcMain.handle('getSSHKeys', () => {
        return []
    })

    ipcMain.handle('createSSHKey', () => {
        return {}
    })

    ipcMain.handle('deleteSSHKey', () => {
        return { success: true }
    })

    ipcMain.handle('getProfile', () => {
        return {
            id: 'local',
            email: 'local@clawhostgo',
            name: 'Local User',
            role: 'admin',
            authMethods: [],
            createdAt: new Date().toISOString()
        }
    })

    ipcMain.handle('updateProfile', () => {
        return { success: true }
    })

    ipcMain.handle('getUserStats', () => {
        const config = configStore.readConfig()
        return {
            clawCount: config.claws.length,
            sshKeyCount: 0,
            orderCount: 0
        }
    })

    ipcMain.handle('connectAuthMethod', () => {
        return { success: true }
    })

    ipcMain.handle('disconnectAuthMethod', () => {
        return { success: true }
    })

    ipcMain.handle('getBillingHistory', () => {
        return { orders: [], total: 0, page: 1, limit: 20 }
    })

    ipcMain.handle('getOrderInvoice', () => {
        return { url: null }
    })

    ipcMain.handle('getCustomerPortal', () => {
        return { url: null }
    })

    ipcMain.handle('sendOtp', () => {
        return { success: true }
    })

    ipcMain.handle('verifyOtp', () => {
        return { customToken: 'local-token' }
    })

    ipcMain.handle('purchaseClaw', () => {
        throw new Error('Purchasing is not available in local mode.')
    })

    ipcMain.handle('getAdminClaws', () => {
        const config = configStore.readConfig()
        return config.claws
    })

    ipcMain.handle('pairWhatsApp', () => {
        return { qrCode: null, status: 'unavailable' }
    })

    ipcMain.handle('pairWhatsAppStatus', () => {
        return { status: 'unavailable' }
    })
}

export default registerStubHandlers