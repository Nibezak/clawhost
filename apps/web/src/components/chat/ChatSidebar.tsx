import type { FC, ReactNode } from 'react'
import type { ChatSidebarProps } from '@/ts/Interfaces'

import { useCallback } from 'react'
import { t } from '@openclaw/i18n'
import { RobotIcon, TreeStructureIcon, ListBulletsIcon } from '@phosphor-icons/react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui'
import { usePreferencesStore } from '@/lib/store'
import ChatSidebarTreeView from '@/components/chat/ChatSidebarTreeView'
import ChatSidebarListView from '@/components/chat/ChatSidebarListView'

const ChatSidebar: FC<ChatSidebarProps> = ({
    clawsWithAgents,
    selectedAgent,
    selectedClawId,
    activeConnectionState,
    onAgentSelect,
    onConfigureAgent,
    onCreateAgent,
    onOpenClawSettings,
    onClose
}): ReactNode => {
    const chatSidebarView = usePreferencesStore((s) => s.chatSidebarView)
    const setChatSidebarView = usePreferencesStore((s) => s.setChatSidebarView)

    const handleAgentClick = useCallback(
        (agentId: string, clawId: string) => {
            onAgentSelect({ agentId, clawId })
            onClose?.()
        },
        [onAgentSelect, onClose]
    )

    const handleClawSettings = useCallback(
        (clawId: string) => {
            onOpenClawSettings(clawId)
            onClose?.()
        },
        [onOpenClawSettings, onClose]
    )

    if (clawsWithAgents.length === 0) {
        return (
            <div className='md:border-border flex h-full w-full shrink-0 flex-col items-center justify-center px-6 md:w-[280px] md:border-r'>
                <div className='bg-foreground/5 flex h-10 w-10 items-center justify-center rounded-xl'>
                    <RobotIcon
                        className='text-muted-foreground h-5 w-5'
                        weight='duotone'
                    />
                </div>
                <p className='text-muted-foreground mt-3 text-center text-xs'>
                    {t('chat.noAgentsDescription')}
                </p>
            </div>
        )
    }

    return (
        <div className='bg-background md:border-border relative z-10 flex h-full w-full shrink-0 flex-col md:w-[280px] md:border-r'>
            <div className='flex items-center justify-end px-3 py-2'>
                <div className='border-border flex items-center rounded-lg border p-0.5'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => setChatSidebarView('tree')}
                                className={`flex items-center justify-center rounded-md p-1.5 transition-colors ${
                                    chatSidebarView === 'tree'
                                        ? 'bg-foreground/10 text-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <TreeStructureIcon
                                    className='h-3.5 w-3.5'
                                    weight={chatSidebarView === 'tree' ? 'fill' : 'regular'}
                                />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side='bottom'>
                            <p>{t('chat.viewTree')}</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => setChatSidebarView('list')}
                                className={`flex items-center justify-center rounded-md p-1.5 transition-colors ${
                                    chatSidebarView === 'list'
                                        ? 'bg-foreground/10 text-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <ListBulletsIcon
                                    className='h-3.5 w-3.5'
                                    weight={chatSidebarView === 'list' ? 'fill' : 'regular'}
                                />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side='bottom'>
                            <p>{t('chat.viewList')}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
            <div className='flex-1 overflow-y-auto p-3 pt-0'>
                {chatSidebarView === 'tree' ? (
                    <ChatSidebarTreeView
                        clawsWithAgents={clawsWithAgents}
                        selectedAgent={selectedAgent}
                        selectedClawId={selectedClawId}
                        activeConnectionState={activeConnectionState}
                        onAgentClick={handleAgentClick}
                        onConfigureAgent={onConfigureAgent}
                        onCreateAgent={onCreateAgent}
                        onOpenClawSettings={handleClawSettings}
                    />
                ) : (
                    <ChatSidebarListView
                        clawsWithAgents={clawsWithAgents}
                        selectedAgent={selectedAgent}
                        activeConnectionState={activeConnectionState}
                        onAgentClick={handleAgentClick}
                        onConfigureAgent={onConfigureAgent}
                    />
                )}
            </div>
        </div>
    )
}

export default ChatSidebar