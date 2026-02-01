import type { ReactNode } from 'react'
import type { User } from 'firebase/auth'
import type { ClawStatus, ToastType, ViewMode } from '@/ts/Types'

// ============================================
// API / Data Model Interfaces
// ============================================

export interface Volume {
  id: string
  name: string
  size: number
  status: string
}

export interface Claw {
  id: string
  name: string
  status: ClawStatus
  ip: string | null
  planId: string
  location: string | null
  rootPassword: string | null
  sshKeyId: string | null
  hetznerServerId: string | null
  subdomain: string | null
  gatewayToken: string | null
  volumes?: Volume[]
  createdAt: string
}

export interface VolumePricing {
  pricePerGbMonthly: number
  minSize: number
  maxSize: number
}

export interface Plan {
  id: string
  name: string
  cpu: number
  memory: number
  disk: number
  priceHourly: number
  priceMonthly: number
  architecture: string
}

export interface Location {
  id: string
  name: string
  city: string
  country: string
}

export interface SSHKey {
  id: string
  name: string
  fingerprint: string
  publicKey: string
  createdAt: string
}

export interface UserProfile {
  id: string
  email: string
  name: string | null
  createdAt: string
}

export interface UserStats {
  clawCount: number
}

// ============================================
// Store Interfaces
// ============================================

export interface ToastData {
  message: string
  type: ToastType
  duration?: number
}

export interface UIState {
  isCreateModalOpen: boolean
  setCreateModalOpen: (open: boolean) => void
  toast: ToastData | null
  showToast: (message: string, type?: ToastType, duration?: number) => void
  hideToast: () => void
}

export interface PreferencesState {
  instancesViewMode: ViewMode
  setInstancesViewMode: (mode: ViewMode) => void
}

// ============================================
// Auth Interfaces
// ============================================

export interface AuthContextType {
  user: User | null
  loading: boolean
  sendOtp: (email: string) => Promise<void>
  verifyOtp: (email: string) => Promise<void>
  signOut: () => Promise<void>
}

// ============================================
// Component Props Interfaces
// ============================================

export interface NavLink {
  label: string
  href: string
  id: string
}

export interface HeaderProps {
  showNavLinks?: boolean
  navLinks?: NavLink[]
  activeSection?: string
}

export interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export interface PageTitleProps {
  title: string
}

export interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

// ============================================
// Dashboard Component Interfaces
// ============================================

export interface StatusConfig {
  color: string
  bgColor: string
  label: string
  pulse?: boolean
}

export interface ClawCardProps {
  claw: Claw
  sshKeys: SSHKey[]
  plans: Plan[]
  viewMode?: ViewMode
}

export interface CopyableFieldProps {
  label: string
  value: string
}

export interface CreateClawModalProps {
  plans: Plan[]
  locations: Location[]
  sshKeys: SSHKey[]
  volumePricing?: VolumePricing
  preselectedPlanId?: string | null
  onClose: () => void
  onNavigateToSSHKeys: () => void
}

// ============================================
// SSH Keys Component Interfaces
// ============================================

export interface SSHKeyCardProps {
  sshKey: SSHKey
}

export interface CreateSSHKeyModalProps {
  onClose: () => void
}

export interface GeneratedKeyPair {
  publicKey: string
  privateKey: string
}

export interface ProtectedRouteProps {
  children: ReactNode
}

// ============================================
// Hook Interfaces
// ============================================

export interface CreateClawData {
  name: string
  planId: string
  location: string
  password?: string
  sshKeyId?: string
  volumeSize?: number
}

export interface CreateSSHKeyData {
  name: string
  publicKey: string
}

export interface UpdateProfileData {
  name?: string
}
