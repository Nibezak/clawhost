import type { ReactNode } from 'react'
import type { User } from 'firebase/auth'
import type { ClawStatus, ProviderType, ToastType, UserRole } from '@/ts/Types'

interface AppShellProps {
    children: ReactNode
}

interface AuthContextType {
    user: User | null
    loading: boolean
    sendOtp: (email: string) => Promise<void>
    verifyOtp: (email: string, code: string) => Promise<void>
    signOut: () => Promise<void>
}

interface VerifyOtpResponse {
    customToken: string
}

interface ToastData {
    message: string
    type: ToastType
    duration?: number
}

interface UIState {
    toast: ToastData | null
    showToast: (message: string, type?: ToastType, duration?: number) => void
    hideToast: () => void
}

interface Volume {
    id: string
    name: string
    size: number
    status: string
}

interface Claw {
    id: string
    name: string
    provider: ProviderType
    status: ClawStatus
    ip: string | null
    planId: string
    location: string | null
    rootPassword: string | null
    sshKeyId: string | null
    providerServerId: string | null
    subdomain: string | null
    gatewayToken: string | null
    model: string | null
    subscriptionStatus: string | null
    currentPeriodStart: string | null
    currentPeriodEnd: string | null
    volumes?: Volume[]
    ownerEmail?: string | null
    deletionScheduledAt: string | null
    createdAt: string
}

interface Plan {
    id: string
    name: string
    cpu: number
    memory: number
    disk: number
    priceMonthly: number
    architecture: string
    disabled?: boolean
}

interface PlansResponse {
    plans: Plan[]
    atCapacity: boolean
}

interface Location {
    id: string
    name: string
    city: string
    country: string
    disabled: boolean
}

interface SSHKey {
    id: string
    name: string
    fingerprint: string
    publicKey: string
    createdAt: string
}

interface UserProfile {
    id: string
    email: string
    name: string | null
    role: UserRole
    createdAt: string
}

interface UserStats {
    clawCount: number
    sshKeyCount: number
    orderCount: number
}

interface CreateClawData {
    name: string
    provider: ProviderType
    planId: string
    location: string
    password?: string
    sshKeyId?: string
    volumeSize?: number
    model?: string
    apiToken?: string
}

interface CreateSSHKeyData {
    name: string
    publicKey: string
}

interface UpdateProfileData {
    name?: string
}

interface DeleteClawResponse {
    scheduled: boolean
    deletionScheduledAt?: string
    claw?: Claw
}

interface VolumePricing {
    pricePerGbMonthly: number
    minSize: number
    maxSize: number
}

interface PlanAvailability {
    [planId: string]: string[]
}

interface DiagnosticsStatusResponse {
    service: string
    port: string
    memory: string
}

interface DiagnosticsLogsResponse {
    logs: string
}

interface ClawAgent {
    id: string
    name: string
    model: string | null
    status: string
    directory: string | null
}

interface ClawAgentsResponse {
    agents: ClawAgent[]
    reachable: boolean
}

export type {
    AppShellProps,
    AuthContextType,
    VerifyOtpResponse,
    ToastData,
    UIState,
    Volume,
    Claw,
    Plan,
    PlansResponse,
    Location,
    SSHKey,
    UserProfile,
    UserStats,
    CreateClawData,
    CreateSSHKeyData,
    UpdateProfileData,
    DeleteClawResponse,
    VolumePricing,
    PlanAvailability,
    DiagnosticsStatusResponse,
    DiagnosticsLogsResponse,
    ClawAgent,
    ClawAgentsResponse
}