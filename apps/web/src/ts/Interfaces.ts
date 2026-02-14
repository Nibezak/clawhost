import type { ReactNode } from 'react'
import type { User } from 'firebase/auth'
import type { Node, Edge } from '@xyflow/react'
import type {
    ClawAvatarSize,
    ClawStatus,
    ProviderType,
    ToastType,
    UserRole,
    ViewMode
} from '@/ts/Types'

export interface ApiResponse<T = null> {
    success: boolean
    data: T
    message: string
    code: number
    version: string
}

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
    ownerEmail?: string | null
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

export interface PlansResponse {
    plans: Plan[]
    atCapacity: boolean
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
    role: UserRole
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

export interface ClawAvatarProps {
    size?: ClawAvatarSize
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
    noIndex?: boolean
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
    onShowDiagnostics: () => void
    onShowLogs: () => void
    onShowConfig: () => void
    onUpdateInstance: () => void
    onShowReinstallModal: () => void
    onCopySSH: () => void
    onCopySSHWithKey: () => void
    onCopySSHWithPassword: () => void
    onCopyPassword: () => void
    onExport: () => void
}

export interface ExportRateLimitError extends Error {
    retryAfter: number
}

export interface ClawCardDropdownMenuProps {
    claw: Claw
    actions: ClawCardActions
    isLoading: boolean
    copied: boolean
    passwordCopied: boolean
    hasActionItems: boolean
    isScheduledForDeletion: boolean
    isAdmin: boolean
    compact?: boolean
    isPlayground?: boolean
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
    showReinstallModal: boolean
    setShowReinstallModal: (open: boolean) => void
    onReinstall: () => void
    isReinstallPending: boolean
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
    isAdmin: boolean
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
    isAdmin: boolean
    isExpanded: boolean
    onToggleExpand: () => void
}

export interface ScheduledDeletionBannerProps {
    deletionScheduledAt: string
    onCancelDeletion: () => void
    isLoading: boolean
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
    envVar: string
}

export interface AwaitingPurchaseData {
    name: string
    provider: ProviderType
    planId: string
    location: string
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
    scheduled: boolean
    deletionScheduledAt?: string
    claw?: Claw
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

export interface DiagnosticsStatusResponse {
    service: string
    port: string
    memory: string
}

export interface DiagnosticsLogsResponse {
    logs: string
}

export interface ClawFileEntry {
    path: string
    name: string
    isJson: boolean
}

export interface ClawFilesResponse {
    files: ClawFileEntry[]
}

export interface ReadClawFileResponse {
    content: string
    path: string
}

export interface UpdateClawFileData {
    path: string
    content: string
}

export interface UpdateClawFileParams {
    id: string
    data: UpdateClawFileData
}

export interface ClawDiagnosticsDialogProps {
    clawId: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export interface ClawLogsDialogProps {
    clawId: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export interface ClawLogsContentProps {
    clawId: string
    enabled: boolean
    embedded?: boolean
}

export interface ClawDiagnosticsContentProps {
    clawId: string
    enabled: boolean
}

export interface ClawFileExplorerDialogProps {
    clawId: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export interface UseProfileOptions {
    enabled?: boolean
    staleTime?: number
}

export interface UseClawOptions {
    sync?: boolean
}

export interface Testimonial {
    quote: string
    author: string
    role: string
    avatar: string
}

export interface Faq {
    question: string
    answer: string
}

export interface ClawAgent {
    id: string
    name: string
    model: string | null
    status: string
    directory: string | null
}

export interface ClawAgentsResponse {
    agents: ClawAgent[]
    reachable: boolean
}

export interface PlaygroundClawNodeData {
    claw: Claw
    agentCount: number
    isLoadingAgents: boolean
    isReachable: boolean
    isSelected: boolean
}

export interface PlaygroundAgentNodeData {
    agent: ClawAgent
    clawName: string
    clawId: string
    isSelected: boolean
}

export interface PlaygroundClawNodeProps {
    data: PlaygroundClawNodeData
}

export interface PlaygroundAgentNodeProps {
    data: PlaygroundAgentNodeData
}

export interface PlaygroundCanvasProps {
    initialNodes: Node[]
    initialEdges: Edge[]
    onNodeClick?: (clawId: string) => void
    onAgentClick?: (agentId: string, clawId: string) => void
    onPaneClick?: () => void
    panelOpen?: boolean
    selectedClawId?: string | null
    selectedAgentId?: string | null
    initialZoom?: number
    allowPageScroll?: boolean
}

export interface PlaygroundDetailPanelProps {
    claw: Claw
    plans: Plan[]
    sshKeys: SSHKey[]
    onClose: () => void
}

export interface PlaygroundToolbarProps {
    zoom: number
    onFitView: () => void
    isFitView: boolean
    nodesOutOfView: boolean
}

export interface AgentConfigResponse {
    agent: {
        id: string
        model: string | null
    }
    envVars: Record<string, string>
    defaultModel: string | null
}

export interface UpdateAgentConfigData {
    agentId: string
    model: string | null
    envVars: Record<string, string>
}

export interface PlaygroundAgentDetailPanelProps {
    agent: ClawAgent
    clawId: string
    clawName: string
    onClose: () => void
}

export interface ClawEnvVarsResponse {
    envVars: Record<string, string>
}

export interface UpdateClawEnvVarsData {
    envVars: Record<string, string>
}

export interface PlaygroundVariablesContentProps {
    clawId: string
}

export interface HeroButtonsProps {
    deployLabel: string
    githubLabel: string
    showStars: boolean
    large?: boolean
}

export interface DemoPlaygroundData {
    nodes: Node[]
    edges: Edge[]
    claws: Claw[]
    agentsByClawId: Record<string, ClawAgent[]>
}