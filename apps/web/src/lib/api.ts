import type {
    BillingHistoryResponse,
    BillingInvoiceResponse,
    Claw,
    CreateClawData,
    CreateSSHKeyData,
    CustomerPortalResponse,
    DeleteClawResponse,
    Location,
    MagicLinkResponse,
    Plan,
    PlanAvailability,
    PurchaseClawData,
    PurchaseClawResponse,
    SSHKey,
    UpdateProfileData,
    UserProfile,
    UserStats,
    VolumePricing
} from '@/ts/Interfaces'

import { RequestClient } from '@openclaw/shared'
import { getCachedToken } from '@/lib/firebase'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const client = new RequestClient({
    baseUrl: BASE_URL,
    getHeaders: async (): Promise<Record<string, string>> => {
        const token = await getCachedToken()
        return token ? { Authorization: `Bearer ${token}` } : {}
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