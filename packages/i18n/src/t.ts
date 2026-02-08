import { en, type Translations } from './langs/en'

type NestedKeyOf<T> = T extends object
    ? {
          [K in keyof T & string]: T[K] extends object
              ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
              : `${K}`
      }[keyof T & string]
    : never

export type TranslationKey = NestedKeyOf<Translations>

type Languages = 'en'

const languages: Record<Languages, Translations> = {
    en
}

let currentLanguage: Languages = 'en'

export function setLanguage(lang: Languages): void {
    currentLanguage = lang
}

export function getLanguage(): Languages {
    return currentLanguage
}

function getNestedValue(obj: unknown, path: string): string {
    const keys = path.split('.')
    let current: unknown = obj

    for (const key of keys) {
        if (current === null || current === undefined) {
            return path
        }
        if (typeof current === 'object' && key in current) {
            current = (current as Record<string, unknown>)[key]
        } else {
            return path
        }
    }

    return typeof current === 'string' ? current : path
}

export function t(
    key: TranslationKey,
    params?: Record<string, string>
): string {
    const translations = languages[currentLanguage]
    let value = getNestedValue(translations, key)

    if (params) {
        for (const [paramKey, paramValue] of Object.entries(params)) {
            value = value.replace(
                new RegExp(`{{${paramKey}}}`, 'g'),
                paramValue
            )
        }
    }

    return value
}