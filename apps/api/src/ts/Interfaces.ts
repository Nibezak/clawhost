import type {
    ProviderType,
    SubscriptionStatus,
    WebhookEventType
} from '@/ts/Types'

export interface ApiResponse<T = null> {
    success: boolean
    data: T
    message: string
    code: number
    version: string
}

export interface ExportRateLimitData {
    retryAfter: number
}

export interface MagicLinkEmailProps {
    magicLink: string
}

export interface CloudProvider {
    createServer(
        name: string,
        serverType: string,
        location: string,
        rootPassword?: string,
        sshKeyIds?: number[],
        snapshotId?: string,
        userData?: string
    ): Promise<CreateServerResult>
    getServer(serverId: string): Promise<ServerStatus>
    getServers(): Promise<Map<string, ServerStatus>>
    startServer(serverId: string): Promise<void>
    stopServer(serverId: string): Promise<void>
    restartServer(serverId: string): Promise<void>
    deleteServer(serverId: string): Promise<void>
    getServerTypes(): Promise<ServerTypeInfo[]>
    getLocations(): Promise<LocationInfo[]>
    getRawServerTypes(): Promise<RawServerType[]>
    getDatacenters(): Promise<DatacenterAvailability[]>
    createSSHKey(name: string, publicKey: string): Promise<CreateSSHKeyResult>
    deleteSSHKey(keyId: number): Promise<void>
    getVolumePricing(): Promise<VolumePricingResult>
    createVolume(
        name: string,
        size: number,
        location: string,
        serverId?: number
    ): Promise<VolumeInfo>
    attachVolume(volumeId: number, serverId: number): Promise<void>
    detachVolume(volumeId: number): Promise<void>
    deleteVolume(volumeId: number): Promise<void>
    getVolume(volumeId: number): Promise<VolumeDetails>
}

export interface RawServerType {
    id: number
    name: string
}

export interface DatacenterAvailability {
    name: string
    locationName: string
    availableServerTypeIds: number[]
}

export interface HetznerServer {
    id: number
    name: string
    status: string
    public_net: {
        ipv4: { ip: string }
    }
}

export interface HetznerSSHKey {
    id: number
    name: string
    fingerprint: string
    public_key: string
    created: string
}

export interface HetznerServerType {
    id: number
    name: string
    description: string
    cores: number
    memory: number
    disk: number
    architecture: string
    prices: Array<{
        location: string
        price_hourly: { gross: string }
        price_monthly: { gross: string }
    }>
}

export interface HetznerLocation {
    id: number
    name: string
    description: string
    country: string
    city: string
}

export interface HetznerDatacenter {
    id: number
    name: string
    location: { name: string }
    server_types: {
        available: number[]
        supported: number[]
    }
}

export interface HetznerVolume {
    id: number
    name: string
    size: number
    location: { name: string }
    server: number | null
    status: string
    created: string
}

export interface HetznerVolumePricing {
    price_per_gb_month: { gross: string }
}

export interface HetznerCreateServerResponse {
    server: HetznerServer
    root_password: string
}

export interface HetznerServersResponse {
    servers: HetznerServer[]
    meta: {
        pagination: { total_entries: number; last_page: number }
    }
}

export interface HetznerServerResponse {
    server: HetznerServer
}

export interface HetznerServerTypesResponse {
    server_types: HetznerServerType[]
}

export interface HetznerLocationsResponse {
    locations: HetznerLocation[]
}

export interface HetznerDatacentersResponse {
    datacenters: HetznerDatacenter[]
}

export interface HetznerSSHKeysResponse {
    ssh_keys: HetznerSSHKey[]
}

export interface HetznerSSHKeyResponse {
    ssh_key: HetznerSSHKey
}

export interface HetznerPricingResponse {
    pricing: { volume: HetznerVolumePricing }
}

export interface HetznerVolumeResponse {
    volume: HetznerVolume
}

export interface DigitalOceanDroplet {
    id: number
    name: string
    status: string
    networks: {
        v4: Array<{
            ip_address: string
            type: string
        }>
    }
}

export interface DigitalOceanSize {
    slug: string
    description: string
    vcpus: number
    memory: number
    disk: number
    price_monthly: number
    price_hourly: number
    regions: string[]
    available: boolean
}

export interface DigitalOceanRegion {
    slug: string
    name: string
    available: boolean
    sizes: string[]
}

export interface DigitalOceanSSHKey {
    id: number
    name: string
    fingerprint: string
    public_key: string
}

export interface DigitalOceanVolume {
    id: string
    name: string
    size_gigabytes: number
    region: { slug: string }
    droplet_ids: number[]
    created_at: string
}

export interface DigitalOceanDropletResponse {
    droplet: DigitalOceanDroplet
}

export interface DigitalOceanDropletsResponse {
    droplets: DigitalOceanDroplet[]
    meta: { total: number }
    links: { pages?: { last?: string; next?: string } }
}

export interface DigitalOceanSizesResponse {
    sizes: DigitalOceanSize[]
}

export interface DigitalOceanRegionsResponse {
    regions: DigitalOceanRegion[]
}

export interface DigitalOceanSSHKeyResponse {
    ssh_key: DigitalOceanSSHKey
}

export interface DigitalOceanSSHKeysResponse {
    ssh_keys: DigitalOceanSSHKey[]
}

export interface DigitalOceanVolumeResponse {
    volume: DigitalOceanVolume
}

export interface VultrInstance {
    id: string
    label: string
    main_ip: string
    status: string
    plan: string
    region: string
    os: string
    ram: number
    disk: number
    vcpu_count: number
}

export interface VultrInstanceResponse {
    instance: VultrInstance
}

export interface VultrInstancesResponse {
    instances: VultrInstance[]
    meta: {
        total: number
        links: {
            next: string
            prev: string
        }
    }
}

export interface VultrPlan {
    id: string
    vcpu_count: number
    ram: number
    disk: number
    bandwidth: number
    monthly_cost: number
    locations: string[]
    type: string
}

export interface VultrPlansResponse {
    plans: VultrPlan[]
}

export interface VultrRegion {
    id: string
    city: string
    country: string
    continent: string
    options: string[]
}

export interface VultrRegionsResponse {
    regions: VultrRegion[]
}

export interface VultrSSHKey {
    id: string
    name: string
    ssh_key: string
}

export interface VultrSSHKeyResponse {
    ssh_key: VultrSSHKey
}

export interface VultrVolume {
    id: string
    label: string
    size_gb: number
    region: string
    status: string
    attached_to_instance: string
}

export interface VultrVolumeResponse {
    block: VultrVolume
}

export interface ServerStatus {
    status: string
    ip: string
}

export interface CreateServerResult {
    serverId: number
    ip: string
    rootPassword: string
}

export interface ServerTypeInfo {
    name: string
    description: string
    cores: number
    memory: number
    disk: number
    architecture: string
    priceHourly: number
    priceMonthly: number
}

export interface LocationInfo {
    id: string
    name: string
    city: string
    country: string
    disabled: boolean
}

export interface HetznerSSHKeyInfo {
    id: number
    name: string
    fingerprint: string
    publicKey: string
    createdAt: string
}

export interface CreateSSHKeyResult {
    id: number
    name: string
    fingerprint: string
}

export interface VolumeInfo {
    id: number
    size: number
    location: string
}

export interface VolumeDetails {
    id: number
    size: number
    status: string
    serverId: number | null
}

export interface VolumePricingResult {
    pricePerGbMonthly: number
}

export interface CheckoutSession {
    id: string
    url: string
    status: string
    customerId?: string
    customerEmail?: string
    productId: string
    amount: number
    currency: string
    metadata?: Record<string, string>
}

export interface CreateCheckoutParams {
    productId: string
    customerEmail: string
    customerId?: string
    successUrl?: string
    cancelUrl?: string
    metadata?: Record<string, string>
}

export interface PolarSubscription {
    id: string
    status: SubscriptionStatus
    customerId: string
    productId: string
    amount: number
    currency: string
    currentPeriodStart?: Date
    currentPeriodEnd?: Date
    cancelAtPeriodEnd: boolean
    canceledAt?: Date
    endedAt?: Date
    metadata?: Record<string, string>
}

export interface PolarSubscriptionRaw {
    id: string
    status: string
    customerId: string
    productId: string
    amount?: number
    currency?: string
    currentPeriodStart?: string
    currentPeriodEnd?: string
    cancelAtPeriodEnd?: boolean
    canceledAt?: string
    endedAt?: string
    metadata?: Record<string, string>
}

export interface PolarOrder {
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

export interface PolarOrdersPage {
    items: PolarOrder[]
    totalCount: number
    maxPage: number
}

export interface PolarOrderRaw {
    id: string
    status: string
    amount: number
    subtotalAmount: number
    discountAmount: number
    taxAmount: number
    currency?: string
    billingReason: string
    product?: { name: string; id: string } | null
    productId?: string | null
    subscriptionId?: string | null
    discount?: { name: string } | null
    createdAt: Date | string
}

export interface PolarProduct {
    id: string
    name: string
    description?: string
    isRecurring: boolean
    isArchived: boolean
}

export interface PolarProductRaw {
    id: string
    name: string
    description?: string | null
    isRecurring: boolean
    isArchived: boolean
}

export interface CreatePolarProductParams {
    name: string
    description?: string
    priceAmountCents: number
    recurringInterval?: 'month' | 'year'
}

export interface PolarCustomer {
    id: string
    email: string
    name?: string
    externalId?: string
}

export interface CreatePolarCustomerParams {
    email: string
    name?: string
    externalId: string
}

export interface WebhookEvent<T = unknown> {
    type: WebhookEventType
    data: T
}

export interface SubscriptionWebhookData {
    id: string
    status: string
    customerId: string
    customerEmail?: string
    productId: string
    priceId?: string
    amount: number
    currency: string
    currentPeriodStart?: string
    currentPeriodEnd?: string
    cancelAtPeriodEnd: boolean
    canceledAt?: string
    endedAt?: string
    metadata?: Record<string, string>
}

export interface CheckoutWebhookData {
    id: string
    status: string
    customerId?: string
    customerEmail?: string
    productId: string
    subscriptionId?: string
    amount: number
    currency: string
    metadata?: Record<string, string>
}

export interface WebhookHandlers {
    onCheckoutCreated?: (data: CheckoutWebhookData) => Promise<void>
    onCheckoutUpdated?: (data: CheckoutWebhookData) => Promise<void>
    onSubscriptionCreated?: (data: SubscriptionWebhookData) => Promise<void>
    onSubscriptionActive?: (data: SubscriptionWebhookData) => Promise<void>
    onSubscriptionUpdated?: (data: SubscriptionWebhookData) => Promise<void>
    onSubscriptionCanceled?: (data: SubscriptionWebhookData) => Promise<void>
    onSubscriptionRevoked?: (data: SubscriptionWebhookData) => Promise<void>
    onSubscriptionUncanceled?: (data: SubscriptionWebhookData) => Promise<void>
}

export interface ProvisionClawParams {
    pendingClawId: string
    subscriptionId: string
    customerId: string
    productId: string
}

export interface ProvisionClawResponse {
    success: boolean
    clawId?: string
    error?: string
}

export interface ClawCleanupData {
    provider: ProviderType
    providerServerId: string | null
    subdomain: string | null
}

export interface SendMagicLinkBody {
    email: string
    redirectUrl: string
}

export interface SendOtpBody {
    email: string
}

export interface VerifyOtpBody {
    email: string
    code: string
}

export interface OtpCodeEmailProps {
    code: string
}

export interface CreateSSHKeyBody {
    name: string
    publicKey: string
}

export interface UpdateProfileBody {
    name?: string
}

export interface CreateClawBody {
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

export interface InitiateClawPurchaseBody {
    name?: string
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

export interface CloudflareDNSRecord {
    id: string
    name: string
}

export interface CloudflareDNSLookup {
    id: string
    ip: string
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

export interface DiagnosticsRepairResponse {
    success: boolean
    message: string
}

export interface ClawFileEntry {
    path: string
    name: string
    isJson: boolean
}

export interface ClawFilesResponse {
    files: ClawFileEntry[]
}

export interface ReadClawFileBody {
    path: string
}

export interface ReadClawFileResponse {
    content: string
    path: string
}

export interface UpdateClawFileBody {
    path: string
    content: string
}

export interface UpdateClawFileResponse {
    success: boolean
    message: string
}

export interface BillingPeriod {
    start?: string
    end?: string
}

export interface DeleteClawResponse {
    scheduled: boolean
    deletionScheduledAt?: string
    claw?: Record<string, unknown>
}

export interface InitiateClawPurchaseResponse {
    checkoutUrl: string
    checkoutId: string
    pendingClawId: string
    expiresAt: string
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

export interface UpdateClawEnvVarsBody {
    envVars: Record<string, string>
}

export interface GetAgentConfigBody {
    agentId: string
}

export interface UpdateAgentConfigBody {
    agentId: string
    name?: string
    model: string | null
    envVars: Record<string, string>
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

export interface CreateClawAgentBody {
    name: string
    model?: string | null
    envVars?: Record<string, string>
}

export interface DeleteClawAgentBody {
    agentId: string
}