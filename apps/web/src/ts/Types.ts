import type { clawStatus } from '@openclaw/shared'
import type AGENT_DETAIL_TABS from '@/lib/agentDetailTabs'
import type CLAW_DETAIL_TABS from '@/lib/clawDetailTabs'
import type DASHBOARD_TABS from '@/lib/dashboardTabs'
import type THEMES from '@/lib/themes'
import type LANGUAGES from '@/lib/languages'

export type ProviderType = 'hetzner' | 'digitalocean' | 'vultr' | 'local'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export type ClawStatus = (typeof clawStatus)[keyof typeof clawStatus]

export type CopiedFieldType = 'command' | 'private' | null

export type SSHKeyModalMode = 'upload' | 'generate'

export type UserRole = 'user' | 'admin'

export type AuthMethod = 'email' | 'google' | 'github'

export type OAuthProvider = 'google' | 'github'

export type PlaygroundNodeType = 'claw' | 'agent'

export type PlaygroundDetailTab =
    (typeof CLAW_DETAIL_TABS)[keyof typeof CLAW_DETAIL_TABS]

export type PlaygroundAgentDetailTab =
    (typeof AGENT_DETAIL_TABS)[keyof typeof AGENT_DETAIL_TABS]

export type CompareFeatureStatus = 'yes' | 'no' | 'partial'

export type ClawAvatarSize = 'sm' | 'md' | 'lg'

export type GatewayConnectionState =
    | 'disconnected'
    | 'connecting'
    | 'authenticating'
    | 'connected'
    | 'error'

export type ChatMessageRole = 'user' | 'assistant'

export type ChatMessageStatus = 'complete' | 'streaming' | 'error' | 'aborted'

export type LoginLoadingMethod = 'email' | 'google' | 'github' | 'resend' | null

export type ChatContentBlockType = 'text' | 'image'

export type GatewayEventHandler = (payload: unknown) => void

export type GatewayStateListener = (state: GatewayConnectionState) => void

export type Route =
    | '/'
    | '/login'
    | '/claws'
    | '/ssh-keys'
    | '/account'
    | '/billing'
    | '/terms'
    | '/privacy'
    | '/changelog'
    | '/blog'
    | '/blog/:slug'
    | '/full-comparison'

export type DashboardTab = (typeof DASHBOARD_TABS)[keyof typeof DASHBOARD_TABS]

export type ThemeMode = (typeof THEMES)[keyof typeof THEMES]

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES]

export type ClawFileType =
    | 'json'
    | 'markdown'
    | 'javascript'
    | 'typescript'
    | 'yaml'
    | 'text'
    | 'unknown'

export type ChatSidebarViewMode = 'tree' | 'list'

export type ChatTypingIndicator = 'thinking' | 'writing' | null