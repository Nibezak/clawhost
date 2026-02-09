export type ProviderType = 'hetzner' | 'digitalocean'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export type ViewMode = 'list' | 'grid'

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