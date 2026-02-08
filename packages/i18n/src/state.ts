import type { Translations } from './langs/en'
import type { Languages } from './types'

import { en } from './langs/en'

const state: {
    languages: Record<Languages, Translations>
    currentLanguage: Languages
} = {
    languages: { en },
    currentLanguage: 'en'
}

export default state