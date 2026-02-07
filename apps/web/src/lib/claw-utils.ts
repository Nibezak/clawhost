import type { StatusConfig } from '@/ts/Interfaces'
import { t } from '@openclaw/i18n'

export function generatePassword(length = 16): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => chars[byte % chars.length]).join('')
}

export function generateSlug(id: string): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789' // Removed confusing chars: i, l, o, 0, 1
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash = hash & hash
  }
  let slug = ''
  let num = Math.abs(hash)
  for (let i = 0; i < 7; i++) {
    slug += chars[num % chars.length]
    num = Math.floor(num / chars.length) + id.charCodeAt(i % id.length)
  }
  return slug
}

export const locationFlags: Record<string, string> = {
  ash: '\u{1F1FA}\u{1F1F8}', // Ashburn, USA
  hil: '\u{1F1FA}\u{1F1F8}', // Hillsboro, USA
  fsn1: '\u{1F1E9}\u{1F1EA}', // Falkenstein, Germany
  nbg1: '\u{1F1E9}\u{1F1EA}', // Nuremberg, Germany
  hel1: '\u{1F1EB}\u{1F1EE}', // Helsinki, Finland
  sin: '\u{1F1F8}\u{1F1EC}', // Singapore
}

export const locationNames: Record<string, string> = {
  ash: 'Ashburn, USA',
  hil: 'Hillsboro, USA',
  fsn1: 'Falkenstein, Germany',
  nbg1: 'Nuremberg, Germany',
  hel1: 'Helsinki, Finland',
  sin: 'Singapore',
}

export function getStatusConfig(): Record<string, StatusConfig> {
  return {
    running: { color: 'bg-green-500', bgColor: 'bg-green-500/10', label: t('dashboard.status.running') },
    stopped: { color: 'bg-gray-400', bgColor: 'bg-gray-400/10', label: t('dashboard.status.stopped') },
    off: { color: 'bg-gray-400', bgColor: 'bg-gray-400/10', label: t('dashboard.status.stopped') },
    starting: {
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-500/10',
      label: t('dashboard.status.starting'),
      pulse: true,
    },
    stopping: {
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-500/10',
      label: t('dashboard.status.stopping'),
      pulse: true,
    },
    creating: { color: 'bg-blue-500', bgColor: 'bg-blue-500/10', label: t('dashboard.status.creating'), pulse: true },
    initializing: {
      color: 'bg-blue-500',
      bgColor: 'bg-blue-500/10',
      label: t('dashboard.status.initializing'),
      pulse: true,
    },
    migrating: {
      color: 'bg-purple-500',
      bgColor: 'bg-purple-500/10',
      label: t('dashboard.status.migrating'),
      pulse: true,
    },
    rebuilding: {
      color: 'bg-orange-500',
      bgColor: 'bg-orange-500/10',
      label: t('dashboard.status.rebuilding'),
      pulse: true,
    },
    deleting: { color: 'bg-red-500', bgColor: 'bg-red-500/10', label: t('dashboard.status.deleting'), pulse: true },
    unknown: { color: 'bg-gray-400', bgColor: 'bg-gray-400/10', label: t('dashboard.status.unknown') },
  }
}
