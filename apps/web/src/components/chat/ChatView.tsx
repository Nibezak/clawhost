import type { FC, ReactNode } from 'react'
import type {
    ChatViewProps,
    ChatSelectedAgent,
    ClawWithAgents
} from '@/ts/Interfaces'
import type { GatewayConnectionState } from '@/ts/Types'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { clawStatus } from '@openclaw/shared'
import { t } from '@openclaw/i18n'
import { ListIcon, XIcon, GearSixIcon } from '@phosphor-icons/react'
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
    const [configAgent, setConfigAgent] = useState<ChatSelectedAgent | null>(
        () => (initialAgentTab && selectedAgent ? selectedAgent : null)
    )
    const [settingsClawId, setSettingsClawId] = useState<string | null>(
        initialSettingsClawId || null
    )
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
    const [activeConnectionState, setActiveConnectionState] =
        useState<GatewayConnectionState>('disconnected')
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

    const closeMobileSidebar = useCallback(() => {
        setMobileSidebarOpen(false)
    }, [])

    const handleAgentSelect = useCallback(
        (selection: ChatSelectedAgent) => {
            setSettingsClawId(null)
            onAgentSelect(selection)
            setMobileSidebarOpen(false)
        },
        [onAgentSelect]
    )

    const handleOpenConfig = useCallback(
        (agentId: string, clawId: string) => {
            setConfigAgent({ agentId, clawId })
            setSettingsClawId(null)
            onAgentSelect({ agentId, clawId })
            onAgentTabChange?.(AGENT_DETAIL_TABS.CONFIGURATION)
            setMobileSidebarOpen(false)
        },
        [onAgentSelect, onAgentTabChange]
    )

    const handleCloseConfig = useCallback(() => {
        setConfigAgent(null)
    }, [])

    const handleOpenClawSettings = useCallback(
        (clawId: string) => {
            setSettingsClawId(clawId)
            setConfigAgent(null)
            onAgentSelect(null)
            setMobileSidebarOpen(false)
        },
        [onAgentSelect]
    )

    const handleCloseClawSettings = useCallback(() => {
        setSettingsClawId(null)
    }, [])

    const handleClosePanels = useCallback(() => {
        setConfigAgent(null)
        setSettingsClawId(null)
    }, [])

    const handleConnectionStateChange = useCallback(
        (state: GatewayConnectionState) => {
            setActiveConnectionState(state)
        },
        []
    )

    const panelOpen = !!configAgent

    const mobileLabel = useMemo(() => {
        if (activeAgent) return activeAgent.name
        if (settingsClaw) return settingsClaw.name
        return t('chat.selectAgent')
    }, [activeAgent, settingsClaw])

    return (
        <div className='relative flex h-full w-full overflow-hidden'>
            <div className='playground-grid pointer-events-none absolute inset-0 opacity-50' />
            <div className='hidden md:block'>
                <ChatSidebar
                    clawsWithAgents={clawsWithAgents}
                    selectedAgent={selectedAgent}
                    selectedClawId={settingsClawId}
                    activeConnectionState={activeConnectionState}
                    onAgentSelect={handleAgentSelect}
                    onConfigureAgent={handleOpenConfig}
                    onCreateAgent={onCreateAgent}
                    onOpenClawSettings={handleOpenClawSettings}
                />
            </div>
            <div className='flex min-w-0 flex-1 flex-col'>
                {!configAgent && !(settingsClaw && !selectedAgent) && (
                    <div
                        className={`flex items-center gap-2 px-4 py-2.5 md:hidden ${mobileSidebarOpen ? 'bg-background' : ''}`}
                    >
                        <button
                            onClick={() =>
                                setMobileSidebarOpen(!mobileSidebarOpen)
                            }
                            className='text-muted-foreground hover:bg-foreground/10 hover:text-foreground rounded-lg p-1.5 transition-colors'
                            aria-label={t('chat.openSidebar')}
                        >
                            {mobileSidebarOpen ? (
                                <XIcon className='h-5 w-5' weight='bold' />
                            ) : (
                                <ListIcon className='h-5 w-5' weight='bold' />
                            )}
                        </button>
                        <span className='text-foreground/80 min-w-0 flex-1 truncate text-sm font-medium'>
                            {mobileLabel}
                        </span>
                        {activeAgent && activeClaw && !mobileSidebarOpen && (
                            <button
                                onClick={() =>
                                    handleOpenConfig(
                                        activeAgent.id,
                                        activeClaw.id
                                    )
                                }
                                className='text-muted-foreground hover:bg-foreground/10 hover:text-foreground shrink-0 rounded-lg p-1.5 transition-colors'
                            >
                                <GearSixIcon
                                    className='h-4 w-4'
                                    weight='bold'
                                />
                            </button>
                        )}
                    </div>
                )}
                <div
                    className='relative flex min-h-0 flex-1 flex-col'
                    onClick={panelOpen ? handleClosePanels : undefined}
                >
                    <AnimatePresence>
                        {mobileSidebarOpen && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className='absolute inset-0 z-20 bg-black/50 md:hidden'
                                    onClick={closeMobileSidebar}
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.15 }}
                                    className='bg-background absolute inset-0 z-30 overflow-y-auto md:hidden'
                                >
                                    <ChatSidebar
                                        clawsWithAgents={clawsWithAgents}
                                        selectedAgent={selectedAgent}
                                        selectedClawId={settingsClawId}
                                        activeConnectionState={activeConnectionState}
                                        onAgentSelect={handleAgentSelect}
                                        onConfigureAgent={handleOpenConfig}
                                        onCreateAgent={onCreateAgent}
                                        onOpenClawSettings={
                                            handleOpenClawSettings
                                        }
                                        onClose={closeMobileSidebar}
                                    />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
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
                            onConfigure={() =>
                                handleOpenConfig(activeAgent.id, activeClaw.id)
                            }
                            configureDisabled={!!configAgent}
                            onConnectionStateChange={handleConnectionStateChange}
                        />
                    ) : (
                        <ChatEmptyState />
                    )}
                </div>
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
                        initialTab={
                            initialAgentTab || AGENT_DETAIL_TABS.CONFIGURATION
                        }
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