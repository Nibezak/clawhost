import type { FC, ReactNode } from 'react'
import type { ChatStatusBarProps } from '@/ts/Interfaces'

import { t } from '@openclaw/i18n'

const ChatStatusBar: FC<ChatStatusBarProps> = ({
    connectionState
}): ReactNode => {
    if (connectionState === 'connected') return null

    const isConnecting =
        connectionState === 'connecting' || connectionState === 'authenticating'
    const isError = connectionState === 'error'

    return (
        <div className='flex items-center gap-2 border-b border-white/10 px-4 py-2'>
            <div
                className={`h-2 w-2 rounded-full ${
                    isConnecting
                        ? 'animate-pulse bg-yellow-500'
                        : isError
                          ? 'bg-red-500'
                          : 'bg-gray-500'
                }`}
            />
            <span className='text-xs text-gray-400'>
                {isConnecting && connectionState === 'connecting'
                    ? t('playground.chatConnecting')
                    : isConnecting
                      ? t('playground.chatAuthenticating')
                      : isError
                        ? t('playground.chatError')
                        : t('playground.chatDisconnected')}
            </span>
        </div>
    )
}

export default ChatStatusBar