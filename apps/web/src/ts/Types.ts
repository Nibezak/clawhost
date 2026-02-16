export type ProviderType = 'hetzner' | 'digitalocean' | 'vultr'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

import type { clawStatus } from '@openclaw/shared'

export type ClawStatus = typeof clawStatus[keyof typeof clawStatus]

export type CopiedFieldType = 'command' | 'private' | null

export type SSHKeyModalMode = 'upload' | 'generate'

export type UserRole = 'user' | 'admin'

export type PlaygroundNodeType = 'claw' | 'agent'

export type PlaygroundDetailTab = 'info' | 'variables' | 'logs' | 'diagnostics' | 'skills'

export type PlaygroundAgentDetailTab = 'chat' | 'configuration' | 'channels' | 'skills'

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
    | '/posts'
    | '/posts/:slug'