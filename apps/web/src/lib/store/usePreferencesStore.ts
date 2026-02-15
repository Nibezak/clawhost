import type { PreferencesState } from '@/ts/Interfaces'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const usePreferencesStore = create<PreferencesState>()(
    persist(
        (set) => ({
            instancesViewMode: 'playground',
            setInstancesViewMode: (mode) => set({ instancesViewMode: mode }),
            adminMode: false,
            setAdminMode: (mode) => set({ adminMode: mode })
        }),
        {
            name: 'clawhost-preferences'
        }
    )
)

export default usePreferencesStore