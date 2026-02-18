import type { FC, ReactNode } from 'react'
import type { ChatSidebarItemProps } from '@/ts/Interfaces'

import { t } from '@openclaw/i18n'
import { GearSixIcon } from '@phosphor-icons/react'
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
                    ? 'bg-foreground/10 text-foreground'
                    : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
            }`}
        >
            <div className='bg-foreground/5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg'>
                <ClawMascot className='h-4 w-4' />
            </div>
            <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>{agent.name}</p>
                {modelName ? (
                    <p className='text-muted-foreground truncate text-xs'>
                        {modelName}
                    </p>
                ) : (
                    <p className='text-muted-foreground truncate text-xs italic'>
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
                className='text-muted-foreground hover:bg-foreground/10 hover:text-foreground hidden h-6 w-6 shrink-0 items-center justify-center rounded-md opacity-0 transition-all group-hover:opacity-100 md:flex'
            >
                <GearSixIcon className='h-3.5 w-3.5' weight='bold' />
            </div>
        </button>
    )
}

export default ChatSidebarItem