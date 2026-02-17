import type { FC, ReactNode } from 'react'

import { t } from '@openclaw/i18n'
import { ClawMascot } from '@/components'

const ChatEmptyState: FC = (): ReactNode => {
    return (
        <div className='flex h-full flex-col items-center justify-center gap-3 px-14 pb-16'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/5'>
                <ClawMascot className='h-6 w-6' />
            </div>
            <div className='text-center'>
                <p className='text-sm font-medium text-gray-300'>
                    {t('chat.selectAgent')}
                </p>
                <p className='mt-1 text-xs text-gray-500'>
                    {t('chat.selectAgentDescription')}
                </p>
            </div>
        </div>
    )
}

export default ChatEmptyState