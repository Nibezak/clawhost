import type {
  BillingHistoryResponse,
  BillingInvoiceResponse,
  Claw,
  Location,
  Plan,
  PurchaseClawData,
  PurchaseClawResponse,
  SSHKey,
  UserProfile,
  UserStats,
  VolumePricing,
} from '@/ts/Interfaces'
import { RequestClient } from '@openclaw/shared'
import { getCachedToken } from '@/lib/firebase'

// Re-export types for backward compatibility
export type { Claw, Location, Plan, SSHKey, UserProfile, UserStats, Volume, VolumePricing } from '@/ts/Interfaces'

const client = new RequestClient({
  baseUrl: '/api',
  getHeaders: async (): Promise<Record<string, string>> => {
    const token = await getCachedToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  },
})

// Public API client (no auth required)
const publicClient = new RequestClient({
  baseUrl: '/api',
})

export const api = {
  // Auth (public)
  sendMagicLink: (email: string, redirectUrl: string) =>
    publicClient.post<{ success: boolean }>('/auth/send-magic-link', { email, redirectUrl }),

  // Plans & Locations
  getPlans: () => client.get<Plan[]>('/plans'),
  getLocations: () => client.get<Location[]>('/plans/locations'),
  getVolumePricing: () => client.get<VolumePricing>('/plans/volume-pricing'),

  // Claws
  getClaws: (sync?: boolean) => client.get<Claw[]>(`/claws${sync ? '?sync=true' : ''}`),
  getClaw: (id: string, sync?: boolean) =>
    client.get<Claw>(`/claws/${id}${sync ? '?sync=true' : ''}`),
  syncClaw: (id: string) => client.post<Claw>(`/claws/${id}/sync`),
  createClaw: (data: {
    name: string
    planId: string
    location: string
    password?: string
    sshKeyId?: string
    volumeSize?: number
  }) => client.post<Claw>('/claws', data),
  purchaseClaw: (data: PurchaseClawData) =>
    client.post<PurchaseClawResponse>('/claws/purchase', data),
  startClaw: (id: string) => client.post<void>(`/claws/${id}/start`),
  stopClaw: (id: string) => client.post<void>(`/claws/${id}/stop`),
  restartClaw: (id: string) => client.post<void>(`/claws/${id}/restart`),
  deleteClaw: (id: string) => client.delete<void>(`/claws/${id}`),

  // SSH Keys
  getSSHKeys: () => client.get<SSHKey[]>('/ssh-keys'),
  createSSHKey: (data: { name: string; publicKey: string }) =>
    client.post<SSHKey>('/ssh-keys', data),
  deleteSSHKey: (id: string) => client.delete<void>(`/ssh-keys/${id}`),

  // User Profile
  getProfile: () => client.get<UserProfile>('/users/me'),
  updateProfile: (data: { name?: string }) => client.put<UserProfile>('/users/me', data),
  getUserStats: () => client.get<UserStats>('/users/me/stats'),
  getBillingHistory: (page: number = 1, limit: number = 10) =>
    client.get<BillingHistoryResponse>(`/users/me/billing?page=${page}&limit=${limit}`),
  getOrderInvoice: (orderId: string) =>
    client.get<BillingInvoiceResponse>(`/users/me/billing/${orderId}/invoice`),
}
