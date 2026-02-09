import type {
    BillingHistoryResponse,
    BillingInvoiceResponse,
    Claw,
    ClawConfigResponse,
    CreateClawData,
    CreateSSHKeyData,
    CustomerPortalResponse,
    DeleteClawResponse,
    DiagnosticsLogsResponse,
    DiagnosticsRepairResponse,
    DiagnosticsStatusResponse,
    Location,
    MagicLinkResponse,
    Plan,
    PlanAvailability,
    PurchaseClawData,
    PurchaseClawResponse,
    SSHKey,
    UpdateClawConfigData,
    UpdateClawConfigResponse,
    UpdateProfileData,
    UserProfile,
    UserStats,
    VolumePricing
} from '@/ts/Interfaces'

import { RequestClient } from '@openclaw/shared'
import { clearTokenCache, getCachedToken } from '@/lib/firebase'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const client = new RequestClient({
    baseUrl: BASE_URL,
    getHeaders: async (): Promise<Record<string, string>> => {
        const token = await getCachedToken()
        return token ? { Authorization: `Bearer ${token}` } : {}
    },
    onUnauthorized: async (): Promise<void> => {
        clearTokenCache()
        await getCachedToken(true)
    }
})

const publicClient = new RequestClient({
    baseUrl: BASE_URL
})

export const api = {
    sendMagicLink: (email: string, redirectUrl: string) =>
        publicClient.post<MagicLinkResponse>('/auth/send-magic-link', {
            email,
            redirectUrl
        }),

    getPlans: (provider?: string) =>
        client.get<Plan[]>(`/plans${provider ? `?provider=${provider}` : ''}`),
    getLocations: (provider?: string) =>
        client.get<Location[]>(
            `/plans/locations${provider ? `?provider=${provider}` : ''}`
        ),
    getVolumePricing: (provider?: string) =>
        client.get<VolumePricing>(
            `/plans/volume-pricing${provider ? `?provider=${provider}` : ''}`
        ),
    getPlanAvailability: (provider?: string) =>
        client.get<PlanAvailability>(
            `/plans/availability${provider ? `?provider=${provider}` : ''}`
        ),

    getClaws: () => client.get<Claw[]>('/claws'),
    getClaw: (id: string, sync?: boolean) =>
        client.get<Claw>(`/claws/${id}${sync ? '?sync=true' : ''}`),
    syncClaw: (id: string) => client.post<Claw>(`/claws/${id}/sync`),
    createClaw: (data: CreateClawData) => client.post<Claw>('/claws', data),
    purchaseClaw: (data: PurchaseClawData) =>
        client.post<PurchaseClawResponse>('/claws/purchase', data),
    startClaw: (id: string) => client.post<Claw>(`/claws/${id}/start`),
    stopClaw: (id: string) => client.post<Claw>(`/claws/${id}/stop`),
    restartClaw: (id: string) => client.post<Claw>(`/claws/${id}/restart`),
    deleteClaw: (id: string) =>
        client.delete<DeleteClawResponse>(`/claws/${id}`),
    cancelDeletion: (id: string) =>
        client.post<Claw>(`/claws/${id}/cancel-deletion`),
    hardDeleteClaw: (id: string) =>
        client.post<void>(`/claws/${id}/hard-delete`),
    getClawDiagnostics: (id: string) =>
        client.post<DiagnosticsStatusResponse>(
            `/claws/${id}/diagnostics/status`
        ),
    getClawLogs: (id: string) =>
        client.post<DiagnosticsLogsResponse>(`/claws/${id}/diagnostics/logs`),
    repairClaw: (id: string) =>
        client.post<DiagnosticsRepairResponse>(
            `/claws/${id}/diagnostics/repair`
        ),
    getClawConfig: (id: string) =>
        client.post<ClawConfigResponse>(`/claws/${id}/config`),
    updateClawConfig: (id: string, data: UpdateClawConfigData) =>
        client.put<UpdateClawConfigResponse>(`/claws/${id}/config`, data),

    getSSHKeys: () => client.get<SSHKey[]>('/ssh-keys'),
    createSSHKey: (data: CreateSSHKeyData) =>
        client.post<SSHKey>('/ssh-keys', data),
    deleteSSHKey: (id: string) => client.delete<void>(`/ssh-keys/${id}`),

    getProfile: () => client.get<UserProfile>('/users/me'),
    updateProfile: (data: UpdateProfileData) =>
        client.put<UserProfile>('/users/me', data),
    getUserStats: () => client.get<UserStats>('/users/me/stats'),
    getBillingHistory: (page: number = 1, limit: number = 10) =>
        client.get<BillingHistoryResponse>(
            `/users/me/billing?page=${page}&limit=${limit}`
        ),
    getOrderInvoice: (orderId: string) =>
        client.get<BillingInvoiceResponse>(
            `/users/me/billing/${orderId}/invoice`
        ),
    getCustomerPortal: () =>
        client.post<CustomerPortalResponse>('/users/me/billing/portal')
}