import type { FC, ReactNode } from 'react'
import type { Claw, ChatSelectedAgent } from '@/ts/Interfaces'
import type {
    DashboardTab,
    PlaygroundAgentDetailTab,
    PlaygroundDetailTab,
    ProviderType
} from '@/ts/Types'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { t } from '@openclaw/i18n'
import { useUIStore, usePreferencesStore } from '@/lib/store'
import { ROUTES, DASHBOARD_TABS, AGENT_DETAIL_TABS, CLAW_DETAIL_TABS } from '@/lib'
import {
    useClaws,
    useAdminClaws,
    useSSHKeys,
    usePlans,
    useLocations,
    useVolumePricing,
    usePlanAvailability
} from '@/hooks'
import { useAllClawAgents, usePlaygroundGraph } from '@/hooks'
import {
    EmptyState,
    ErrorState,
    PageTitle,
    ActionButton,
    ClawMascot,
    Logo
} from '@/components'
import { ChatCircleDotsIcon, GraphIcon, LightningIcon } from '@phosphor-icons/react'
import { CreateClawModal } from '@/components/dashboard'
import {
    PlaygroundCanvas,
    PlaygroundDetailPanel,
    PlaygroundAgentDetailPanel,
    PlaygroundLoadingState,
    CreateAgentModal
} from '@/components/playground'
import { ChatView } from '@/components/chat'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/hooks'
import { UserDropdown } from '@/components'

const Dashboard: FC = (): ReactNode => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [showCreate, setShowCreate] = useState(false)
    const [preselectedPlanId, setPreselectedPlanId] = useState<string | null>(
        null
    )
    const [preselectedProvider, setPreselectedProvider] =
        useState<ProviderType | null>(null)
    const [awaitingClaw, setAwaitingClaw] = useState(
        () => searchParams.get('payment') === 'success'
    )
    const [selectedClawId, setSelectedClawId] = useState<string | null>(null)
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
    const [selectedAgentClawId, setSelectedAgentClawId] = useState<
        string | null
    >(null)
    const [chatSelectedAgent, setChatSelectedAgent] =
        useState<ChatSelectedAgent | null>(null)
    const [chatSettingsClawId, setChatSettingsClawId] = useState<
        string | null
    >(null)
    const [chatAgentTab, setChatAgentTab] =
        useState<PlaygroundAgentDetailTab | null>(null)
    const [playgroundAgentTab, setPlaygroundAgentTab] =
        useState<PlaygroundAgentDetailTab | null>(null)
    const [playgroundClawTab, setPlaygroundClawTab] =
        useState<PlaygroundDetailTab | null>(null)
    const [chatClawTab, setChatClawTab] =
        useState<PlaygroundDetailTab | null>(null)
    const [createAgentClawId, setCreateAgentClawId] = useState<string | null>(
        null
    )
    const [createAgentClawName, setCreateAgentClawName] = useState('')
    const isRestoringFromUrl = useRef(false)
    const { showToast } = useUIStore()
    const {
        adminMode: adminModeRaw,
        dashboardTab,
        setDashboardTab
    } = usePreferencesStore()

    const [minLoadingMet, setMinLoadingMet] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setMinLoadingMet(true), 1500)
        return () => clearTimeout(timer)
    }, [])

    const { user, loading: authLoading, cachedProfile, signOut } = useAuth()
    const { data: profile } = useProfile({
        enabled: !!user,
        staleTime: 1000 * 60 * 5
    })
    const isAdmin = profile?.role === 'admin'
    const adminMode = !!isAdmin && adminModeRaw

    const displayName =
        profile?.name ||
        cachedProfile?.name ||
        user?.email ||
        cachedProfile?.email ||
        ''

    useEffect(() => {
        if (awaitingClaw) {
            showToast(t('dashboard.paymentSuccess'), 'success')
        }
    }, [])

    useEffect(() => {
        const planParam = searchParams.get('plan')
        const deployParam = searchParams.get('deploy')
        const providerParam = searchParams.get(
            'provider'
        ) as ProviderType | null
        if (planParam) {
            setPreselectedPlanId(planParam)
            if (providerParam) setPreselectedProvider(providerParam)
            setShowCreate(true)
        } else if (deployParam) {
            setShowCreate(true)
        }
        if (planParam || deployParam || searchParams.get('payment')) {
            const preserved: Record<string, string> = {}
            const tab = searchParams.get('tab')
            const agent = searchParams.get('agent')
            const claw = searchParams.get('claw')
            const agentTab = searchParams.get('agentTab')
            const clawTab = searchParams.get('clawTab')
            const settingsClaw = searchParams.get('settingsClaw')
            if (tab) preserved.tab = tab
            if (agent) preserved.agent = agent
            if (claw) preserved.claw = claw
            if (agentTab) preserved.agentTab = agentTab
            if (clawTab) preserved.clawTab = clawTab
            if (settingsClaw) preserved.settingsClaw = settingsClaw
            setSearchParams(preserved, { replace: true })
        }
    }, [searchParams, setSearchParams])

    useEffect(() => {
        const tabParam = searchParams.get('tab') as DashboardTab | null
        const agentParam = searchParams.get('agent')
        const clawParam = searchParams.get('claw')
        const agentTabParam = searchParams.get(
            'agentTab'
        ) as PlaygroundAgentDetailTab | null
        const clawTabParam = searchParams.get(
            'clawTab'
        ) as PlaygroundDetailTab | null

        if (!tabParam && !agentParam && !clawParam) return

        isRestoringFromUrl.current = true

        if (tabParam === DASHBOARD_TABS.CHAT || tabParam === DASHBOARD_TABS.PLAYGROUND) {
            setDashboardTab(tabParam)
        }

        const effectiveTab = tabParam || dashboardTab
        const settingsClawParam = searchParams.get('settingsClaw')

        const validAgentTabs: PlaygroundAgentDetailTab[] = [
            AGENT_DETAIL_TABS.CHAT,
            AGENT_DETAIL_TABS.CHANNELS,
            AGENT_DETAIL_TABS.SKILLS,
            AGENT_DETAIL_TABS.CONFIGURATION
        ]
        const validChatAgentTabs: PlaygroundAgentDetailTab[] = [
            AGENT_DETAIL_TABS.CONFIGURATION,
            AGENT_DETAIL_TABS.CHANNELS,
            AGENT_DETAIL_TABS.SKILLS
        ]
        const validClawTabs: PlaygroundDetailTab[] = [
            CLAW_DETAIL_TABS.INFO,
            CLAW_DETAIL_TABS.VARIABLES,
            CLAW_DETAIL_TABS.LOGS,
            CLAW_DETAIL_TABS.DIAGNOSTICS,
            CLAW_DETAIL_TABS.SKILLS
        ]

        if (agentParam && clawParam) {
            if (effectiveTab === DASHBOARD_TABS.CHAT) {
                setChatSelectedAgent({
                    agentId: agentParam,
                    clawId: clawParam
                })
                if (agentTabParam) {
                    setChatAgentTab(
                        validChatAgentTabs.includes(agentTabParam)
                            ? agentTabParam
                            : AGENT_DETAIL_TABS.CONFIGURATION
                    )
                }
            } else {
                setSelectedAgentId(agentParam)
                setSelectedAgentClawId(clawParam)
                setSelectedClawId(null)
                if (agentTabParam) {
                    setPlaygroundAgentTab(
                        validAgentTabs.includes(agentTabParam)
                            ? agentTabParam
                            : AGENT_DETAIL_TABS.CHAT
                    )
                }
            }
        } else if (clawParam && effectiveTab === DASHBOARD_TABS.PLAYGROUND) {
            setSelectedClawId(clawParam)
            setSelectedAgentId(null)
            setSelectedAgentClawId(null)
            if (clawTabParam) {
                setPlaygroundClawTab(
                    validClawTabs.includes(clawTabParam)
                        ? clawTabParam
                        : CLAW_DETAIL_TABS.INFO
                )
            }
        }

        if (effectiveTab === DASHBOARD_TABS.CHAT && settingsClawParam) {
            setChatSettingsClawId(settingsClawParam)
            if (clawTabParam) {
                setChatClawTab(
                    validClawTabs.includes(clawTabParam)
                        ? clawTabParam
                        : CLAW_DETAIL_TABS.INFO
                )
            }
        }

        requestAnimationFrame(() => {
            isRestoringFromUrl.current = false
        })
    }, [])

    useEffect(() => {
        if (isRestoringFromUrl.current) return
        const params: Record<string, string> = {}
        params.tab = dashboardTab
        if (dashboardTab === DASHBOARD_TABS.CHAT) {
            if (chatSelectedAgent) {
                params.agent = chatSelectedAgent.agentId
                params.claw = chatSelectedAgent.clawId
            }
            if (chatAgentTab) {
                params.agentTab = chatAgentTab
            } else if (chatSettingsClawId) {
                params.settingsClaw = chatSettingsClawId
                if (chatClawTab) params.clawTab = chatClawTab
            }
        } else if (dashboardTab === DASHBOARD_TABS.PLAYGROUND) {
            if (selectedAgentId && selectedAgentClawId) {
                params.agent = selectedAgentId
                params.claw = selectedAgentClawId
                if (playgroundAgentTab) params.agentTab = playgroundAgentTab
            } else if (selectedClawId) {
                params.claw = selectedClawId
                if (playgroundClawTab) params.clawTab = playgroundClawTab
            }
        }
        setSearchParams(params, { replace: true })
    }, [
        dashboardTab,
        chatSelectedAgent,
        chatAgentTab,
        chatSettingsClawId,
        chatClawTab,
        selectedAgentId,
        selectedAgentClawId,
        selectedClawId,
        playgroundAgentTab,
        playgroundClawTab
    ])

    const handleConfigureAgent = useCallback(
        (agentId: string, clawId: string) => {
            setDashboardTab(DASHBOARD_TABS.PLAYGROUND)
            setSelectedAgentId(agentId)
            setSelectedAgentClawId(clawId)
            setSelectedClawId(null)
            setPlaygroundAgentTab(AGENT_DETAIL_TABS.CONFIGURATION)
        },
        [setDashboardTab]
    )

    const handleCreateAgent = useCallback(
        (clawId: string, clawName: string) => {
            setCreateAgentClawId(clawId)
            setCreateAgentClawName(clawName)
        },
        []
    )

    const {
        data: claws,
        isLoading: isClawsLoading,
        isError,
        refetch
    } = useClaws()
    const {
        data: adminClaws,
        isLoading: isAdminClawsLoading,
        isError: isAdminClawsError,
        refetch: refetchAdmin
    } = useAdminClaws(adminMode)

    useEffect(() => {
        if (awaitingClaw && !isClawsLoading) {
            setAwaitingClaw(false)
        }
    }, [awaitingClaw, isClawsLoading])

    const displayedClaws = useMemo((): Claw[] => {
        if (adminMode) return adminClaws || []
        return claws || []
    }, [claws, adminMode, adminClaws])

    const { plans: hetznerPlans } = usePlans('hetzner')
    const { plans: digitaloceanPlans } = usePlans('digitalocean')
    const plans = [...(hetznerPlans || []), ...(digitaloceanPlans || [])]
    const { data: locations } = useLocations()
    const { data: sshKeys } = useSSHKeys()
    const { data: volumePricing } = useVolumePricing()
    const { data: planAvailability } = usePlanAvailability()

    const activeClawsLoading = adminMode ? isAdminClawsLoading : isClawsLoading
    const activeIsError = adminMode ? isAdminClawsError : isError
    const activeRefetch = adminMode ? refetchAdmin : refetch
    const isLoading =
        authLoading ||
        (!awaitingClaw && (activeClawsLoading || !minLoadingMet))

    const graphClaws = displayedClaws
    const agentQueries = useAllClawAgents(graphClaws)
    const { nodes, edges } = usePlaygroundGraph(graphClaws, agentQueries)

    const activeClaws = adminMode ? adminClaws : claws
    const selectedClaw =
        selectedClawId && !selectedAgentId
            ? activeClaws?.find((c) => c.id === selectedClawId) || null
            : null

    const selectedAgentClaw = selectedAgentClawId
        ? activeClaws?.find((c) => c.id === selectedAgentClawId) || null
        : null

    const selectedAgentResult =
        selectedAgentId && selectedAgentClaw
            ? (() => {
                  const clawIndex = graphClaws.findIndex(
                      (c) => c.id === selectedAgentClawId
                  )
                  const query = clawIndex >= 0 ? agentQueries[clawIndex] : null
                  const agents = query?.data?.agents || []
                  const agent =
                      agents.find((a) => a.id === selectedAgentId) || null
                  return {
                      agent,
                      isOnly: agents.length <= 1
                  }
              })()
            : null

    const selectedAgent = selectedAgentResult?.agent || null
    const isSelectedAgentOnly = selectedAgentResult?.isOnly || false

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 flex flex-col bg-[#0a0a0f] text-white ${dashboardTab === DASHBOARD_TABS.PLAYGROUND ? 'playground-grid' : ''}`}
        >
            <div
                className={`playground-gradient pointer-events-none fixed inset-0 ${dashboardTab === DASHBOARD_TABS.CHAT ? 'opacity-30' : ''}`}
            />
            <PageTitle
                title={
                    adminMode ? t('dashboard.adminTitle') : t('dashboard.title')
                }
                description={
                    adminMode
                        ? t('dashboard.adminDescription')
                        : t('dashboard.description')
                }
            />

            <div className='relative z-10 flex items-center justify-between border-b border-white/10 bg-[#0a0a0f]/80 px-6 py-3 backdrop-blur-xl'>
                <div className='flex items-center gap-3'>
                    <Logo />
                    <div className='flex items-center rounded-lg border border-white/10 p-0.5'>
                        <button
                            onClick={() => setDashboardTab(DASHBOARD_TABS.CHAT)}
                            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${dashboardTab === DASHBOARD_TABS.CHAT ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <ChatCircleDotsIcon
                                className='h-3.5 w-3.5'
                                weight={
                                    dashboardTab === DASHBOARD_TABS.CHAT
                                        ? 'fill'
                                        : 'regular'
                                }
                            />
                            <span className={dashboardTab === DASHBOARD_TABS.CHAT ? '' : 'hidden md:inline'}>
                                {t('dashboard.chatTab')}
                            </span>
                        </button>
                        <button
                            onClick={() => setDashboardTab(DASHBOARD_TABS.PLAYGROUND)}
                            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${dashboardTab === DASHBOARD_TABS.PLAYGROUND ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <GraphIcon
                                className='h-3.5 w-3.5'
                                weight={
                                    dashboardTab === DASHBOARD_TABS.PLAYGROUND
                                        ? 'fill'
                                        : 'regular'
                                }
                            />
                            <span className={dashboardTab === DASHBOARD_TABS.PLAYGROUND ? '' : 'hidden md:inline'}>
                                {t('dashboard.playgroundTab')}
                            </span>
                        </button>
                    </div>
                </div>

                <div className='flex items-center gap-3'>
                    {!adminMode &&
                        !isLoading &&
                        displayedClaws &&
                        displayedClaws.length > 0 && (
                            <ActionButton
                                onClick={() => setShowCreate(true)}
                                icon={
                                    <LightningIcon
                                        className='h-5 w-5'
                                        weight='fill'
                                    />
                                }
                                label={t('createClaw.title')}
                            />
                        )}
                    <UserDropdown
                        displayName={displayName}
                        onSignOut={signOut}
                    />
                </div>
            </div>

            <div className='flex flex-1 overflow-hidden'>
                {activeIsError ? (
                    <div className='flex h-full min-w-0 flex-1 items-center justify-center'>
                        <div className='-mt-20'>
                            <ErrorState
                                title={t('errors.failedToLoadClaws')}
                                description={t(
                                    'errors.failedToLoadClawsDescription'
                                )}
                                onRetry={() => activeRefetch()}
                            />
                        </div>
                    </div>
                ) : isLoading ? (
                    <div className='flex h-full min-w-0 flex-1 items-center justify-center'>
                        <PlaygroundLoadingState />
                    </div>
                ) : dashboardTab === DASHBOARD_TABS.CHAT ? (
                    displayedClaws.length === 0 ? (
                        <div className='flex h-full min-w-0 flex-1 items-center justify-center'>
                            <div className='-mt-20'>
                                <EmptyState
                                    icon={<ClawMascot className='h-10 w-10' />}
                                    title={
                                        adminMode
                                            ? t('dashboard.adminNoClaws')
                                            : t('playground.noClawsYet')
                                    }
                                    description={
                                        adminMode
                                            ? t('dashboard.adminDescription')
                                            : t('playground.noClawsDescription')
                                    }
                                    actionLabel={
                                        adminMode
                                            ? undefined
                                            : t('nav.deployOpenClaw')
                                    }
                                    onAction={
                                        adminMode
                                            ? undefined
                                            : () => setShowCreate(true)
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <ChatView
                            claws={displayedClaws}
                            agentQueries={agentQueries}
                            plans={plans}
                            sshKeys={sshKeys || []}
                            selectedAgent={chatSelectedAgent}
                            onAgentSelect={setChatSelectedAgent}
                            onConfigureAgent={handleConfigureAgent}
                            onCreateAgent={handleCreateAgent}
                            initialSettingsClawId={chatSettingsClawId}
                            onSettingsClawChange={setChatSettingsClawId}
                            initialAgentTab={chatAgentTab || undefined}
                            onAgentTabChange={setChatAgentTab}
                            initialClawTab={chatClawTab || undefined}
                            onClawTabChange={setChatClawTab}
                        />
                    )
                ) : (
                    <>
                        <div className='relative h-full min-w-0 flex-1'>
                            <PlaygroundCanvas
                                key={adminMode ? 'admin' : 'user'}
                                initialNodes={nodes}
                                initialEdges={edges}
                                onNodeClick={(clawId) => {
                                    setSelectedClawId(clawId)
                                    setSelectedAgentId(null)
                                    setSelectedAgentClawId(null)
                                }}
                                onAgentClick={(agentId, clawId) => {
                                    setSelectedAgentId(agentId)
                                    setSelectedAgentClawId(clawId)
                                    setSelectedClawId(null)
                                }}
                                onPaneClick={() => {
                                    setSelectedClawId(null)
                                    setSelectedAgentId(null)
                                    setSelectedAgentClawId(null)
                                }}
                                panelOpen={!!selectedClaw || !!selectedAgent}
                                selectedClawId={selectedClawId}
                                selectedAgentId={selectedAgentId}
                                selectedAgentClawId={selectedAgentClawId}
                            />

                            {!isLoading &&
                                !activeIsError &&
                                (!displayedClaws ||
                                    displayedClaws.length === 0) && (
                                    <div className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center'>
                                        <div className='pointer-events-auto -mt-20'>
                                            <EmptyState
                                                icon={
                                                    <ClawMascot className='h-10 w-10' />
                                                }
                                                title={
                                                    adminMode
                                                        ? t(
                                                              'dashboard.adminNoClaws'
                                                          )
                                                        : t(
                                                              'playground.noClawsYet'
                                                          )
                                                }
                                                description={
                                                    adminMode
                                                        ? t(
                                                              'dashboard.adminDescription'
                                                          )
                                                        : t(
                                                              'playground.noClawsDescription'
                                                          )
                                                }
                                                actionLabel={
                                                    adminMode
                                                        ? undefined
                                                        : t(
                                                              'nav.deployOpenClaw'
                                                          )
                                                }
                                                onAction={
                                                    adminMode
                                                        ? undefined
                                                        : () =>
                                                              setShowCreate(
                                                                  true
                                                              )
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                        </div>

                        <AnimatePresence mode='wait'>
                            {selectedClaw && (
                                <PlaygroundDetailPanel
                                    key='detail-panel'
                                    claw={selectedClaw}
                                    plans={plans}
                                    sshKeys={sshKeys || []}
                                    onClose={() => setSelectedClawId(null)}
                                    initialTab={playgroundClawTab || undefined}
                                    onTabChange={setPlaygroundClawTab}
                                />
                            )}

                            {selectedAgent && selectedAgentClaw && (
                                <PlaygroundAgentDetailPanel
                                    key='agent-panel'
                                    agent={selectedAgent}
                                    clawId={selectedAgentClaw.id}
                                    clawName={selectedAgentClaw.name}
                                    isOnlyAgent={isSelectedAgentOnly}
                                    gatewayToken={
                                        selectedAgentClaw.gatewayToken
                                    }
                                    subdomain={selectedAgentClaw.subdomain}
                                    initialTab={playgroundAgentTab || undefined}
                                    onTabChange={setPlaygroundAgentTab}
                                    onClose={() => {
                                        setSelectedAgentId(null)
                                        setSelectedAgentClawId(null)
                                    }}
                                />
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>

            {showCreate && plans.length > 0 && locations && (
                <CreateClawModal
                    plans={plans}
                    locations={locations}
                    sshKeys={sshKeys || []}
                    volumePricing={volumePricing}
                    planAvailability={planAvailability}
                    preselectedPlanId={preselectedPlanId}
                    preselectedProvider={preselectedProvider}
                    onClose={() => {
                        setShowCreate(false)
                        setPreselectedPlanId(null)
                        setPreselectedProvider(null)
                    }}
                    onNavigateToSSHKeys={() => {
                        setShowCreate(false)
                        setPreselectedPlanId(null)
                        setPreselectedProvider(null)
                        navigate(ROUTES.SSH_KEYS)
                    }}
                />
            )}

            {createAgentClawId && (
                <CreateAgentModal
                    clawId={createAgentClawId}
                    clawName={createAgentClawName}
                    open={!!createAgentClawId}
                    onOpenChange={(open) => {
                        if (!open) {
                            setCreateAgentClawId(null)
                            setCreateAgentClawName('')
                        }
                    }}
                />
            )}
        </motion.div>
    )
}

export default Dashboard