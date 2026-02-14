type AppView = 'home' | 'settings'

type ToastType = 'success' | 'error' | 'warning' | 'info'

type ProviderType = 'hetzner' | 'digitalocean' | 'vultr'

type ClawStatus =
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

type UserRole = 'user' | 'admin'

export type { AppView, ToastType, ProviderType, ClawStatus, UserRole }