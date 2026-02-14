import type { UIState } from '@/ts/Interfaces'

import { create } from 'zustand'

const useUIStore = create<UIState>((set) => ({
    toast: null,
    showToast: (message, type = 'info', duration = 5000) =>
        set({ toast: { message, type, duration } }),
    hideToast: () => set({ toast: null })
}))

export default useUIStore