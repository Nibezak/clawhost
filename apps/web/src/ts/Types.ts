export type ProviderType = 'hetzner' | 'digitalocean' | 'vultr'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export type ViewMode = 'list' | 'grid' | 'playground'

export type ClawStatus =
    | 'initializing'
    | 'starting'
    | 'running'
    | 'stopping'
    | 'off'
    | 'stopped'
    | 'deleting'
    | 'migrating'
    | 'rebuilding'
    | 'unknown'
    | 'creating'
    | 'configuring'
    | 'restarting'

export type CopiedFieldType = 'command' | 'private' | null

export type SSHKeyModalMode = 'upload' | 'generate'

export type UserRole = 'user' | 'admin'

export type PlaygroundNodeType = 'claw' | 'agent'

export type PlaygroundDetailTab = 'info' | 'logs' | 'diagnostics' | 'variables'

export type PlaygroundAgentDetailTab = 'chat' | 'configuration'

export type ClawAvatarSize = 'sm' | 'md' | 'lg'

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