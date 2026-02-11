import type { StatusConfig } from '@/ts/Interfaces'

import { t } from '@openclaw/i18n'
import COLORS from '@/lib/theme/colors'

const getStatusConfig = (): Record<string, StatusConfig> => {
    return {
        running: {
            color: COLORS.statusRunning,
            bgColor: COLORS.statusRunningBg,
            label: t('dashboard.status.running')
        },
        stopped: {
            color: COLORS.statusStopped,
            bgColor: COLORS.statusStoppedBg,
            label: t('dashboard.status.stopped')
        },
        off: {
            color: COLORS.statusStopped,
            bgColor: COLORS.statusStoppedBg,
            label: t('dashboard.status.stopped')
        },
        starting: {
            color: COLORS.statusStarting,
            bgColor: COLORS.statusStartingBg,
            label: t('dashboard.status.starting'),
            pulse: true
        },
        stopping: {
            color: COLORS.statusStarting,
            bgColor: COLORS.statusStartingBg,
            label: t('dashboard.status.stopping'),
            pulse: true
        },
        creating: {
            color: COLORS.statusCreating,
            bgColor: COLORS.statusCreatingBg,
            label: t('dashboard.status.creating'),
            pulse: true
        },
        configuring: {
            color: COLORS.statusCreating,
            bgColor: COLORS.statusCreatingBg,
            label: t('dashboard.status.configuring'),
            pulse: true
        },
        initializing: {
            color: COLORS.statusCreating,
            bgColor: COLORS.statusCreatingBg,
            label: t('dashboard.status.initializing'),
            pulse: true
        },
        migrating: {
            color: COLORS.statusMigrating,
            bgColor: COLORS.statusMigratingBg,
            label: t('dashboard.status.migrating'),
            pulse: true
        },
        rebuilding: {
            color: COLORS.statusRebuilding,
            bgColor: COLORS.statusRebuildingBg,
            label: t('dashboard.status.rebuilding'),
            pulse: true
        },
        restarting: {
            color: COLORS.statusStarting,
            bgColor: COLORS.statusStartingBg,
            label: t('dashboard.status.restarting'),
            pulse: true
        },
        deleting: {
            color: COLORS.statusDeleting,
            bgColor: COLORS.statusDeletingBg,
            label: t('dashboard.status.deleting'),
            pulse: true
        },
        unknown: {
            color: COLORS.statusStopped,
            bgColor: COLORS.statusStoppedBg,
            label: t('dashboard.status.unknown')
        }
    }
}

export default getStatusConfig