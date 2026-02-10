import type { FC, ReactNode } from 'react'

import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { t } from '@openclaw/i18n'
import { useAuth } from '@/lib/auth'
import { usePreferencesStore, useUIStore } from '@/lib/store'
import { ROUTES } from '@/lib/routes'
import {
    useClaws,
    useSSHKeys,
    usePlans,
    useLocations,
    useVolumePricing,
    usePlanAvailability,
    useUserStats
} from '@/hooks'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Header } from '@/components/Header'
import { LandingFooter } from '@/components/LandingFooter'
import { PageBackground } from '@/components/PageBackground'
import { PageTitle } from '@/components/PageTitle'
import { PageHeader } from '@/components/PageHeader'
import { ActionButton } from '@/components/ActionButton'
import { ClawMascot } from '@/components/ClawMascot'
import {
    CircleNotch,
    List,
    SquaresFour,
    Lightning
} from '@phosphor-icons/react'
import { ClawCard, ClawSkeleton, CreateClawModal } from '@/components/dashboard'

const Dashboard: FC = (): ReactNode => {
    const { loading: authLoading } = useAuth()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [showCreate, setShowCreate] = useState(false)
    const [preselectedPlanId, setPreselectedPlanId] = useState<string | null>(
        null
    )
    const [awaitingClaw, setAwaitingClaw] = useState(
        () => searchParams.get('payment') === 'success'
    )
    const { instancesViewMode, setInstancesViewMode } = usePreferencesStore()
    const { showToast } = useUIStore()

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

    const { data: claws, isLoading, isError, refetch } = useClaws()

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
        }
    }, [awaitingClaw, claws])

    useEffect(() => {
        if (!awaitingClaw) return
        const timeout = setTimeout(() => {
            setAwaitingClaw(false)
            initialClawCount.current = null
        }, 60000)
        return () => clearTimeout(timeout)
    }, [awaitingClaw])

    const { data: userStats, isLoading: isStatsLoading } = useUserStats()
    const skeletonCount = userStats?.clawCount ?? 0
    const knowsCount = !isStatsLoading && userStats !== undefined

    const { data: hetznerPlans } = usePlans('hetzner')
    const { data: digitaloceanPlans } = usePlans('digitalocean')
    const plans = [...(hetznerPlans || []), ...(digitaloceanPlans || [])]
    const { data: locations } = useLocations()
    const { data: sshKeys } = useSSHKeys()
    const { data: volumePricing } = useVolumePricing()
    const { data: planAvailability } = usePlanAvailability()

    return (
        <div className='relative flex min-h-screen flex-col bg-[#0a0a0f] text-white'>
            <PageTitle
                title={t('dashboard.title')}
                description={t('dashboard.description')}
            />
            <PageBackground />
            <Header />

            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='relative mx-auto w-full max-w-6xl flex-1 px-6 py-8'
            >
                {authLoading || !claws ? (
                    <div className='flex min-h-[60vh] items-center justify-center'>
                        <CircleNotch className='text-primary h-8 w-8 animate-spin' />
                    </div>
                ) : (
                    <>
                        <PageHeader
                            title={t('dashboard.title')}
                            description={`${claws?.length ?? 0} ${claws?.length === 1 ? t('dashboard.claw') : t('dashboard.clawsPlural')}`}
                            action={
                                !isLoading &&
                                claws?.length === 0 ? undefined : (
                                    <div className='flex items-center gap-2'>
                                        <div className='flex items-center rounded-lg border border-white/10 p-0.5'>
                                            <button
                                                onClick={() =>
                                                    setInstancesViewMode('list')
                                                }
                                                className={`rounded-md p-1.5 transition-colors ${
                                                    instancesViewMode === 'list'
                                                        ? 'bg-white/10 text-white'
                                                        : 'text-gray-400 hover:text-white'
                                                }`}
                                            >
                                                <List
                                                    className='h-4 w-4'
                                                    weight='bold'
                                                />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setInstancesViewMode('grid')
                                                }
                                                className={`rounded-md p-1.5 transition-colors ${
                                                    instancesViewMode === 'grid'
                                                        ? 'bg-white/10 text-white'
                                                        : 'text-gray-400 hover:text-white'
                                                }`}
                                            >
                                                <SquaresFour
                                                    className='h-4 w-4'
                                                    weight='bold'
                                                />
                                            </button>
                                        </div>
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
                                    </div>
                                )
                            }
                        />

                        <div className='rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm'>
                            {isError ? (
                                <ErrorState
                                    title={t('errors.failedToLoadClaws')}
                                    description={t(
                                        'errors.failedToLoadClawsDescription'
                                    )}
                                    onRetry={() => refetch()}
                                />
                            ) : isLoading &&
                              knowsCount &&
                              skeletonCount === 0 ? (
                                <EmptyState
                                    icon={<ClawMascot className='h-10 w-10' />}
                                    title={t('dashboard.noClawsYet')}
                                    description={t(
                                        'dashboard.noClawsDescription'
                                    )}
                                    actionLabel={t('nav.deployOpenClaw')}
                                    onAction={() => setShowCreate(true)}
                                />
                            ) : isLoading && skeletonCount > 0 ? (
                                <div className='space-y-1.5'>
                                    {Array.from({ length: skeletonCount }).map(
                                        (_, i) => (
                                            <ClawSkeleton key={i} />
                                        )
                                    )}
                                </div>
                            ) : claws?.length === 0 ? (
                                <EmptyState
                                    icon={<ClawMascot className='h-10 w-10' />}
                                    title={t('dashboard.noClawsYet')}
                                    description={t(
                                        'dashboard.noClawsDescription'
                                    )}
                                    actionLabel={t('nav.deployOpenClaw')}
                                    onAction={() => setShowCreate(true)}
                                />
                            ) : claws?.length === 0 ? (
                                <EmptyState
                                    icon={<ClawMascot className='h-10 w-10' />}
                                    title={t('dashboard.noClawsYet')}
                                    description={t(
                                        'dashboard.noClawsDescription'
                                    )}
                                    actionLabel={t('nav.deployOpenClaw')}
                                    onAction={() => setShowCreate(true)}
                                />
                            ) : (
                                <div
                                    className={
                                        instancesViewMode === 'grid'
                                            ? 'grid grid-cols-1 gap-1.5 md:grid-cols-2'
                                            : 'space-y-1.5'
                                    }
                                >
                                    {claws?.map((claw) => (
                                        <ClawCard
                                            key={claw.id}
                                            claw={claw}
                                            sshKeys={sshKeys || []}
                                            plans={plans || []}
                                            viewMode={instancesViewMode}
                                        />
                                    ))}
                                </div>
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
                    </>
                )}
            </motion.main>

            <LandingFooter />
        </div>
    )
}

export default Dashboard