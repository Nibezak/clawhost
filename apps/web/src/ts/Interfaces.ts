import type { ReactNode } from 'react'
import type { User } from 'firebase/auth'
import type { ClawStatus, ToastType, ViewMode } from '@/ts/Types'

export interface MagicLinkEmailProps {
    magicLink: string
}

export interface Volume {
    id: string
    name: string
    size: number
    status: string
}

export interface Claw {
    id: string
    name: string
    status: ClawStatus
    ip: string | null
    planId: string
    location: string | null
    rootPassword: string | null
    sshKeyId: string | null
    hetznerServerId: string | null
    subdomain: string | null
    gatewayToken: string | null
    volumes?: Volume[]
    createdAt: string
}

export interface VolumePricing {
    pricePerGbMonthly: number
    minSize: number
    maxSize: number
}

export interface Plan {
    id: string
    name: string
    cpu: number
    memory: number
    disk: number
    priceMonthly: number
    architecture: string
}

export interface Location {
    id: string
    name: string
    city: string
    country: string
}

export interface SSHKey {
    id: string
    name: string
    fingerprint: string
    publicKey: string
    createdAt: string
}

export interface UserProfile {
    id: string
    email: string
    name: string | null
    createdAt: string
}

export interface UserStats {
    clawCount: number
    sshKeyCount: number
    orderCount: number
}

export interface BillingOrder {
    id: string
    status: string
    totalAmount: number
    taxAmount: number
    currency: string
    billingReason: string
    productName: string | null
    productId: string | null
    subscriptionId: string | null
    createdAt: string
}

export interface BillingHistoryResponse {
    items: BillingOrder[]
    total: number
    page: number
    totalPages: number
}

export interface BillingInvoiceResponse {
    url: string
}

// ============================================
// Store Interfaces
// ============================================

export interface ToastData {
    message: string
    type: ToastType
    duration?: number
}

export interface UIState {
    isCreateModalOpen: boolean
    setCreateModalOpen: (open: boolean) => void
    toast: ToastData | null
    showToast: (message: string, type?: ToastType, duration?: number) => void
    hideToast: () => void
}

export interface PreferencesState {
    instancesViewMode: ViewMode
    setInstancesViewMode: (mode: ViewMode) => void
}

// ============================================
// Auth Interfaces
// ============================================

export interface CachedProfile {
    email: string
    name: string | null
}

export interface AuthContextType {
    user: User | null
    loading: boolean
    cachedProfile: CachedProfile | null
    updateCachedProfile: (data: Partial<CachedProfile>) => void
    sendOtp: (email: string) => Promise<void>
    verifyOtp: (email: string) => Promise<void>
    signOut: () => Promise<void>
}

// ============================================
// Component Props Interfaces
// ============================================

export interface NavLink {
    label: string
    href: string
    id: string
}

export interface ClawMascotProps {
    className?: string
}

export interface HeaderProps {
    showNavLinks?: boolean
    navLinks?: NavLink[]
    activeSection?: string
}

export interface EmptyStateProps {
    icon: ReactNode
    title: string
    description: string
    actionLabel?: string
    onAction?: () => void
}

export interface ErrorStateProps {
    title?: string
    description?: string
    onRetry?: () => void
}

export interface PageTitleProps {
    title: string
    description?: string
}

export interface PageHeaderProps {
    title: string
    description?: string
    action?: ReactNode
}

export interface ActionButtonProps {
    onClick: () => void
    label: string
    icon: ReactNode
    size?: 'default' | 'sm' | 'lg'
}

export interface MockClawData {
    id: string
    name: string
    status: 'running' | 'stopped' | 'restarting'
    subdomain: string
    ip: string
    location: string
    locationFlag: string
    plan: string
    planDetails: string
}

export interface MockClawCardProps {
    claw: MockClawData
    onStart?: (id: string) => void
    onStop?: (id: string) => void
    onRestart?: (id: string) => void
    onDelete?: (id: string) => void
}

// ============================================
// Dashboard Component Interfaces
// ============================================

export interface StatusConfig {
    color: string
    bgColor: string
    label: string
    pulse?: boolean
}

export interface ClawCardProps {
    claw: Claw
    sshKeys: SSHKey[]
    plans: Plan[]
    viewMode?: ViewMode
}

export interface CopyableFieldProps {
    label: string
    value: string
}

export interface CreateClawModalProps {
    plans: Plan[]
    locations: Location[]
    sshKeys: SSHKey[]
    volumePricing?: VolumePricing
    preselectedPlanId?: string | null
    onClose: () => void
    onNavigateToSSHKeys: () => void
}

// ============================================
// SSH Keys Component Interfaces
// ============================================

export interface SSHKeyCardProps {
    sshKey: SSHKey
}

export interface CreateSSHKeyModalProps {
    onClose: () => void
}

export interface GeneratedKeyPair {
    publicKey: string
    privateKey: string
}

export interface ProtectedRouteProps {
    children: ReactNode
}

// ============================================
// Hook Interfaces
// ============================================

export interface CreateClawData {
    name: string
    planId: string
    location: string
    password?: string
    sshKeyId?: string
    volumeSize?: number
}

export interface PurchaseClawData {
    name: string
    planId: string
    location: string
    password?: string
    sshKeyId?: string
    volumeSize?: number
    priceMonthly: number
}

export interface PurchaseClawResponse {
    checkoutUrl: string
    checkoutId: string
    pendingClawId: string
    expiresAt: string
}

export interface CreateSSHKeyData {
    name: string
    publicKey: string
}

export interface UpdateProfileData {
    name?: string
}
