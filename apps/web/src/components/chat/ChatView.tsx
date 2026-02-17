import type { FC, ReactNode } from 'react'
import type {
    ChatViewProps,
    ChatSelectedAgent,
    ClawWithAgents
} from '@/ts/Interfaces'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { clawStatus } from '@openclaw/shared'
import AGENT_DETAIL_TABS from '@/lib/agentDetailTabs'
import ChatSidebar from '@/components/chat/ChatSidebar'
import ChatEmptyState from '@/components/chat/ChatEmptyState'
import {
    AgentChat,
    PlaygroundAgentDetailPanel,
    PlaygroundDetailPanel
} from '@/components/playground'

const ChatView: FC<ChatViewProps> = ({
    claws,
    agentQueries,
    plans,
    sshKeys,
    selectedAgent,
    onAgentSelect,
    onConfigureAgent: _onConfigureAgent,
    onCreateAgent,
    initialSettingsClawId,
    onSettingsClawChange,
    initialAgentTab,
    onAgentTabChange,
    initialClawTab,
    onClawTabChange
}): ReactNode => {
    const [configAgent, setConfigAgent] =
        useState<ChatSelectedAgent | null>(() =>
            initialAgentTab && selectedAgent ? selectedAgent : null
        )
    const [settingsClawId, setSettingsClawId] = useState<string | null>(
        initialSettingsClawId || null
    )
    const isInitialMount = useRef(true)

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
            return
        }
        if (!configAgent) {
            onAgentTabChange?.(null)
        }
        onSettingsClawChange?.(configAgent ? null : settingsClawId)
    }, [configAgent, settingsClawId])

    const clawsWithAgents = useMemo((): ClawWithAgents[] => {
        return claws.map((claw, index) => {
            const query = agentQueries[index]
            const agents = query?.data?.agents || []
            const isLoading = query?.isLoading ?? true
            const isReachable =
                (claw.status === clawStatus.running ||
                    claw.status === clawStatus.unreachable) &&
                !!claw.ip
            return { claw, agents, isLoading, isReachable }
        })
    }, [claws, agentQueries])

    const activeClaw = useMemo(() => {
        if (!selectedAgent) return null
        return claws.find((c) => c.id === selectedAgent.clawId) || null
    }, [claws, selectedAgent])

    const activeAgent = useMemo(() => {
        if (!selectedAgent || !activeClaw) return null
        const clawIndex = claws.findIndex((c) => c.id === selectedAgent.clawId)
        const query = clawIndex >= 0 ? agentQueries[clawIndex] : null
        const agents = query?.data?.agents || []
        return agents.find((a) => a.id === selectedAgent.agentId) || null
    }, [selectedAgent, activeClaw, claws, agentQueries])

    const configClaw = useMemo(() => {
        if (!configAgent) return null
        return claws.find((c) => c.id === configAgent.clawId) || null
    }, [claws, configAgent])

    const configAgentData = useMemo(() => {
        if (!configAgent || !configClaw) return null
        const clawIndex = claws.findIndex((c) => c.id === configAgent.clawId)
        const query = clawIndex >= 0 ? agentQueries[clawIndex] : null
        const agents = query?.data?.agents || []
        return agents.find((a) => a.id === configAgent.agentId) || null
    }, [configAgent, configClaw, claws, agentQueries])

    const configIsOnlyAgent = useMemo(() => {
        if (!configAgent) return false
        const clawIndex = claws.findIndex((c) => c.id === configAgent.clawId)
        const query = clawIndex >= 0 ? agentQueries[clawIndex] : null
        const agents = query?.data?.agents || []
        return agents.length <= 1
    }, [configAgent, claws, agentQueries])

    const settingsClaw = useMemo(() => {
        if (!settingsClawId) return null
        return claws.find((c) => c.id === settingsClawId) || null
    }, [claws, settingsClawId])

    const handleAgentSelect = useCallback((selection: ChatSelectedAgent) => {
        setSettingsClawId(null)
        onAgentSelect(selection)
    }, [onAgentSelect])

    const handleOpenConfig = useCallback((agentId: string, clawId: string) => {
        setConfigAgent({ agentId, clawId })
        setSettingsClawId(null)
        onAgentSelect({ agentId, clawId })
        onAgentTabChange?.(AGENT_DETAIL_TABS.CONFIGURATION)
    }, [onAgentSelect, onAgentTabChange])

    const handleCloseConfig = useCallback(() => {
        setConfigAgent(null)
    }, [])

    const handleOpenClawSettings = useCallback((clawId: string) => {
        setSettingsClawId(clawId)
        setConfigAgent(null)
        onAgentSelect(null)
    }, [onAgentSelect])

    const handleCloseClawSettings = useCallback(() => {
        setSettingsClawId(null)
    }, [])

    const handleClosePanels = useCallback(() => {
        setConfigAgent(null)
        setSettingsClawId(null)
    }, [])

    const panelOpen = !!configAgent

    return (
        <div className='relative flex h-full w-full overflow-hidden'>
            <div>
                <ChatSidebar
                    clawsWithAgents={clawsWithAgents}
                    selectedAgent={selectedAgent}
                    selectedClawId={settingsClawId}
                    onAgentSelect={handleAgentSelect}
                    onConfigureAgent={handleOpenConfig}
                    onCreateAgent={onCreateAgent}
                    onOpenClawSettings={handleOpenClawSettings}
                />
            </div>
            <div className='flex min-w-0 flex-1 flex-col' onClick={panelOpen ? handleClosePanels : undefined}>
                {settingsClaw && !selectedAgent ? (
                    <PlaygroundDetailPanel
                        key={`fullscreen-${settingsClaw.id}`}
                        claw={settingsClaw}
                        plans={plans}
                        sshKeys={sshKeys}
                        onClose={handleCloseClawSettings}
                        initialTab={initialClawTab}
                        onTabChange={onClawTabChange}
                        fullScreen
                    />
                ) : activeAgent && activeClaw ? (
                    <AgentChat
                        key={`${activeClaw.id}-${activeAgent.id}`}
                        agentId={activeAgent.id}
                        agentName={activeAgent.name}
                        clawId={activeClaw.id}
                        subdomain={activeClaw.subdomain}
                        gatewayToken={activeClaw.gatewayToken}
                        agentModel={activeAgent.model}
                        onConfigure={() => handleOpenConfig(activeAgent.id, activeClaw.id)}
                        configureDisabled={!!configAgent}
                    />
                ) : (
                    <ChatEmptyState />
                )}
            </div>
            <AnimatePresence mode='wait'>
                {configAgentData && configClaw && (
                    <PlaygroundAgentDetailPanel
                        key={`config-${configClaw.id}-${configAgentData.id}`}
                        agent={configAgentData}
                        clawId={configClaw.id}
                        clawName={configClaw.name}
                        isOnlyAgent={configIsOnlyAgent}
                        gatewayToken={configClaw.gatewayToken}
                        subdomain={configClaw.subdomain}
                        initialTab={initialAgentTab || AGENT_DETAIL_TABS.CONFIGURATION}
                        onTabChange={onAgentTabChange}
                        onClose={handleCloseConfig}
                        hideChatTab
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export default ChatView