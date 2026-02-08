import type { ReactNode } from 'react'
import type { User } from 'firebase/auth'
import type { ClawStatus, ProviderType, ToastType, ViewMode } from '@/ts/Types'

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
    deletionScheduledAt: string | null
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
    disabled?: boolean
}

export interface Location {
    id: string
    name: string
    city: string
    country: string
    disabled: boolean
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
    subtotalAmount: number
    discountAmount: number
    totalAmount: number
    taxAmount: number
    currency: string
    billingReason: string
    productName: string | null
    productId: string | null
    subscriptionId: string | null
    discountName: string | null
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

export interface NavLink {
    label: string
    href: string
    id: string
}

export interface ClawMascotProps {
    className?: string
}

export interface ProviderIconProps {
    provider: ProviderType
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
    actionIcon?: ReactNode
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
    image?: string
    url?: string
    type?: string
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
    provider: ProviderType
    location: string
    locationFlag: string
    plan: string
    planDetails: string
    monthlyCost: string
    serverId: string
    createdAt: string
    sshKey: string
}

export interface MockClawCardProps {
    claw: MockClawData
    onStart?: (id: string) => void
    onStop?: (id: string) => void
    onRestart?: (id: string) => void
    onDelete?: (id: string) => void
}

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
    icon?: ReactNode
}

export interface PlanAvailability {
    [planId: string]: string[]
}

export interface CreateClawModalProps {
    plans: Plan[]
    locations: Location[]
    sshKeys: SSHKey[]
    volumePricing?: VolumePricing
    planAvailability?: PlanAvailability
    preselectedPlanId?: string | null
    onClose: () => void
    onNavigateToSSHKeys: () => void
}

export interface ClawCardActions {
    onStart: () => void
    onShowStopModal: () => void
    onShowRestartModal: () => void
    onShowDeleteModal: () => void
    onCancelDeletion: () => void
    onShowHardDeleteModal: () => void
    onCopySSH: () => void
    onCopySSHWithKey: () => void
    onCopySSHWithPassword: () => void
    onCopyPassword: () => void
}

export interface ClawCardDropdownMenuProps {
    claw: Claw
    actions: ClawCardActions
    isLoading: boolean
    copied: boolean
    passwordCopied: boolean
    hasActionItems: boolean
    isScheduledForDeletion: boolean
    compact?: boolean
}

export interface ClawCardDialogsProps {
    clawName: string
    showDeleteModal: boolean
    setShowDeleteModal: (open: boolean) => void
    showStopModal: boolean
    setShowStopModal: (open: boolean) => void
    showRestartModal: boolean
    setShowRestartModal: (open: boolean) => void
    showHardDeleteModal: boolean
    setShowHardDeleteModal: (open: boolean) => void
    onDelete: () => void
    onStop: () => void
    onRestart: () => void
    onHardDelete: () => void
    isDeletePending: boolean
    isStopPending: boolean
    isRestartPending: boolean
    isHardDeletePending: boolean
}

export interface ClawCardGridViewProps {
    claw: Claw
    status: StatusConfig
    flag: string | null
    locationName: string
    plan: Plan | undefined
    monthlyPrice: number | null
    attachedSshKey: SSHKey | null
    actions: ClawCardActions
    isLoading: boolean
    copied: boolean
    passwordCopied: boolean
    hasActionItems: boolean
    hasBothOptions: boolean
    isScheduledForDeletion: boolean
}

export interface ClawCardListViewProps {
    claw: Claw
    status: StatusConfig
    flag: string | null
    locationName: string
    plan: Plan | undefined
    monthlyPrice: number | null
    attachedSshKey: SSHKey | null
    actions: ClawCardActions
    isLoading: boolean
    copied: boolean
    passwordCopied: boolean
    hasActionItems: boolean
    isScheduledForDeletion: boolean
    isExpanded: boolean
    onToggleExpand: () => void
}

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

export interface AuthProviderProps {
    children: ReactNode
}

export interface AIModelOption {
    id: string
    name: string
    provider: string
}

export interface CreateClawData {
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

export interface PurchaseClawData {
    name: string
    provider: ProviderType
    planId: string
    location: string
    password?: string
    sshKeyId?: string
    volumeSize?: number
    model?: string
    apiToken?: string
    priceMonthly: number
}

export interface DeleteClawResponse {
    success: boolean
    scheduled: boolean
    deletionScheduledAt?: string
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

export interface MagicLinkResponse {
    success: boolean
}

export interface CustomerPortalResponse {
    url: string
}

export interface GitHubStarsData {
    count: number
    formatted: string
}

export interface BlogPostFrontmatter {
    title: string
    slug: string
    description: string
    author: string
    publishedAt: string
    updatedAt?: string
    tags: string[]
    coverImage?: string
}

export interface BlogPostMeta extends BlogPostFrontmatter {
    readingTime: number
}

export interface BlogPostModule {
    default: React.ComponentType
    frontmatter: BlogPostFrontmatter
}

export interface BlogCardProps {
    post: BlogPostMeta
}

export interface JsonLdProps {
    data: Record<string, unknown>
}

export interface PrerenderMeta {
    title: string
    description: string
    url: string
    type: string
    image: string
    jsonLd: Record<string, unknown>
    articleMeta?: ArticleMeta
}

export interface ArticleMeta {
    publishedTime: string
    modifiedTime?: string
    author: string
    tags: string[]
}