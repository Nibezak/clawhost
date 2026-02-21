import type { StatusConfig } from '@/ts/Interfaces'

import { t } from '@openclaw/i18n'

const getAgentStatusConfig = (status: string): StatusConfig => {
    switch (status) {
        case 'running':
            return {
                color: 'bg-green-500',
                bgColor: 'bg-green-500/10',
                label: t('dashboard.status.running')
            }
        case 'stopped':
            return {
                color: 'bg-gray-400',
                bgColor: 'bg-gray-400/10',
                label: t('dashboard.status.stopped')
            }
        case 'error':
            return {
                color: 'bg-red-500',
                bgColor: 'bg-red-500/10',
                label: t('dashboard.status.unreachable')
            }
        case 'starting':
            return {
                color: 'bg-yellow-500',
                bgColor: 'bg-yellow-500/10',
                label: t('dashboard.status.starting'),
                pulse: true
            }
        case 'stopping':
            return {
                color: 'bg-yellow-500',
                bgColor: 'bg-yellow-500/10',
                label: t('dashboard.status.stopping'),
                pulse: true
            }
        default:
            return {
                color: 'bg-gray-400',
                bgColor: 'bg-gray-400/10',
                label: t('dashboard.status.unknown')
            }
    }
}

export default getAgentStatusConfig