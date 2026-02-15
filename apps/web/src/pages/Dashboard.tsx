import type { FC, ReactNode } from 'react'
import type { AwaitingPurchaseData, Claw } from '@/ts/Interfaces'
import type { ProviderType } from '@/ts/Types'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { t } from '@openclaw/i18n'
import { clawStatus } from '@openclaw/shared'
import { useUIStore, usePreferencesStore } from '@/lib/store'
import { ROUTES } from '@/lib'
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
import { Lightning } from '@phosphor-icons/react'
import { CreateClawModal } from '@/components/dashboard'
import {
    PlaygroundCanvas,
    PlaygroundDetailPanel,
    PlaygroundAgentDetailPanel,
    PlaygroundLoadingState
} from '@/components/playground'
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
    const [isModeSwitching, setIsModeSwitching] = useState(false)
    const { showToast } = useUIStore()
    const { adminMode: adminModeRaw, setAdminMode } = usePreferencesStore()

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
            setSearchParams({}, { replace: true })
        }
    }, [searchParams, setSearchParams])

    const initialClawCount = useRef<number | null>(null)

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
        if (!awaitingClaw) return
        if (claws && initialClawCount.current === null) {
            initialClawCount.current = claws.length
        }
        if (
            claws &&
            initialClawCount.current !== null &&
            claws.length > initialClawCount.current
        ) {
            setAwaitingClaw(false)
            initialClawCount.current = null
            localStorage.removeItem('openclaw_awaiting_purchase')
        }
    }, [awaitingClaw, claws])

    useEffect(() => {
        if (!awaitingClaw) return
        const timeout = setTimeout(() => {
            setAwaitingClaw(false)
            initialClawCount.current = null
            localStorage.removeItem('openclaw_awaiting_purchase')
        }, 60000)
        return () => clearTimeout(timeout)
    }, [awaitingClaw])

    const displayedClaws = useMemo((): Claw[] => {
        if (adminMode) return adminClaws || []
        const real = claws || []
        if (!awaitingClaw) return real

        try {
            const raw = localStorage.getItem('openclaw_awaiting_purchase')
            if (!raw) return real
            const purchase = JSON.parse(raw) as AwaitingPurchaseData
            const optimistic: Claw = {
                id: 'awaiting-purchase',
                name: purchase.name || '',
                provider: purchase.provider,
                status: clawStatus.creating,
                ip: null,
                planId: purchase.planId,
                location: purchase.location,
                rootPassword: null,
                sshKeyId: null,
                providerServerId: null,
                subdomain: null,
                gatewayToken: null,
                model: null,
                subscriptionStatus: null,
                currentPeriodStart: null,
                currentPeriodEnd: null,
                deletionScheduledAt: null,
                createdAt: new Date().toISOString()
            }
            return [optimistic, ...real]
        } catch {
            return real
        }
    }, [claws, awaitingClaw, adminMode, adminClaws])

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
        isModeSwitching ||
        (!awaitingClaw && (activeClawsLoading || !minLoadingMet))

    useEffect(() => {
        if (isModeSwitching && !activeClawsLoading) {
            const timer = setTimeout(() => setIsModeSwitching(false), 1800)
            return () => clearTimeout(timer)
        }
    }, [isModeSwitching, activeClawsLoading])

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

    const clawFilter = isAdmin ? (
        <div className='flex items-center rounded-lg border border-white/10 p-0.5'>
            <button
                onClick={() => {
                    if (adminMode) setIsModeSwitching(true)
                    setAdminMode(false)
                    setSelectedClawId(null)
                    setSelectedAgentId(null)
                    setSelectedAgentClawId(null)
                }}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${!adminMode ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                {t('dashboard.userTab')}
            </button>
            <button
                onClick={() => {
                    if (!adminMode) setIsModeSwitching(true)
                    setAdminMode(true)
                    setSelectedClawId(null)
                    setSelectedAgentId(null)
                    setSelectedAgentClawId(null)
                }}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${adminMode ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                {t('dashboard.adminTab')}
            </button>
        </div>
    ) : null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className='playground-grid fixed inset-0 flex flex-col bg-[#0a0a0f] text-white'
        >
            <div className='playground-gradient pointer-events-none fixed inset-0' />
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
                    {!isLoading &&
                        displayedClaws &&
                        displayedClaws.length > 0 && (
                            <span className='rounded-md bg-white/5 px-2 py-1 text-xs text-gray-400'>
                                {displayedClaws.length === 1
                                    ? t('dashboard.clawCountLabelSingular', {
                                          count: String(displayedClaws.length)
                                      })
                                    : t('dashboard.clawCountLabel', {
                                          count: String(displayedClaws.length)
                                      })}
                            </span>
                        )}
                </div>

                <div className='flex items-center gap-3'>
                    {clawFilter}
                    {!adminMode &&
                        !isLoading &&
                        displayedClaws &&
                        displayedClaws.length > 0 && (
                            <ActionButton
                                onClick={() => setShowCreate(true)}
                                icon={
                                    <Lightning
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
                <div className='relative h-full min-w-0 flex-1'>
                    {activeIsError ? (
                        <div className='-mt-20 flex h-full items-center justify-center'>
                            <ErrorState
                                title={t('errors.failedToLoadClaws')}
                                description={t(
                                    'errors.failedToLoadClawsDescription'
                                )}
                                onRetry={() => activeRefetch()}
                            />
                        </div>
                    ) : isLoading ? (
                        <PlaygroundLoadingState />
                    ) : (
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
                    )}

                    {!isLoading &&
                        !activeIsError &&
                        (!displayedClaws || displayedClaws.length === 0) && (
                            <div className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center'>
                                <div className='pointer-events-auto -mt-20'>
                                    <EmptyState
                                        icon={
                                            <ClawMascot className='h-10 w-10' />
                                        }
                                        title={
                                            adminMode
                                                ? t('dashboard.adminNoClaws')
                                                : t('playground.noClawsYet')
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
                        />
                    )}

                    {selectedAgent && selectedAgentClaw && (
                        <PlaygroundAgentDetailPanel
                            key='agent-panel'
                            agent={selectedAgent}
                            clawId={selectedAgentClaw.id}
                            clawName={selectedAgentClaw.name}
                            isOnlyAgent={isSelectedAgentOnly}
                            gatewayToken={selectedAgentClaw.gatewayToken}
                            subdomain={selectedAgentClaw.subdomain}
                            onClose={() => {
                                setSelectedAgentId(null)
                                setSelectedAgentClawId(null)
                            }}
                        />
                    )}
                </AnimatePresence>
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
        </motion.div>
    )
}

export default Dashboard