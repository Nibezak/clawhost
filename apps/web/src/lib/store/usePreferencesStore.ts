import type { PreferencesState } from '@/ts/Interfaces'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const usePreferencesStore = create<PreferencesState>()(
    persist(
        (set) => ({
            adminMode: false,
            setAdminMode: (mode) => set({ adminMode: mode })
        }),
        {
            name: 'clawhost-preferences'
        }
    )
)

export default usePreferencesStore