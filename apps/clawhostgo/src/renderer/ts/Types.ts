type AppView = 'home' | 'settings'

type ToastType = 'success' | 'error' | 'warning' | 'info'

type ProviderType = 'hetzner' | 'digitalocean' | 'vultr'

import type { clawStatus } from '@openclaw/shared'

type ClawStatus = typeof clawStatus[keyof typeof clawStatus]

type UserRole = 'user' | 'admin'

export type { AppView, ToastType, ProviderType, ClawStatus, UserRole }