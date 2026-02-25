import type { FC, ReactNode } from 'react'
import type { ChatSidebarTreeViewProps } from '@/ts/Interfaces'

import { useMemo } from 'react'
import { getStatusConfig } from '@/lib/claw-utils'
import ChatSidebarClawHeader from '@/components/chat/ChatSidebarClawHeader'
import ChatSidebarAgentList from '@/components/chat/ChatSidebarAgentList'

const ChatSidebarTreeView: FC<ChatSidebarTreeViewProps> = ({
    clawsWithAgents,
    selectedAgent,
    selectedClawId,
    activeConnectionState,
    readOnly,
    onAgentClick,
    onConfigureAgent,
    onCreateAgent,
    onOpenClawSettings
}): ReactNode => {
    const statusConfigs = useMemo(() => getStatusConfig(), [])

    return (
        <>
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
                                readOnly={readOnly}
                                onOpenClawSettings={onOpenClawSettings}
                                onCreateAgent={onCreateAgent}
                            />
                            <ChatSidebarAgentList
                                claw={claw}
                                agents={agents}
                                isLoading={isLoading}
                                isReachable={isReachable}
                                selectedAgent={selectedAgent}
                                activeConnectionState={activeConnectionState}
                                readOnly={readOnly}
                                onAgentClick={onAgentClick}
                                onConfigureAgent={onConfigureAgent}
                                onCreateAgent={onCreateAgent}
                            />
                        </div>
                    )
                }
            )}
        </>
    )
}

export default ChatSidebarTreeView