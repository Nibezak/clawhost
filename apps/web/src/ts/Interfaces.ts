import type { ElementType, ReactNode } from 'react'
import type { User } from 'firebase/auth'
import type { Node, Edge } from '@xyflow/react'
import type { UseQueryResult } from '@tanstack/react-query'
import type { TranslationKey } from '@openclaw/i18n'
import type {
    AuthMethod,
    ChatMessageRole,
    ChatMessageStatus,
    ClawAvatarSize,
    ClawStatus,
    DashboardTab,
    GatewayConnectionState,
    PlaygroundAgentDetailTab,
    PlaygroundDetailTab,
    ProviderType,
    ThemeMode,
    ToastType,
    UserRole
} from '@/ts/Types'

export interface ApiResponse<T = null> {
    success: boolean
    data: T
    message: string
    code: number
    version: string
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
    authMethods: AuthMethod[]
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
    adminMode: boolean
    setAdminMode: (mode: boolean) => void
    dashboardTab: DashboardTab
    setDashboardTab: (tab: DashboardTab) => void
    theme: ThemeMode
    setTheme: (theme: ThemeMode) => void
}

export interface CachedProfile {
    email: string
    name: string | null
}

export interface VerifyOtpResponse {
    customToken: string
}

export interface AuthContextType {
    user: User | null
    loading: boolean
    cachedProfile: CachedProfile | null
    updateCachedProfile: (data: Partial<CachedProfile>) => void
    sendOtp: (email: string) => Promise<void>
    verifyOtp: (email: string, code: string) => Promise<void>
    signInWithGoogle: () => Promise<void>
    signInWithGithub: () => Promise<void>
    linkGoogle: () => Promise<void>
    linkGithub: () => Promise<void>
    unlinkGoogle: () => Promise<void>
    unlinkGithub: () => Promise<void>
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

export interface UserDropdownProps {
    displayName: string
    onSignOut: () => Promise<void>
    onOpen?: () => void
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

export interface PanelPlaceholderProps {
    icon: ReactNode
    title: string
    description: string
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

export interface StatusConfig {
    color: string
    bgColor: string
    label: string
    pulse?: boolean
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
    preselectedProvider?: ProviderType | null
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

export interface CreateClawData {
    name: string
    provider: ProviderType
    planId: string
    location: string
    password?: string
    sshKeyId?: string
    volumeSize?: number
}

export interface PurchaseClawData {
    name: string
    provider: ProviderType
    planId: string
    location: string
    password?: string
    sshKeyId?: string
    volumeSize?: number
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

export interface ClawVersionResponse {
    version: string
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
    mockLogs?: string
}

export interface ClawDiagnosticsContentProps {
    clawId: string
    enabled: boolean
    mockData?: DiagnosticsStatusResponse
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
    isSelected: boolean
    readOnly?: boolean
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
    selectedAgentClawId?: string | null
    initialZoom?: number
    allowPageScroll?: boolean
}

export interface PlaygroundCanvasInnerProps extends PlaygroundCanvasProps {
    zoom: number
    onZoomChange: (zoom: number) => void
    isFitView: boolean
    onFitViewChange: (value: boolean) => void
}

export interface PlaygroundDetailPanelProps {
    claw: Claw
    plans: Plan[]
    sshKeys: SSHKey[]
    onClose: () => void
    readOnly?: boolean
    initialTab?: PlaygroundDetailTab
    onTabChange?: (tab: PlaygroundDetailTab) => void
    fullScreen?: boolean
}

export interface PlaygroundToolbarProps {
    zoom: number
    onFitView: () => void
    isFitView: boolean
    nodesOutOfView: boolean
    clawCount: number
}

export interface AgentConfigResponse {
    agent: {
        id: string
        name: string
        model: string | null
    }
    envVars: Record<string, string>
    defaultModel: string | null
}

export interface UpdateAgentConfigData {
    agentId: string
    name?: string
    model: string | null
    envVars: Record<string, string>
}

export interface CreateAgentData {
    name: string
    model?: string | null
    envVars?: Record<string, string>
}

export interface CreateAgentResponse {
    agent: ClawAgent
}

export interface DeleteAgentData {
    agentId: string
}

export interface CreateAgentModalProps {
    clawId: string
    clawName: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export interface PlaygroundAgentDetailPanelProps {
    agent: ClawAgent
    clawId: string
    clawName: string
    isOnlyAgent: boolean
    onClose: () => void
    readOnly?: boolean
    gatewayToken?: string | null
    subdomain?: string | null
    initialTab?: PlaygroundAgentDetailTab
    onTabChange?: (tab: PlaygroundAgentDetailTab) => void
    hideChatTab?: boolean
}

export interface ClawEnvVarsResponse {
    envVars: Record<string, string>
}

export interface UpdateClawEnvVarsData {
    envVars: Record<string, string>
}

export interface PlaygroundVariablesContentProps {
    clawId: string
    mockEnvVars?: Record<string, string>
}

export interface HeroButtonsProps {
    deployLabel: string
    githubLabel: string
    showStars: boolean
    large?: boolean
}

export interface PlaygroundTabConfig<T extends string = string> {
    id: T
    label: string
    icon: ElementType
}

export interface DemoPlaygroundData {
    nodes: Node[]
    edges: Edge[]
    claws: Claw[]
    agentsByClawId: Record<string, ClawAgent[]>
}

export interface ChatHistoryEntry {
    role: string
    content: unknown
}

export interface ChatImageSource {
    type: string
    mediaType: string
    data: string
    filename?: string
}

export interface ChatMessage {
    id: string
    role: ChatMessageRole
    content: string
    status: ChatMessageStatus
    runId?: string
    timestamp?: string
    images?: ChatImageSource[]
}

export interface ChatEventPayload {
    runId: string
    sessionKey: string
    seq: number
    state: 'delta' | 'final' | 'aborted' | 'error'
    message?: unknown
    errorMessage?: string
}

export interface ChatAttachment {
    type: string
    source: ChatImageSource
}

export interface ChatLightboxProps {
    image: ChatImageSource
    fileName?: string
    onClose: () => void
}

export interface ChatSendParams {
    sessionKey: string
    message: string
    idempotencyKey: string
    deliver: boolean
    attachments?: ChatAttachment[]
}

export interface ChatHistoryParams {
    sessionKey: string
    limit: number
}

export interface ChatAbortParams {
    sessionKey: string
    runId: string
}

export interface UseAgentChatParams {
    subdomain: string | null | undefined
    gatewayToken: string | null | undefined
    agentId: string
    enabled: boolean
}

export interface UseAgentChatReturn {
    messages: ChatMessage[]
    connectionState: GatewayConnectionState
    isLoading: boolean
    isStreaming: boolean
    sendMessage: (
        text: string,
        attachments?: ChatAttachment[],
        previews?: ChatImageSource[]
    ) => void
    abortResponse: () => void
}

export interface GatewayPendingRequest {
    resolve: (payload: unknown) => void
    reject: (error: Error) => void
    timer: ReturnType<typeof setTimeout>
}

export interface AgentChatProps {
    agentId: string
    agentName?: string
    clawId: string
    subdomain: string | null | undefined
    gatewayToken: string | null | undefined
    agentModel: string | null
    readOnly?: boolean
    onConfigure?: () => void
    configureDisabled?: boolean
}

export interface ChatBubbleProps {
    message: ChatMessage
}

export interface ChatInputAttachment {
    file: File
    preview: string
}

export interface ChatInputHandle {
    addFiles: (files: File[]) => void
}

export interface ChatInputProps {
    isConnected: boolean
    isStreaming: boolean
    onSend: (
        text: string,
        attachments?: ChatAttachment[],
        previews?: ChatImageSource[]
    ) => void
    onAbort: () => void
    allowAttach?: boolean
}

export interface ChatMarkdownProps {
    content: string
}

export interface ChatDateSeparatorProps {
    date: string
}

export interface ChatEmptyStateProps {
    isError: boolean
}

export interface ChatStatusBarProps {
    connectionState: GatewayConnectionState
}

export interface UseSpeechRecognitionReturn {
    isRecording: boolean
    isTranscribing: boolean
    toggle: () => void
}

export interface ChannelConfig {
    enabled: boolean
    dmPolicy?: string
    allowFrom?: string[]
    botToken?: string
    token?: string
    appToken?: string
    signingSecret?: string
    account?: string
}

export interface ClawChannelsResponse {
    channels: Record<string, ChannelConfig>
}

export interface UpdateClawChannelsData {
    channels: Record<string, ChannelConfig>
}

export interface SkillEntryConfig {
    enabled: boolean
    apiKey?: string
    env?: Record<string, string>
    config?: Record<string, unknown>
}

export interface BundledSkillInfo {
    name: string
    enabled: boolean
    description?: string
}

export interface ClawSkillsResponse {
    skills: BundledSkillInfo[]
    entries: Record<string, SkillEntryConfig>
}

export interface UpdateClawSkillsData {
    entries: Record<string, SkillEntryConfig>
}

export interface AgentSkillInfo {
    name: string
}

export interface GetAgentSkillsResponse {
    skills: AgentSkillInfo[]
}

export interface UpdateAgentSkillsData {
    action: 'install' | 'remove'
    skillName: string
}

export interface PlaygroundChannelsContentProps {
    clawId: string
}

export interface ChannelDefinition {
    key: string
    label: TranslationKey
    icon: ElementType
    fields: ChannelFieldDefinition[]
}

export interface ChannelFieldDefinition {
    key: keyof ChannelConfig
    label: TranslationKey
    placeholder: TranslationKey
    required?: boolean
    secret?: boolean
}

export interface PlaygroundSkillsContentProps {
    clawId: string
    agentId?: string
}

export interface ClawHubSearchResult {
    slug: string
    name: string
    description: string
    author: string
    version: string
    downloads: number
    tags: string[]
}

export interface ClawHubInstalledSkill {
    slug: string
    name: string
    version: string
    hasUpdate: boolean
    latestVersion?: string
}

export interface ClawHubBrowseResponse {
    skills: ClawHubSearchResult[]
    nextCursor: string | null
    hasMore: boolean
}

export interface ClawHubInstalledResponse {
    skills: ClawHubInstalledSkill[]
}

export interface ClawHubUpdatesResponse {
    updates: ClawHubInstalledSkill[]
}

export interface BrowseClawHubData {
    query?: string
    limit?: number
    cursor?: string
    agentId?: string
}

export interface ClawHubSkillActionData {
    slug: string
    agentId?: string
}

export interface ClawHubUpdateData {
    slug?: string
    all?: boolean
    agentId?: string
}

export interface PlaygroundClawHubContentProps {
    clawId: string
    agentId?: string
}

export interface ChatSidebarItemProps {
    agent: ClawAgent
    isActive: boolean
    onClick: () => void
    onConfigure: () => void
}

export interface ChatSelectedAgent {
    agentId: string
    clawId: string
}

export interface ClawWithAgents {
    claw: Claw
    agents: ClawAgent[]
    isLoading: boolean
    isReachable: boolean
}

export interface ChatSidebarProps {
    clawsWithAgents: ClawWithAgents[]
    selectedAgent: ChatSelectedAgent | null
    selectedClawId: string | null
    onAgentSelect: (selection: ChatSelectedAgent) => void
    onConfigureAgent: (agentId: string, clawId: string) => void
    onCreateAgent: (clawId: string, clawName: string) => void
    onOpenClawSettings: (clawId: string) => void
    onClose?: () => void
}

export interface ChatSidebarClawHeaderProps {
    claw: Claw
    isReachable: boolean
    isSelected: boolean
    statusConfig: StatusConfig
    onOpenClawSettings: (clawId: string) => void
    onCreateAgent: (clawId: string, clawName: string) => void
}

export interface ChatViewProps {
    claws: Claw[]
    agentQueries: UseQueryResult<ClawAgentsResponse>[]
    plans: Plan[]
    sshKeys: SSHKey[]
    selectedAgent: ChatSelectedAgent | null
    onAgentSelect: (selection: ChatSelectedAgent | null) => void
    onConfigureAgent: (agentId: string, clawId: string) => void
    onCreateAgent: (clawId: string, clawName: string) => void
    initialSettingsClawId?: string | null
    onSettingsClawChange?: (clawId: string | null) => void
    initialAgentTab?: PlaygroundAgentDetailTab
    onAgentTabChange?: (tab: PlaygroundAgentDetailTab | null) => void
    initialClawTab?: PlaygroundDetailTab
    onClawTabChange?: (tab: PlaygroundDetailTab | null) => void
}

export interface TruncateTooltipProps {
    content: string
    children: ReactNode
}