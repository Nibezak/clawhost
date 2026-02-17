import type { FC, ReactNode } from 'react'
import type { ChatSidebarProps } from '@/ts/Interfaces'

import { useMemo, useCallback } from 'react'
import { t } from '@openclaw/i18n'
import { RobotIcon } from '@phosphor-icons/react'
import { Skeleton } from '@/components/ui'
import { getStatusConfig } from '@/lib/claw-utils'
import ChatSidebarItem from '@/components/chat/ChatSidebarItem'
import ChatSidebarClawHeader from '@/components/chat/ChatSidebarClawHeader'

const ChatSidebar: FC<ChatSidebarProps> = ({
    clawsWithAgents,
    selectedAgent,
    selectedClawId,
    onAgentSelect,
    onConfigureAgent,
    onCreateAgent,
    onOpenClawSettings,
    onClose
}): ReactNode => {
    const statusConfigs = useMemo(() => getStatusConfig(), [])

    const handleAgentClick = useCallback((agentId: string, clawId: string) => {
        onAgentSelect({ agentId, clawId })
        onClose?.()
    }, [onAgentSelect, onClose])

    const handleClawSettings = useCallback((clawId: string) => {
        onOpenClawSettings(clawId)
        onClose?.()
    }, [onOpenClawSettings, onClose])

    if (clawsWithAgents.length === 0) {
        return (
            <div className='flex h-full w-full shrink-0 flex-col items-center justify-center px-6 md:w-[280px] md:border-r md:border-white/10'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-white/5'>
                    <RobotIcon className='h-5 w-5 text-gray-500' weight='duotone' />
                </div>
                <p className='mt-3 text-center text-xs text-gray-500'>
                    {t('chat.noAgentsDescription')}
                </p>
            </div>
        )
    }

    return (
        <div className='flex h-full w-full shrink-0 flex-col md:w-[280px] md:border-r md:border-white/10'>
            <div className='flex-1 overflow-y-auto p-3'>
                {clawsWithAgents.map(({ claw, agents, isLoading, isReachable }) => {
                    const status = statusConfigs[claw.status] || statusConfigs.unknown

                    return (
                        <div key={claw.id} className='mb-4 last:mb-0'>
                            <ChatSidebarClawHeader
                                claw={claw}
                                isReachable={isReachable}
                                isSelected={selectedClawId === claw.id && !selectedAgent}
                                statusConfig={status}
                                onOpenClawSettings={handleClawSettings}
                                onCreateAgent={onCreateAgent}
                            />
                            {!isReachable ? (
                                <div className='space-y-1.5 px-3 opacity-40'>
                                    <div className='flex items-center gap-3'>
                                        <Skeleton className='h-8 w-8 rounded-lg' />
                                        <div className='flex-1'>
                                            <Skeleton className='h-3.5 w-24 rounded' />
                                            <Skeleton className='mt-1 h-3 w-16 rounded' />
                                        </div>
                                    </div>
                                </div>
                            ) : isLoading && agents.length === 0 ? (
                                <div className='space-y-1.5 px-3'>
                                    <div className='flex items-center gap-3'>
                                        <Skeleton className='h-8 w-8 rounded-lg' />
                                        <div className='flex-1'>
                                            <Skeleton className='h-3.5 w-24 rounded' />
                                            <Skeleton className='mt-1 h-3 w-16 rounded' />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className='space-y-0.5'>
                                    {agents.map((agent) => (
                                        <ChatSidebarItem
                                            key={agent.id}
                                            agent={agent}
                                            isActive={
                                                selectedAgent?.agentId === agent.id &&
                                                selectedAgent?.clawId === claw.id
                                            }
                                            onClick={() => handleAgentClick(agent.id, claw.id)}
                                            onConfigure={() => onConfigureAgent(agent.id, claw.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ChatSidebar