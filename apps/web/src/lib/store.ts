import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ToastType = 'success' | 'error' | 'warning' | 'info'
export type ViewMode = 'list' | 'grid'

interface ToastData {
  message: string
  type: ToastType
  duration?: number
}

interface UIState {
  // Modal states
  isCreateModalOpen: boolean
  setCreateModalOpen: (open: boolean) => void

  // Toast/notification state
  toast: ToastData | null
  showToast: (message: string, type?: ToastType, duration?: number) => void
  hideToast: () => void
}

interface PreferencesState {
  // View mode for instances
  instancesViewMode: ViewMode
  setInstancesViewMode: (mode: ViewMode) => void
}

export const useUIStore = create<UIState>((set) => ({
  // Modal states
  isCreateModalOpen: false,
  setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),

  // Toast state
  toast: null,
  showToast: (message, type = 'info', duration = 5000) =>
    set({ toast: { message, type, duration } }),
  hideToast: () => set({ toast: null }),
}))

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      instancesViewMode: 'list',
      setInstancesViewMode: (mode) => set({ instancesViewMode: mode }),
    }),
    {
      name: 'clawhost-preferences',
    }
  )
)
