import type {
    Claw,
    ClawAgentsResponse,
    CreateClawData,
    CreateSSHKeyData,
    DeleteClawResponse,
    DiagnosticsLogsResponse,
    DiagnosticsStatusResponse,
    Location,
    PlanAvailability,
    PlansResponse,
    SSHKey,
    UpdateProfileData,
    UserProfile,
    UserStats,
    VerifyOtpResponse,
    VolumePricing
} from '@/ts/Interfaces'

import { RequestClient } from '@openclaw/shared'
import { signOut } from 'firebase/auth'
import { auth, clearTokenCache, getCachedToken } from '@/lib/firebase'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const client = new RequestClient({
    baseUrl: BASE_URL,
    getHeaders: async (): Promise<Record<string, string>> => {
        const token = await getCachedToken()
        return token ? { Authorization: `Bearer ${token}` } : {}
    },
    onUnauthorized: async (): Promise<void> => {
        clearTokenCache()
        const token = await getCachedToken(true)
        if (!token) {
            await signOut(auth)
        }
    }
})

const publicClient = new RequestClient({
    baseUrl: BASE_URL
})

const api = {
    sendOtp: (email: string): Promise<void> =>
        publicClient.post<void>('/auth/send-otp', { email }),
    verifyOtp: (email: string, code: string): Promise<VerifyOtpResponse> =>
        publicClient.post<VerifyOtpResponse>('/auth/verify-otp', {
            email,
            code
        }),

    getPlans: (provider?: string): Promise<PlansResponse> =>
        client.get<PlansResponse>(
            `/plans${provider ? `?provider=${provider}` : ''}`
        ),
    getLocations: (provider?: string): Promise<Location[]> =>
        client.get<Location[]>(
            `/plans/locations${provider ? `?provider=${provider}` : ''}`
        ),
    getVolumePricing: (provider?: string): Promise<VolumePricing> =>
        client.get<VolumePricing>(
            `/plans/volume-pricing${provider ? `?provider=${provider}` : ''}`
        ),
    getPlanAvailability: (provider?: string): Promise<PlanAvailability> =>
        client.get<PlanAvailability>(
            `/plans/availability${provider ? `?provider=${provider}` : ''}`
        ),

    getClaws: (): Promise<Claw[]> => client.get<Claw[]>('/claws'),
    getClaw: (id: string, sync?: boolean): Promise<Claw> =>
        client.get<Claw>(`/claws/${id}${sync ? '?sync=true' : ''}`),
    syncClaw: (id: string): Promise<Claw> =>
        client.post<Claw>(`/claws/${id}/sync`),
    createClaw: (data: CreateClawData): Promise<Claw> =>
        client.post<Claw>('/claws', data),
    startClaw: (id: string): Promise<Claw> =>
        client.post<Claw>(`/claws/${id}/start`),
    stopClaw: (id: string): Promise<Claw> =>
        client.post<Claw>(`/claws/${id}/stop`),
    restartClaw: (id: string): Promise<Claw> =>
        client.post<Claw>(`/claws/${id}/restart`),
    deleteClaw: (id: string): Promise<DeleteClawResponse> =>
        client.delete<DeleteClawResponse>(`/claws/${id}`),
    cancelDeletion: (id: string): Promise<Claw> =>
        client.post<Claw>(`/claws/${id}/cancel-deletion`),
    hardDeleteClaw: (id: string): Promise<void> =>
        client.post<void>(`/claws/${id}/hard-delete`),
    getClawDiagnostics: (id: string): Promise<DiagnosticsStatusResponse> =>
        client.post<DiagnosticsStatusResponse>(
            `/claws/${id}/diagnostics/status`
        ),
    getClawLogs: (id: string): Promise<DiagnosticsLogsResponse> =>
        client.post<DiagnosticsLogsResponse>(`/claws/${id}/diagnostics/logs`),
    repairClaw: (id: string): Promise<void> =>
        client.post<void>(`/claws/${id}/diagnostics/repair`),
    reinstallClaw: (id: string): Promise<void> =>
        client.post<void>(`/claws/${id}/reinstall`),
    getClawAgents: (id: string): Promise<ClawAgentsResponse> =>
        client.post<ClawAgentsResponse>(`/claws/${id}/agents`),

    getSSHKeys: (): Promise<SSHKey[]> => client.get<SSHKey[]>('/ssh-keys'),
    createSSHKey: (data: CreateSSHKeyData): Promise<SSHKey> =>
        client.post<SSHKey>('/ssh-keys', data),
    deleteSSHKey: (id: string): Promise<void> =>
        client.delete<void>(`/ssh-keys/${id}`),

    getProfile: (): Promise<UserProfile> =>
        client.get<UserProfile>('/users/me'),
    updateProfile: (data: UpdateProfileData): Promise<UserProfile> =>
        client.put<UserProfile>('/users/me', data),
    getUserStats: (): Promise<UserStats> =>
        client.get<UserStats>('/users/me/stats')
}

export default api