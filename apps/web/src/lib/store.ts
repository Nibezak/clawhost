import type { PreferencesState, UIState } from '@/ts/Interfaces'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type { ToastType, ViewMode } from '@/ts/Types'

export const useUIStore = create<UIState>((set) => ({
    isCreateModalOpen: false,
    setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),

    toast: null,
    showToast: (message, type = 'info', duration = 5000) =>
        set({ toast: { message, type, duration } }),
    hideToast: () => set({ toast: null })
}))

export const usePreferencesStore = create<PreferencesState>()(
    persist(
        (set) => ({
            instancesViewMode: 'list',
            setInstancesViewMode: (mode) => set({ instancesViewMode: mode })
        }),
        {
            name: 'clawhost-preferences'
        }
    )
)