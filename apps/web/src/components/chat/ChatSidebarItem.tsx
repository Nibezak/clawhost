import type { FC, ReactNode } from 'react'
import type { ChatSidebarItemProps } from '@/ts/Interfaces'

import { t } from '@openclaw/i18n'
import { GearSixIcon } from '@phosphor-icons/react'
import { AndroidLogoIcon } from '@phosphor-icons/react'
import { aiModels } from '@/lib/claw-utils'

const ChatSidebarItem: FC<ChatSidebarItemProps> = ({
    agent,
    isActive,
    isLast,
    onClick,
    onConfigure
}): ReactNode => {
    const modelName = agent.model
        ? aiModels.find((m) => m.id === agent.model)?.name || agent.model
        : null

    return (
        <div className='relative flex py-0.5'>
            <div className='relative ml-[19px] flex w-7 shrink-0 justify-start'>
                <div
                    className={`bg-border absolute left-0 w-px ${isLast ? 'top-0 h-[22px]' : '-top-1 -bottom-1'}`}
                />
                <div className='bg-border absolute top-[22px] left-0 h-px w-[calc(100%-6px)]' />
            </div>
            <button
                onClick={onClick}
                className={`group flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-1 text-left transition-colors ${
                    isActive
                        ? 'bg-foreground/10 text-foreground'
                        : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
                }`}
            >
                <div className='bg-foreground/5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md'>
                    <AndroidLogoIcon className='h-3.5 w-3.5' weight='fill' />
                </div>
                <div className='min-w-0 flex-1'>
                    <p className='text-foreground truncate text-[13px] font-medium'>{agent.name}</p>
                    {modelName ? (
                        <p className='text-muted-foreground truncate text-[11px]'>
                            {modelName}
                        </p>
                    ) : (
                        <p className='text-muted-foreground truncate text-[11px] italic'>
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
                    className='text-muted-foreground hover:bg-foreground/10 hover:text-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors'
                >
                    <GearSixIcon className='h-3 w-3' weight='bold' />
                </div>
            </button>
        </div>
    )
}

export default ChatSidebarItem