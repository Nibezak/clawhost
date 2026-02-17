import type { FC, ReactNode } from 'react'
import type { ChatSidebarItemProps } from '@/ts/Interfaces'

import { t } from '@openclaw/i18n'
import { GearSix } from '@phosphor-icons/react'
import { ClawMascot } from '@/components'
import { aiModels } from '@/lib/claw-utils'

const ChatSidebarItem: FC<ChatSidebarItemProps> = ({
    agent,
    isActive,
    onClick,
    onConfigure
}): ReactNode => {
    const modelName = agent.model
        ? aiModels.find((m) => m.id === agent.model)?.name || agent.model
        : null

    return (
        <button
            onClick={onClick}
            className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                isActive
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
        >
            <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5'>
                <ClawMascot className='h-4 w-4' />
            </div>
            <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>{agent.name}</p>
                {modelName ? (
                    <p className='truncate text-xs text-gray-500'>{modelName}</p>
                ) : (
                    <p className='truncate text-xs italic text-gray-600'>
                        {t('chat.notConfigured')}
                    </p>
                )}
            </div>
            <div
                role='button'
                tabIndex={-1}
                onClick={(e) => {
                    e.stopPropagation()
                    onConfigure()
                }}
                className='hidden h-6 w-6 shrink-0 items-center justify-center rounded-md text-gray-500 opacity-0 transition-all hover:bg-white/10 hover:text-white group-hover:opacity-100 md:flex'
            >
                <GearSix className='h-3.5 w-3.5' weight='bold' />
            </div>
        </button>
    )
}

export default ChatSidebarItem