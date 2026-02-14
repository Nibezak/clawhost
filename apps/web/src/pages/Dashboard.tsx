import type { FC, ReactNode } from 'react'
import type { AwaitingPurchaseData, Claw } from '@/ts/Interfaces'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { t } from '@openclaw/i18n'
import { usePreferencesStore, useUIStore } from '@/lib/store'
import { ROUTES } from '@/lib/routes'
import {
    useClaws,
    useAdminClaws,
    useSSHKeys,
    usePlans,
    useLocations,
    useVolumePricing,
    usePlanAvailability,
    useUserStats
} from '@/hooks'
import { useAllClawAgents, usePlaygroundGraph } from '@/hooks/usePlayground'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Header } from '@/components/Header'
import { LandingFooter } from '@/components/LandingFooter'
import { PageBackground } from '@/components/PageBackground'
import { PageTitle } from '@/components/PageTitle'
import { PageHeader } from '@/components/PageHeader'
import { ActionButton } from '@/components/ActionButton'
import { ClawMascot } from '@/components/ClawMascot'
import { Logo } from '@/components/Logo'
import {
    List,
    SquaresFour,
    Lightning,
    Graph,
    Warning
} from '@phosphor-icons/react'
import { ClawCard, ClawSkeleton, CreateClawModal } from '@/components/dashboard'
import {
    PlaygroundCanvas,
    PlaygroundDetailPanel,
    PlaygroundAgentDetailPanel,
    PlaygroundLoadingState
} from '@/components/playground'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ClawMascotOutline } from '@/components/ClawMascotOutline'
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent
} from '@/components/ui/tooltip'
import { Key, User, SignOut } from '@phosphor-icons/react'

const Dashboard: FC = (): ReactNode => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [showCreate, setShowCreate] = useState(false)
    const [preselectedPlanId, setPreselectedPlanId] = useState<string | null>(
        null
    )
    const [awaitingClaw, setAwaitingClaw] = useState(
        () => searchParams.get('payment') === 'success'
    )
    const [selectedClawId, setSelectedClawId] = useState<string | null>(null)
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
    const [selectedAgentClawId, setSelectedAgentClawId] = useState<
        string | null
    >(null)
    const [adminModeRaw, setAdminMode] = useState(false)
    const [isModeSwitching, setIsModeSwitching] = useState(false)
    const { instancesViewMode, setInstancesViewMode } = usePreferencesStore()
    const { showToast } = useUIStore()

    const { user, cachedProfile, signOut } = useAuth()
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

    const getInitials = (text: string) => {
        if (!text) return '?'
        const parts = text.split(' ')
        if (parts.length > 1) {
            return (
                parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
            ).toUpperCase()
        }
        return text.charAt(0).toUpperCase()
    }

    useEffect(() => {
        if (awaitingClaw) {
            showToast(t('dashboard.paymentSuccess'), 'success')
        }
    }, [])

    useEffect(() => {
        const planParam = searchParams.get('plan')
        if (planParam) {
            setPreselectedPlanId(planParam)
            setShowCreate(true)
        }
        if (planParam || searchParams.get('payment')) {
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
                status: 'creating',
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

    const { data: userStats, isLoading: isStatsLoading } = useUserStats()
    const skeletonCount = userStats?.clawCount ?? 0
    const knowsCount = !isStatsLoading && userStats !== undefined

    const { plans: hetznerPlans } = usePlans('hetzner')
    const { plans: digitaloceanPlans } = usePlans('digitalocean')
    const plans = [...(hetznerPlans || []), ...(digitaloceanPlans || [])]
    const { data: locations } = useLocations()
    const { data: sshKeys } = useSSHKeys()
    const { data: volumePricing } = useVolumePricing()
    const { data: planAvailability } = usePlanAvailability()

    const isPlayground = instancesViewMode === 'playground'
    const activeClawsLoading = adminMode ? isAdminClawsLoading : isClawsLoading
    const activeIsError = adminMode ? isAdminClawsError : isError
    const activeRefetch = adminMode ? refetchAdmin : refetch
    const isLoading = activeClawsLoading || isModeSwitching

    useEffect(() => {
        if (isModeSwitching && !activeClawsLoading) {
            const timer = setTimeout(() => setIsModeSwitching(false), 400)
            return () => clearTimeout(timer)
        }
    }, [isModeSwitching, activeClawsLoading])
    const graphClaws = adminMode ? adminClaws || [] : claws || []
    const agentQueries = useAllClawAgents(isPlayground ? graphClaws : [])
    const { nodes, edges } = usePlaygroundGraph(
        isPlayground ? graphClaws : [],
        agentQueries
    )

    const activeClaws = adminMode ? adminClaws : claws
    const selectedClaw =
        selectedClawId && !selectedAgentId
            ? activeClaws?.find((c) => c.id === selectedClawId) || null
            : null

    const selectedAgentClaw = selectedAgentClawId
        ? activeClaws?.find((c) => c.id === selectedAgentClawId) || null
        : null

    const selectedAgent =
        selectedAgentId && selectedAgentClaw
            ? (() => {
                  const clawIndex = graphClaws.findIndex(
                      (c) => c.id === selectedAgentClawId
                  )
                  const query = clawIndex >= 0 ? agentQueries[clawIndex] : null
                  return (
                      query?.data?.agents?.find(
                          (a) => a.id === selectedAgentId
                      ) || null
                  )
              })()
            : null

    const viewSwitcher = (
        <div className='flex items-center rounded-lg border border-white/10 p-0.5'>
            {instancesViewMode === 'playground' ? (
                <button className='cursor-default rounded-md bg-white/10 p-1.5 text-white'>
                    <Graph className='h-4 w-4' weight='bold' />
                </button>
            ) : (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={() => setInstancesViewMode('playground')}
                            className='rounded-md p-1.5 text-gray-400 transition-colors hover:text-white'
                        >
                            <Graph className='h-4 w-4' weight='bold' />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side='bottom'>
                        <p>{t('playground.playgroundView')}</p>
                    </TooltipContent>
                </Tooltip>
            )}
            {instancesViewMode === 'list' ? (
                <button className='cursor-default rounded-md bg-white/10 p-1.5 text-white'>
                    <List className='h-4 w-4' weight='bold' />
                </button>
            ) : (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={() => setInstancesViewMode('list')}
                            className='rounded-md p-1.5 text-gray-400 transition-colors hover:text-white'
                        >
                            <List className='h-4 w-4' weight='bold' />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side='bottom'>
                        <p>{t('playground.listView')}</p>
                    </TooltipContent>
                </Tooltip>
            )}
            {instancesViewMode === 'grid' ? (
                <button className='cursor-default rounded-md bg-white/10 p-1.5 text-white'>
                    <SquaresFour className='h-4 w-4' weight='bold' />
                </button>
            ) : (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={() => setInstancesViewMode('grid')}
                            className='rounded-md p-1.5 text-gray-400 transition-colors hover:text-white'
                        >
                            <SquaresFour className='h-4 w-4' weight='bold' />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side='bottom'>
                        <p>{t('playground.gridView')}</p>
                    </TooltipContent>
                </Tooltip>
            )}
        </div>
    )

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

    if (isPlayground) {
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
                        adminMode
                            ? t('dashboard.adminTitle')
                            : t('dashboard.title')
                    }
                    description={
                        adminMode
                            ? t('dashboard.adminDescription')
                            : t('dashboard.description')
                    }
                />

                <div className='relative z-10 flex items-center justify-between border-b border-white/10 bg-[#0a0a0f]/80 px-6 py-3 backdrop-blur-xl'>
                    <Logo />

                    <div className='flex items-center gap-3'>
                        {clawFilter}
                        {viewSwitcher}
                        {!adminMode && (
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
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    className='flex w-auto items-center gap-2 px-1.5 py-[18px] hover:bg-white/10'
                                >
                                    <Avatar className='h-7 w-7'>
                                        <AvatarFallback className='bg-gradient-to-br from-[#ef5350] to-[#c62828] text-xs text-white'>
                                            {getInitials(displayName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className='hidden max-w-[120px] truncate text-sm text-gray-300 sm:block'>
                                        {displayName}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align='end'
                                className='w-56 border-white/10 bg-[#151518]'
                            >
                                <DropdownMenuItem
                                    onClick={() => navigate(ROUTES.CLAWS)}
                                    className='bg-white/10 text-gray-300 focus:bg-white/10 focus:text-white'
                                >
                                    <ClawMascotOutline className='h-4 w-4' />
                                    {t('nav.claws')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => navigate(ROUTES.SSH_KEYS)}
                                    className='text-gray-300 focus:bg-white/10 focus:text-white'
                                >
                                    <Key className='h-4 w-4' />
                                    {t('nav.sshKeys')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => navigate(ROUTES.ACCOUNT)}
                                    className='text-gray-300 focus:bg-white/10 focus:text-white'
                                >
                                    <User className='h-4 w-4' />
                                    {t('nav.account')}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className='bg-white/10' />
                                <DropdownMenuItem
                                    onClick={signOut}
                                    className='text-red-400 focus:bg-white/10 focus:text-red-400'
                                >
                                    <SignOut className='h-4 w-4' />
                                    {t('nav.signOut')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className='flex flex-1 overflow-hidden'>
                    <div className='relative h-full min-w-0 flex-1'>
                        {activeIsError ? (
                            <div className='flex h-full items-center justify-center'>
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
                            />
                        )}

                        {!isLoading &&
                            !activeIsError &&
                            (!displayedClaws ||
                                displayedClaws.length === 0) && (
                                <div className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center'>
                                    <div className='pointer-events-auto'>
                                        <EmptyState
                                            icon={
                                                <ClawMascot className='h-10 w-10' />
                                            }
                                            title={
                                                adminMode
                                                    ? t(
                                                          'dashboard.adminNoClaws'
                                                      )
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

                    <AnimatePresence>
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
                        onClose={() => {
                            setShowCreate(false)
                            setPreselectedPlanId(null)
                        }}
                        onNavigateToSSHKeys={() => {
                            setShowCreate(false)
                            setPreselectedPlanId(null)
                            navigate(ROUTES.SSH_KEYS)
                        }}
                    />
                )}
            </motion.div>
        )
    }

    return (
        <div className='relative flex min-h-screen flex-col bg-[#0a0a0f] text-white'>
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
            <PageBackground />
            <Header />

            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='relative mx-auto w-full max-w-6xl flex-1 px-6 py-8'
            >
                <PageHeader
                    title={
                        adminMode
                            ? t('dashboard.adminTitle')
                            : t('dashboard.title')
                    }
                    description={`${displayedClaws.length} ${displayedClaws.length === 1 ? t('dashboard.claw') : t('dashboard.clawsPlural')}`}
                    action={
                        !isLoading &&
                        !adminMode &&
                        displayedClaws.length === 0 ? undefined : (
                            <div className='flex items-center gap-2'>
                                {clawFilter}
                                {viewSwitcher}
                                {!adminMode && (
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
                            </div>
                        )
                    }
                />

                <div className='rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm'>
                    {activeIsError ? (
                        <ErrorState
                            title={t('errors.failedToLoadClaws')}
                            description={t(
                                'errors.failedToLoadClawsDescription'
                            )}
                            onRetry={() => activeRefetch()}
                        />
                    ) : isLoading &&
                      knowsCount &&
                      skeletonCount === 0 ? (
                        <EmptyState
                            icon={<ClawMascot className='h-10 w-10' />}
                            title={t('dashboard.noClawsYet')}
                            description={t('dashboard.noClawsDescription')}
                            actionLabel={t('nav.deployOpenClaw')}
                            onAction={() => setShowCreate(true)}
                        />
                    ) : isLoading ? (
                        <div className='space-y-1.5'>
                            {Array.from({ length: skeletonCount || 3 }).map(
                                (_, i) => (
                                    <ClawSkeleton key={i} />
                                )
                            )}
                        </div>
                    ) : displayedClaws.length === 0 ? (
                        adminMode ? (
                            <EmptyState
                                icon={<ClawMascot className='h-10 w-10' />}
                                title={t('dashboard.adminNoClaws')}
                                description={t('dashboard.adminDescription')}
                            />
                        ) : (
                            <EmptyState
                                icon={<ClawMascot className='h-10 w-10' />}
                                title={t('dashboard.noClawsYet')}
                                description={t('dashboard.noClawsDescription')}
                                actionLabel={t('nav.deployOpenClaw')}
                                onAction={() => setShowCreate(true)}
                            />
                        )
                    ) : (
                        <>
                            <div className='mb-4 flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3'>
                                <Warning className='h-5 w-5 shrink-0 text-amber-400' weight='fill' />
                                <p className='flex-1 text-sm text-amber-200/90'>
                                    {t('dashboard.legacyViewWarning')}
                                </p>
                                <button
                                    onClick={() => setInstancesViewMode('playground')}
                                    className='shrink-0 rounded-md bg-amber-500/20 px-3 py-1.5 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-500/30 hover:text-amber-200'
                                >
                                    {t('dashboard.legacyViewWarningAction')}
                                </button>
                            </div>
                            <motion.div
                                key={instancesViewMode}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.15 }}
                                className={
                                    instancesViewMode === 'grid'
                                        ? 'grid grid-cols-1 gap-1.5 md:grid-cols-2'
                                        : 'space-y-1.5'
                                }
                            >
                                {displayedClaws.map((claw) => (
                                    <ClawCard
                                        key={claw.id}
                                        claw={claw}
                                        sshKeys={sshKeys || []}
                                        plans={plans || []}
                                        viewMode={instancesViewMode}
                                    />
                                ))}
                            </motion.div>
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
                        onClose={() => {
                            setShowCreate(false)
                            setPreselectedPlanId(null)
                        }}
                        onNavigateToSSHKeys={() => {
                            setShowCreate(false)
                            setPreselectedPlanId(null)
                            navigate(ROUTES.SSH_KEYS)
                        }}
                    />
                )}
            </motion.main>

            <LandingFooter />
        </div>
    )
}

export default Dashboard