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

export type CopiedFieldType = 'command' | 'private' | null

export type SSHKeyModalMode = 'upload' | 'generate'