import type { Language } from '@/ts/Types'

import { useLayoutEffect } from 'react'
import { setLanguage } from '@openclaw/i18n'
import { usePreferencesStore } from '@/lib/store'

const useLanguageEffect = (): Language => {
    const language = usePreferencesStore((s) => s.language)

    useLayoutEffect(() => {
        setLanguage(language)
        document.documentElement.lang = language
    }, [language])

    return language
}

export default useLanguageEffect