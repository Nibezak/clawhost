import type { FC, ReactNode } from 'react'
import type { ChatEmptyStateProps } from '@/ts/Interfaces'

import { t } from '@openclaw/i18n'
import { ChatTeardropTextIcon, WifiSlashIcon } from '@phosphor-icons/react'

const ChatEmptyState: FC<ChatEmptyStateProps> = ({ isError }): ReactNode => {
    if (isError) {
        return (
            <div className='flex h-full flex-col items-center justify-center gap-3 px-14 pb-16'>
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/5'>
                    <WifiSlashIcon
                        className='h-6 w-6 text-gray-500'
                        weight='duotone'
                    />
                </div>
                <div className='text-center'>
                    <p className='text-sm font-medium text-gray-300'>
                        {t('playground.chatConnectionFailed')}
                    </p>
                    <p className='mt-1 text-xs text-gray-500'>
                        {t('playground.chatConnectionFailedDescription')}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className='flex h-full flex-col items-center justify-center gap-3 px-14 pb-16'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/5'>
                <ChatTeardropTextIcon
                    className='h-6 w-6 text-gray-500'
                    weight='duotone'
                />
            </div>
            <div className='text-center'>
                <p className='text-sm font-medium text-gray-300'>
                    {t('playground.chatNoMessages')}
                </p>
                <p className='mt-1 text-xs text-gray-500'>
                    {t('playground.chatNoMessagesDescription')}
                </p>
            </div>
        </div>
    )
}

export default ChatEmptyState