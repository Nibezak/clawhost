import type { FC, ReactNode } from 'react'
import type { ScheduledDeletionBannerProps } from '@/ts/Interfaces'

import { t } from '@openclaw/i18n'
import { ClockCountdown } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

const ScheduledDeletionBanner: FC<ScheduledDeletionBannerProps> = ({
    deletionScheduledAt,
    onCancelDeletion,
    isLoading
}): ReactNode => {
    return (
        <div className='mt-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3'>
            <div className='flex items-center gap-2'>
                <ClockCountdown className='h-5 w-5 text-gray-400' />
                <div>
                    <p className='text-sm font-medium text-gray-300'>
                        {t('dashboard.scheduledForDeletion')}
                    </p>
                    <p className='text-xs text-gray-500'>
                        {t('dashboard.deletionDate', {
                            date: new Date(
                                deletionScheduledAt
                            ).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })
                        })}
                    </p>
                </div>
            </div>
            <Button
                variant='outline'
                size='sm'
                onClick={onCancelDeletion}
                disabled={isLoading}
            >
                {t('dashboard.cancelDeletion')}
            </Button>
        </div>
    )
}

export default ScheduledDeletionBanner