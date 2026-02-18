import type { PreferencesState } from '@/ts/Interfaces'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import DASHBOARD_TABS from '@/lib/dashboardTabs'
import { STORAGE_KEYS } from '@/lib/storageKeys'

const VALID_TABS = new Set<string>(Object.values(DASHBOARD_TABS))

const usePreferencesStore = create<PreferencesState>()(
    persist(
        (set) => ({
            adminMode: false,
            setAdminMode: (mode) => set({ adminMode: mode }),
            dashboardTab: DASHBOARD_TABS.CHAT,
            setDashboardTab: (tab) => set({ dashboardTab: tab }),
            theme: 'dark',
            setTheme: (theme) => set({ theme })
        }),
        {
            name: STORAGE_KEYS.PREFERENCES,
            migrate: (persisted, version) => {
                const state = persisted as PreferencesState
                if (!VALID_TABS.has(state.dashboardTab)) {
                    state.dashboardTab = DASHBOARD_TABS.CHAT
                }
                if (version < 2) {
                    state.theme = state.theme || 'dark'
                }
                return state
            },
            version: 2
        }
    )
)

export default usePreferencesStore