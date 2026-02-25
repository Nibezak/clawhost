import type { PreferencesState } from '@/ts/Interfaces'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setLanguage as setI18nLanguage } from '@openclaw/i18n'
import DASHBOARD_TABS from '@/lib/dashboardTabs'
import THEMES from '@/lib/themes'
import LANGUAGES from '@/lib/languages'
import STORAGE_KEYS from '@/lib/storageKeys'

const VALID_TABS = new Set<string>(Object.values(DASHBOARD_TABS))

const usePreferencesStore = create<PreferencesState>()(
    persist(
        (set) => ({
            adminMode: false,
            setAdminMode: (mode) => set({ adminMode: mode }),
            dashboardTab: DASHBOARD_TABS.CHAT,
            setDashboardTab: (tab) => set({ dashboardTab: tab }),
            theme: THEMES.DARK,
            setTheme: (theme) => set({ theme }),
            language: LANGUAGES.EN,
            setLanguage: (language) => {
                setI18nLanguage(language)
                set({ language })
            },
            openLinksWindowed: false,
            setOpenLinksWindowed: (value) => set({ openLinksWindowed: value }),
            chatSidebarView: 'tree',
            setChatSidebarView: (view) => set({ chatSidebarView: view })
        }),
        {
            name: STORAGE_KEYS.PREFERENCES,
            migrate: (persisted, version) => {
                const state = persisted as PreferencesState
                if (!VALID_TABS.has(state.dashboardTab)) {
                    state.dashboardTab = DASHBOARD_TABS.CHAT
                }
                if (version < 2) {
                    state.theme = state.theme || THEMES.SYSTEM
                }
                if (version < 3) {
                    state.language = state.language || LANGUAGES.EN
                }
                if (version < 4) {
                    state.openLinksWindowed = state.openLinksWindowed ?? false
                }
                if (version < 5) {
                    state.chatSidebarView = state.chatSidebarView || 'tree'
                }
                return state
            },
            version: 5
        }
    )
)

export default usePreferencesStore