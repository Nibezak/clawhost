export type ProviderType = 'hetzner' | 'digitalocean' | 'vultr'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

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

export type UserRole = 'user' | 'admin'

export type RootTabParamList = {
    Claws: undefined
    Account: undefined
}