import type { Language } from '@/ts/Types'

import { getLanguage } from '@openclaw/i18n'
import { LANGUAGES } from '@/lib/constants'

const LOCALE_MAP: Record<Language, string> = {
    [LANGUAGES.EN]: 'en-US',
    [LANGUAGES.FR]: 'fr-FR',
    [LANGUAGES.ES]: 'es-ES',
    [LANGUAGES.DE]: 'de-DE'
}

const getLocale = (): string => LOCALE_MAP[getLanguage() as Language] || 'en-US'

export default getLocale