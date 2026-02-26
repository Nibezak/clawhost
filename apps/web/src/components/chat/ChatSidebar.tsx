import type { FC, ReactNode } from 'react'
import type { ChatSidebarProps } from '@/ts/Interfaces'

import { useMemo, useCallback } from 'react'
import { t } from '@openclaw/i18n'
import { RobotIcon } from '@phosphor-icons/react'
import { getStatusConfig } from '@/lib/claw-utils'
import ChatSidebarClawHeader from '@/components/chat/ChatSidebarClawHeader'
import ChatSidebarAgentList from '@/components/chat/ChatSidebarAgentList'

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
    const statusConfigs = useMemo(() => getStatusConfig(), [])

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
            <div className='flex-1 overflow-y-auto p-3'>
                {clawsWithAgents.map(
                    ({ claw, agents, isLoading, isReachable }) => {
                        const status =
                            statusConfigs[claw.status] || statusConfigs.unknown

                        return (
                            <div key={claw.id} className='mb-4 last:mb-0'>
                                <ChatSidebarClawHeader
                                    claw={claw}
                                    isReachable={isReachable}
                                    isSelected={
                                        selectedClawId === claw.id &&
                                        !selectedAgent
                                    }
                                    statusConfig={status}
                                    onOpenClawSettings={handleClawSettings}
                                    onCreateAgent={onCreateAgent}
                                />
                                <ChatSidebarAgentList
                                    claw={claw}
                                    agents={agents}
                                    isLoading={isLoading}
                                    isReachable={isReachable}
                                    selectedAgent={selectedAgent}
                                    activeConnectionState={activeConnectionState}
                                    onAgentClick={handleAgentClick}
                                    onConfigureAgent={onConfigureAgent}
                                    onCreateAgent={onCreateAgent}
                                />
                            </div>
                        )
                    }
                )}
            </div>
        </div>
    )
}

export default ChatSidebar