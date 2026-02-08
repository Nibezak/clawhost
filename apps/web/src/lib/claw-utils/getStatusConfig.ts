import type { StatusConfig } from '@/ts/Interfaces'

import { t } from '@openclaw/i18n'

const getStatusConfig = (): Record<string, StatusConfig> => {
    return {
        running: {
            color: 'bg-green-500',
            bgColor: 'bg-green-500/10',
            label: t('dashboard.status.running')
        },
        stopped: {
            color: 'bg-gray-400',
            bgColor: 'bg-gray-400/10',
            label: t('dashboard.status.stopped')
        },
        off: {
            color: 'bg-gray-400',
            bgColor: 'bg-gray-400/10',
            label: t('dashboard.status.stopped')
        },
        starting: {
            color: 'bg-yellow-500',
            bgColor: 'bg-yellow-500/10',
            label: t('dashboard.status.starting'),
            pulse: true
        },
        stopping: {
            color: 'bg-yellow-500',
            bgColor: 'bg-yellow-500/10',
            label: t('dashboard.status.stopping'),
            pulse: true
        },
        creating: {
            color: 'bg-blue-500',
            bgColor: 'bg-blue-500/10',
            label: t('dashboard.status.creating'),
            pulse: true
        },
        configuring: {
            color: 'bg-blue-500',
            bgColor: 'bg-blue-500/10',
            label: t('dashboard.status.configuring'),
            pulse: true
        },
        initializing: {
            color: 'bg-blue-500',
            bgColor: 'bg-blue-500/10',
            label: t('dashboard.status.initializing'),
            pulse: true
        },
        migrating: {
            color: 'bg-purple-500',
            bgColor: 'bg-purple-500/10',
            label: t('dashboard.status.migrating'),
            pulse: true
        },
        rebuilding: {
            color: 'bg-orange-500',
            bgColor: 'bg-orange-500/10',
            label: t('dashboard.status.rebuilding'),
            pulse: true
        },
        deleting: {
            color: 'bg-red-500',
            bgColor: 'bg-red-500/10',
            label: t('dashboard.status.deleting'),
            pulse: true
        },
        unknown: {
            color: 'bg-gray-400',
            bgColor: 'bg-gray-400/10',
            label: t('dashboard.status.unknown')
        }
    }
}

export default getStatusConfig