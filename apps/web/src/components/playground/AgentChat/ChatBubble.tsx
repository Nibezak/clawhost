import type { FC, ReactNode } from 'react'
import type { ChatBubbleProps } from '@/ts/Interfaces'

import { t } from '@openclaw/i18n'
import { Stop, Warning } from '@phosphor-icons/react'

const ChatBubble: FC<ChatBubbleProps> = ({ message }): ReactNode => {
    const isUser = message.role === 'user'

    if (isUser) {
        return (
            <div className='flex justify-end'>
                <div className='max-w-[85%] rounded-2xl rounded-br-md bg-[#ef5350]/15 px-3.5 py-2.5'>
                    <p className='whitespace-pre-wrap text-sm text-gray-200'>
                        {message.content}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className='flex justify-start'>
            <div className='max-w-[85%] rounded-2xl rounded-bl-md bg-white/5 px-3.5 py-2.5'>
                <p className='whitespace-pre-wrap text-sm text-gray-300'>
                    {message.content}
                    {message.status === 'streaming' && (
                        <span className='ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-gray-400' />
                    )}
                </p>
                {message.status === 'error' && (
                    <div className='mt-2 flex items-center gap-1.5'>
                        <Warning className='h-3 w-3 text-red-400' />
                        <span className='text-[11px] text-red-400'>
                            {t('playground.chatErrorMessage')}
                        </span>
                    </div>
                )}
                {message.status === 'aborted' && (
                    <div className='mt-2 flex items-center gap-1.5'>
                        <Stop className='h-3 w-3 text-yellow-500' />
                        <span className='text-[11px] text-yellow-500'>
                            {t('playground.chatAbortedMessage')}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatBubble