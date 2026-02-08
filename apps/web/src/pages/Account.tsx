import type { FC, ReactNode } from 'react'
import type { BillingOrder } from '@/ts/Interfaces'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { t } from '@openclaw/i18n'
import { useAuth } from '@/lib/auth'
import { useUIStore } from '@/lib/store'
import {
    useProfile,
    useUpdateProfile,
    useUserStats,
    useBillingHistory
} from '@/hooks'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Header } from '@/components/Header'
import { LandingFooter } from '@/components/LandingFooter'
import { PageBackground } from '@/components/PageBackground'
import { PageTitle } from '@/components/PageTitle'
import {
    CircleNotch,
    Calendar,
    Key,
    Receipt,
    DownloadSimple,
    ArrowSquareOut
} from '@phosphor-icons/react'
import { ActionButton } from '@/components/ActionButton'
import { api } from '@/lib/api'
import { ClawMascot } from '@/components/ClawMascot'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'

const Account: FC = (): ReactNode => {
    const { user, loading: authLoading, updateCachedProfile } = useAuth()
    const { showToast } = useUIStore()

    const [name, setName] = useState('')
    const [hasChanges, setHasChanges] = useState(false)
    const [loadingInvoiceIds, setLoadingInvoiceIds] = useState<Set<string>>(
        new Set()
    )
    const [isPortalLoading, setIsPortalLoading] = useState(false)

    const { data: profile } = useProfile({ enabled: !!user })
    const { data: userStats, isLoading: isStatsLoading } = useUserStats()
    const billingTotal = userStats?.orderCount ?? 0
    const knowsBillingCount = !isStatsLoading && userStats !== undefined
    const BILLING_PAGE_SIZE = 10
    const {
        data: billingData,
        isLoading: isBillingLoading,
        isError: isBillingError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useBillingHistory(BILLING_PAGE_SIZE)

    const observerRef = useRef<IntersectionObserver | null>(null)
    const loadMoreRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (isFetchingNextPage) return
            if (observerRef.current) observerRef.current.disconnect()
            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage()
                }
            })
            if (node) observerRef.current.observe(node)
        },
        [isFetchingNextPage, hasNextPage, fetchNextPage]
    )

    const allBillingItems =
        billingData?.pages.flatMap((page) => page.items) ?? []
    const remainingBillingCount = Math.max(
        0,
        billingTotal - allBillingItems.length
    )
    const nextPageSkeletonCount = Math.min(
        BILLING_PAGE_SIZE,
        remainingBillingCount
    )

    useEffect(() => {
        if (profile?.name) {
            setName(profile.name)
        }
    }, [profile?.name])

    const updateMutation = useUpdateProfile()

    const handleSave = () => {
        updateMutation.mutate(
            { name },
            {
                onSuccess: (data) => {
                    setName(data.name || '')
                    setHasChanges(false)
                    updateCachedProfile({ name: data.name })
                    showToast(
                        t('account.profileUpdatedSuccessfully'),
                        'success'
                    )
                },
                onError: (err: Error) => {
                    showToast(
                        err.message || t('errors.failedToUpdateProfile'),
                        'error'
                    )
                }
            }
        )
    }

    const handleNameChange = (value: string) => {
        setName(value)
        setHasChanges(value !== (profile?.name || ''))
    }

    const email = user?.email || ''
    const displayName = name || profile?.name || email

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

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '...'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase()
        }).format(amount / 100)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return (
                    <Badge className='pointer-events-none border-green-500/30 bg-green-500/20 text-green-400'>
                        {t('account.statusPaid')}
                    </Badge>
                )
            case 'pending':
                return (
                    <Badge className='pointer-events-none border-yellow-500/30 bg-yellow-500/20 text-yellow-400'>
                        {t('account.statusPending')}
                    </Badge>
                )
            case 'refunded':
                return (
                    <Badge className='pointer-events-none border-red-500/30 bg-red-500/20 text-red-400'>
                        {t('account.statusRefunded')}
                    </Badge>
                )
            case 'partially_refunded':
                return (
                    <Badge className='pointer-events-none border-orange-500/30 bg-orange-500/20 text-orange-400'>
                        {t('account.statusPartiallyRefunded')}
                    </Badge>
                )
            default:
                return (
                    <Badge variant='outline' className='pointer-events-none'>
                        {status}
                    </Badge>
                )
        }
    }

    const getBillingReasonLabel = (reason: string) => {
        switch (reason) {
            case 'purchase':
                return t('account.billingReasonPurchase')
            case 'subscription_create':
                return t('account.billingReasonSubscriptionCreate')
            case 'subscription_cycle':
                return t('account.billingReasonSubscriptionCycle')
            case 'subscription_update':
                return t('account.billingReasonSubscriptionUpdate')
            default:
                return reason
        }
    }

    const handleViewInvoice = async (orderId: string) => {
        setLoadingInvoiceIds((prev) => new Set(prev).add(orderId))
        try {
            const { url } = await api.getOrderInvoice(orderId)
            window.open(url, '_blank')
        } catch {
            showToast(t('account.failedToLoadInvoice'), 'error')
        } finally {
            setLoadingInvoiceIds((prev) => {
                const next = new Set(prev)
                next.delete(orderId)
                return next
            })
        }
    }

    const handleManageBilling = async () => {
        setIsPortalLoading(true)
        try {
            const { url } = await api.getCustomerPortal()
            window.open(url, '_blank')
        } catch {
            showToast(t('account.failedToLoadPortal'), 'error')
        } finally {
            setIsPortalLoading(false)
        }
    }

    const joinedDate = user?.metadata?.creationTime

    return (
        <div className='relative flex min-h-screen flex-col bg-[#0a0a0f] text-white'>
            <PageTitle
                title={t('account.title')}
                description={t('account.description')}
            />
            <PageBackground />
            <Header />

            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='relative mx-auto w-full max-w-6xl flex-1 px-6 py-8'
            >
                {authLoading || !profile ? (
                    <div className='flex min-h-[60vh] items-center justify-center'>
                        <CircleNotch className='text-primary h-8 w-8 animate-spin' />
                    </div>
                ) : (
                    <>
                        <PageHeader
                            title={t('account.accountSettings')}
                            description={t('account.manageYourAccount')}
                        />

                        <div className='rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm'>
                            <h3 className='mb-1 font-semibold'>
                                {t('account.profileInformation')}
                            </h3>
                            <p className='text-muted-foreground mb-6 text-sm'>
                                {t('account.profileDescription')}
                            </p>

                            <div className='mb-8 flex items-start gap-6'>
                                <Avatar className='h-20 w-20'>
                                    <AvatarFallback className='bg-gradient-to-br from-[#ef5350] to-[#c62828] text-4xl font-semibold text-white'>
                                        {getInitials(displayName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className='flex-1 space-y-2'>
                                    <div>
                                        <p className='text-lg font-medium'>
                                            {name ||
                                                profile?.name ||
                                                t('account.noNameSet')}
                                        </p>
                                        <p className='text-muted-foreground text-sm'>
                                            {email}
                                        </p>
                                    </div>
                                    <div className='text-muted-foreground flex items-center gap-6 text-sm'>
                                        <div className='flex items-center gap-1.5'>
                                            <Calendar className='h-4 w-4' />
                                            <span>
                                                {t('account.joined')}{' '}
                                                {formatDate(joinedDate)}
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-1.5'>
                                            <ClawMascot className='h-4 w-4' />
                                            <span>
                                                {userStats?.clawCount ?? 0}{' '}
                                                {t('account.claws')}
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-1.5'>
                                            <Key className='h-4 w-4' />
                                            <span>
                                                {userStats?.sshKeyCount ?? 0}{' '}
                                                {t('account.sshKeys')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='space-y-6'>
                                <div className='max-w-xs space-y-2'>
                                    <Label htmlFor='name'>
                                        {t('account.displayName')}
                                    </Label>
                                    <Input
                                        id='name'
                                        type='text'
                                        value={name}
                                        onChange={(e) =>
                                            handleNameChange(e.target.value)
                                        }
                                        placeholder={t('account.enterYourName')}
                                        maxLength={100}
                                    />
                                </div>

                                <div className='flex justify-end pt-6'>
                                    <Button
                                        onClick={handleSave}
                                        disabled={
                                            !hasChanges ||
                                            updateMutation.isPending
                                        }
                                    >
                                        {updateMutation.isPending && (
                                            <CircleNotch className='h-4 w-4 animate-spin' />
                                        )}
                                        {t('common.save')}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className='mt-6 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm'>
                            <div className='mb-6 flex items-start justify-between'>
                                <div>
                                    <h3 className='mb-1 font-semibold'>
                                        {t('account.billingHistory')}
                                    </h3>
                                    <p className='text-muted-foreground text-sm'>
                                        {t('account.billingDescription')}
                                    </p>
                                </div>
                                {billingTotal > 0 && (
                                    <ActionButton
                                        onClick={handleManageBilling}
                                        label={t('account.manageBilling')}
                                        icon={
                                            isPortalLoading ? (
                                                <CircleNotch className='h-5 w-5 animate-spin' />
                                            ) : (
                                                <ArrowSquareOut
                                                    className='h-5 w-5'
                                                    weight='bold'
                                                />
                                            )
                                        }
                                        size='sm'
                                    />
                                )}
                            </div>

                            {isBillingLoading &&
                            knowsBillingCount &&
                            billingTotal === 0 ? (
                                <EmptyState
                                    icon={
                                        <Receipt className='text-primary h-10 w-10' />
                                    }
                                    title={t('account.noBillingHistory')}
                                    description={t(
                                        'account.noBillingHistoryDescription'
                                    )}
                                />
                            ) : isBillingLoading && billingTotal > 0 ? (
                                <div className='space-y-2'>
                                    {Array.from({
                                        length: Math.min(
                                            billingTotal,
                                            BILLING_PAGE_SIZE
                                        )
                                    }).map((_, i) => (
                                        <div
                                            key={i}
                                            className='flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-4'
                                        >
                                            <div className='space-y-2'>
                                                <Skeleton className='h-4 w-32' />
                                                <Skeleton className='h-3 w-24' />
                                            </div>
                                            <div className='flex items-center gap-4'>
                                                <Skeleton className='h-4 w-16' />
                                                <Skeleton className='h-5 w-14 rounded-full' />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : isBillingLoading ? (
                                <div className='space-y-2'>
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className='flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-4'
                                        >
                                            <div className='space-y-2'>
                                                <Skeleton className='h-4 w-32' />
                                                <Skeleton className='h-3 w-24' />
                                            </div>
                                            <div className='flex items-center gap-4'>
                                                <Skeleton className='h-4 w-16' />
                                                <Skeleton className='h-5 w-14 rounded-full' />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : isBillingError ? (
                                <ErrorState
                                    title={t('account.failedToLoadBilling')}
                                />
                            ) : !allBillingItems.length ? (
                                <EmptyState
                                    icon={
                                        <Receipt className='text-primary h-10 w-10' />
                                    }
                                    title={t('account.noBillingHistory')}
                                    description={t(
                                        'account.noBillingHistoryDescription'
                                    )}
                                />
                            ) : (
                                <div className='space-y-2'>
                                    {allBillingItems.map(
                                        (order: BillingOrder) => (
                                            <div
                                                key={order.id}
                                                className='flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]'
                                            >
                                                <div>
                                                    <p className='text-sm font-medium'>
                                                        {order.productName ||
                                                            getBillingReasonLabel(
                                                                order.billingReason
                                                            )}
                                                    </p>
                                                    <p className='text-muted-foreground text-xs'>
                                                        {formatDate(
                                                            order.createdAt
                                                        )}
                                                    </p>
                                                </div>
                                                <div className='flex items-center gap-4'>
                                                    <div className='text-right text-sm'>
                                                        <div className='flex items-center gap-2 font-medium'>
                                                            {order.discountAmount >
                                                                0 && (
                                                                <span className='text-muted-foreground line-through'>
                                                                    {formatCurrency(
                                                                        order.subtotalAmount,
                                                                        order.currency
                                                                    )}
                                                                </span>
                                                            )}
                                                            <span>
                                                                {formatCurrency(
                                                                    order.totalAmount,
                                                                    order.currency
                                                                )}
                                                            </span>
                                                        </div>
                                                        {order.discountName && (
                                                            <p className='text-muted-foreground text-xs'>
                                                                {t(
                                                                    'account.couponApplied',
                                                                    {
                                                                        name: order.discountName
                                                                    }
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {getStatusBadge(
                                                        order.status
                                                    )}
                                                    <Button
                                                        variant='ghost'
                                                        size='icon'
                                                        onClick={() =>
                                                            handleViewInvoice(
                                                                order.id
                                                            )
                                                        }
                                                        disabled={loadingInvoiceIds.has(
                                                            order.id
                                                        )}
                                                        title={t(
                                                            'account.viewInvoice'
                                                        )}
                                                    >
                                                        {loadingInvoiceIds.has(
                                                            order.id
                                                        ) ? (
                                                            <CircleNotch className='h-5 w-5 animate-spin' />
                                                        ) : (
                                                            <DownloadSimple className='h-5 w-5' />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    )}

                                    {hasNextPage && (
                                        <div
                                            ref={loadMoreRef}
                                            className='space-y-2'
                                        >
                                            {Array.from({
                                                length: nextPageSkeletonCount
                                            }).map((_, i) => (
                                                <div
                                                    key={`skeleton-${i}`}
                                                    className='flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-4'
                                                >
                                                    <div className='space-y-2'>
                                                        <Skeleton className='h-4 w-32' />
                                                        <Skeleton className='h-3 w-24' />
                                                    </div>
                                                    <div className='flex items-center gap-4'>
                                                        <Skeleton className='h-4 w-16' />
                                                        <Skeleton className='h-5 w-14 rounded-full' />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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

export default Account