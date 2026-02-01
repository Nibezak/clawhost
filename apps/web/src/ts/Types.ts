// Toast notification types
export type ToastType = 'success' | 'error' | 'warning' | 'info'

// View mode for instances display
export type ViewMode = 'list' | 'grid'

// Claw server status
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

// SSH Key modal copy state
export type CopiedFieldType = 'command' | 'private' | null

// SSH Key modal mode
export type SSHKeyModalMode = 'upload' | 'generate'
