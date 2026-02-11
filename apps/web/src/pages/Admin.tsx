import type { FC, ReactNode } from 'react'

import { motion } from 'framer-motion'
import { t } from '@openclaw/i18n'
import { useAuth } from '@/lib/auth'
import { usePreferencesStore } from '@/lib/store'
import { useAdminClaws, useSSHKeys, usePlans } from '@/hooks'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Header } from '@/components/Header'
import { LandingFooter } from '@/components/LandingFooter'
import { PageBackground } from '@/components/PageBackground'
import { PageTitle } from '@/components/PageTitle'
import { PageHeader } from '@/components/PageHeader'
import { ClawMascot } from '@/components/ClawMascot'
import { CircleNotch, List, SquaresFour } from '@phosphor-icons/react'
import { ClawCard } from '@/components/dashboard'

const Admin: FC = (): ReactNode => {
    const { loading: authLoading } = useAuth()
    const { instancesViewMode, setInstancesViewMode } = usePreferencesStore()

    const { data: claws, isLoading, isError, refetch } = useAdminClaws()

    const { plans: hetznerPlans } = usePlans('hetzner')
    const { plans: digitaloceanPlans } = usePlans('digitalocean')
    const plans = [...(hetznerPlans || []), ...(digitaloceanPlans || [])]
    const { data: sshKeys } = useSSHKeys()

    return (
        <div className='relative flex min-h-screen flex-col bg-[#0a0a0f] text-white'>
            <PageTitle
                title={t('dashboard.adminTitle')}
                description={t('dashboard.adminDescription')}
                noIndex
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
                            title={t('dashboard.adminTitle')}
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
                            ) : isLoading ? (
                                <div className='flex min-h-[200px] items-center justify-center'>
                                    <CircleNotch className='text-primary h-8 w-8 animate-spin' />
                                </div>
                            ) : claws?.length === 0 ? (
                                <EmptyState
                                    icon={<ClawMascot className='h-10 w-10' />}
                                    title={t('dashboard.adminNoClaws')}
                                    description={t(
                                        'dashboard.adminDescription'
                                    )}
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
                    </>
                )}
            </motion.main>

            <LandingFooter />
        </div>
    )
}

export default Admin