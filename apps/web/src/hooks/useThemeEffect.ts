import type { ThemeMode } from '@/ts/Types'

import { useEffect } from 'react'
import { usePreferencesStore } from '@/lib/store'

const resolveTheme = (mode: ThemeMode): 'dark' | 'light' => {
    if (mode === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
    }
    return mode
}

const applyTheme = (mode: ThemeMode) => {
    const resolved = resolveTheme(mode)
    if (resolved === 'dark') {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}

const useThemeEffect = (): void => {
    const theme = usePreferencesStore((s) => s.theme)

    useEffect(() => {
        applyTheme(theme)

        if (theme !== 'system') return

        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = () => applyTheme('system')
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [theme])
}

export default useThemeEffect