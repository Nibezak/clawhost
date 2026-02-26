import type { UpdateProfileData } from '@/ts/Interfaces'

import { ipcMain } from 'electron'
import { clawProvider } from '@openclaw/shared'
import { configStore } from '@/main/services'

const registerStubHandlers = (): void => {
    ipcMain.handle('getPlans', () => {
        return {
            plans: [
                {
                    id: clawProvider.local,
                    name: 'Local',
                    cpu: 0,
                    memory: 0,
                    disk: 0,
                    priceMonthly: 0,
                    architecture: process.arch
                }
            ],
            atCapacity: false
        }
    })

    ipcMain.handle('getLocations', () => {
        return [
            {
                id: clawProvider.local,
                name: 'Local',
                city: 'Local',
                country: 'Local',
                disabled: false
            }
        ]
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
        const config = configStore.readConfig()
        return {
            id: clawProvider.local,
            email: 'local@clawhostgo',
            name: config.userName || '',
            role: 'admin',
            authMethods: [],
            createdAt: config.createdAt || new Date().toISOString(),
            setupComplete: config.setupComplete || false
        }
    })

    ipcMain.handle(
        'updateProfile',
        (_event: unknown, data: UpdateProfileData) => {
            if (data?.name !== undefined) {
                const config = configStore.readConfig()
                config.userName = data.name
                if (!config.setupComplete) config.setupComplete = true
                configStore.writeConfig(config)
            }
            const config = configStore.readConfig()
            return {
                id: clawProvider.local,
                email: 'local@clawhostgo',
                name: config.userName || '',
                role: 'admin',
                authMethods: [],
                createdAt: config.createdAt || new Date().toISOString()
            }
        }
    )

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