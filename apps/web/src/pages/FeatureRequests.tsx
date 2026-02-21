import type { FC, ReactNode } from 'react'
import type { FeatureRequestCardProps } from '@/ts/Interfaces'
import type { FeatureRequestSortBy, FeatureRequestStatus } from '@/ts/Types'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { t } from '@openclaw/i18n'
import { useAuth } from '@/lib/auth'
import { useUIStore } from '@/lib/store'
import { PATHS, getBaseDomain, getLocale } from '@/lib'
import { useProfile } from '@/hooks'
import {
    useFeatureRequests,
    useCreateFeatureRequest,
    useUpvoteFeatureRequest,
    useUpdateFeatureRequestStatus,
    useDeleteFeatureRequest
} from '@/hooks/useFeatureRequests'
import {
    Badge,
    Button,
    Card,
    CardContent,
    Input,
    Skeleton,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem
} from '@/components/ui'
import {
    EmptyState,
    ErrorState,
    Header,
    LandingFooter,
    PageBackground,
    PageTitle,
    PageHeader,
    ActionButton
} from '@/components'
import {
    ArrowFatUpIcon,
    CircleNotchIcon,
    LightningIcon,
    PlusCircleIcon,
    RobotIcon,
    TrashIcon
} from '@phosphor-icons/react'

const STATUS_ORDER: FeatureRequestStatus[] = [
    'awaiting_approval',
    'requested',
    'marked_for_implementation',
    'implemented',
    'rejected'
]

const getStatusBadgeClasses = (status: FeatureRequestStatus): string => {
    switch (status) {
        case 'awaiting_approval':
            return 'border-amber-500/30 bg-amber-500/20 text-amber-600 dark:text-amber-400'
        case 'requested':
            return 'border-blue-500/30 bg-blue-500/20 text-blue-600 dark:text-blue-400'
        case 'marked_for_implementation':
            return 'border-purple-500/30 bg-purple-500/20 text-purple-600 dark:text-purple-400'
        case 'implemented':
            return 'border-green-500/30 bg-green-500/20 text-green-600 dark:text-green-400'
        case 'rejected':
            return 'border-red-500/30 bg-red-500/20 text-red-600 dark:text-red-400'
        default:
            return ''
    }
}

const getStatusLabel = (status: FeatureRequestStatus): string => {
    switch (status) {
        case 'awaiting_approval':
            return t('featureRequests.statusAwaitingApproval')
        case 'requested':
            return t('featureRequests.statusRequested')
        case 'marked_for_implementation':
            return t('featureRequests.statusMarkedForImplementation')
        case 'implemented':
            return t('featureRequests.statusImplemented')
        case 'rejected':
            return t('featureRequests.statusRejected')
        default:
            return ''
    }
}

const FeatureRequestSkeleton: FC = (): ReactNode => {
    return (
        <Card>
            <CardContent className='py-4'>
                <div className='flex items-start justify-between gap-4'>
                    <div className='flex-1 space-y-3'>
                        <div className='flex items-center gap-2'>
                            <Skeleton className='h-5 w-24' />
                            <Skeleton className='h-5 w-48' />
                        </div>
                        <Skeleton className='h-4 w-full' />
                        <Skeleton className='h-4 w-32' />
                    </div>
                    <Skeleton className='h-9 w-16' />
                </div>
            </CardContent>
        </Card>
    )
}

const FeatureRequests: FC = (): ReactNode => {
    const { user } = useAuth()
    const { showToast } = useUIStore()
    const { data: profile } = useProfile({ enabled: !!user })
    const isAdmin = profile?.role === 'admin'

    const [sort, setSort] = useState<FeatureRequestSortBy>('upvotes')
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [rejectingId, setRejectingId] = useState<string | null>(null)
    const [rejectionReason, setRejectionReason] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [createTitle, setCreateTitle] = useState('')
    const [createDescription, setCreateDescription] = useState('')

    const { data, isLoading, isError, refetch } = useFeatureRequests(sort)
    const createMutation = useCreateFeatureRequest()
    const upvoteMutation = useUpvoteFeatureRequest()
    const updateStatusMutation = useUpdateFeatureRequestStatus()
    const deleteMutation = useDeleteFeatureRequest()

    const items = data?.items ?? []

    const handleUpvote = (id: string) => {
        if (!user) {
            showToast(t('featureRequests.signInToUpvote'), 'info')
            return
        }
        upvoteMutation.mutate(id, {
            onError: () =>
                showToast(t('featureRequests.failedToUpvote'), 'error')
        })
    }

    const handleStatusChange = (id: string, status: FeatureRequestStatus) => {
        if (status === 'rejected') {
            setRejectingId(id)
            setRejectionReason('')
            setShowRejectModal(true)
            return
        }
        updateStatusMutation.mutate(
            { id, data: { status } },
            {
                onSuccess: () =>
                    showToast(t('featureRequests.statusUpdated'), 'success'),
                onError: () =>
                    showToast(
                        t('featureRequests.failedToUpdateStatus'),
                        'error'
                    )
            }
        )
    }

    const handleRejectConfirm = () => {
        if (!rejectingId || !rejectionReason.trim()) {
            showToast(t('featureRequests.rejectReasonRequired'), 'error')
            return
        }
        updateStatusMutation.mutate(
            {
                id: rejectingId,
                data: {
                    status: 'rejected',
                    rejectionReason: rejectionReason.trim()
                }
            },
            {
                onSuccess: () => {
                    showToast(t('featureRequests.statusUpdated'), 'success')
                    setShowRejectModal(false)
                    setRejectingId(null)
                    setRejectionReason('')
                },
                onError: () =>
                    showToast(
                        t('featureRequests.failedToUpdateStatus'),
                        'error'
                    )
            }
        )
    }

    const handleDeleteConfirm = () => {
        if (!deletingId) return
        deleteMutation.mutate(deletingId, {
            onSuccess: () => {
                showToast(t('featureRequests.deleted'), 'success')
                setShowDeleteModal(false)
                setDeletingId(null)
            },
            onError: () =>
                showToast(t('featureRequests.failedToDelete'), 'error')
        })
    }

    const handleCreate = () => {
        if (!createTitle.trim() || !createDescription.trim()) return
        createMutation.mutate(
            {
                title: createTitle.trim(),
                description: createDescription.trim()
            },
            {
                onSuccess: () => {
                    showToast(t('featureRequests.submitted'), 'success')
                    setShowCreateModal(false)
                    setCreateTitle('')
                    setCreateDescription('')
                },
                onError: (err: Error) => {
                    showToast(
                        err.message || t('featureRequests.failedToSubmit'),
                        'error'
                    )
                }
            }
        )
    }

    const sortOptions: { value: FeatureRequestSortBy; label: string }[] = [
        { value: 'upvotes', label: t('featureRequests.sortByUpvotes') },
        { value: 'newest', label: t('featureRequests.sortByNewest') },
        { value: 'status', label: t('featureRequests.sortByStatus') }
    ]

    return (
        <div className='bg-background text-foreground relative flex min-h-screen flex-col'>
            <PageTitle
                title={t('featureRequests.title')}
                description={t('featureRequests.description')}
                url={`https://${getBaseDomain()}/${PATHS.FEATURE_REQUESTS}`}
            />
            <PageBackground />
            <Header />
            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-8'
            >
                <PageHeader
                    title={t('featureRequests.title')}
                    description={t('featureRequests.subtitle')}
                    action={
                        user ? (
                            <ActionButton
                                onClick={() => setShowCreateModal(true)}
                                label={t('featureRequests.submitRequest')}
                                icon={<PlusCircleIcon className='h-5 w-5' />}
                            />
                        ) : undefined
                    }
                />

                <div className='mt-6 space-y-4'>
                    <div className='border-border bg-foreground/5 rounded-xl border p-4 backdrop-blur-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
                                <RobotIcon className='text-primary h-5 w-5' />
                            </div>
                            <div>
                                <p className='font-semibold'>
                                    {t('featureRequests.agentBannerTitle')}
                                </p>
                                <p className='text-muted-foreground text-sm'>
                                    {t(
                                        'featureRequests.agentBannerDescription'
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='flex gap-2'>
                        {sortOptions.map((option) => (
                            <Button
                                key={option.value}
                                variant={
                                    sort === option.value
                                        ? 'default'
                                        : 'outline'
                                }
                                size='sm'
                                onClick={() => setSort(option.value)}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </div>

                    {isError ? (
                        <ErrorState
                            title={t('errors.couldNotLoadData')}
                            description={t('errors.somethingWentWrong')}
                            onRetry={() => refetch()}
                        />
                    ) : isLoading ? (
                        <div className='space-y-1.5'>
                            {Array.from({ length: 3 }).map((_, i) => (
                                <FeatureRequestSkeleton key={i} />
                            ))}
                        </div>
                    ) : items.length === 0 ? (
                        <EmptyState
                            icon={
                                <LightningIcon className='text-primary h-10 w-10' />
                            }
                            title={t('featureRequests.noRequestsYet')}
                            description={t(
                                'featureRequests.noRequestsDescription'
                            )}
                            actionLabel={
                                user
                                    ? t('featureRequests.submitRequest')
                                    : undefined
                            }
                            onAction={
                                user
                                    ? () => setShowCreateModal(true)
                                    : undefined
                            }
                        />
                    ) : (
                        <div className='space-y-1.5'>
                            {items.map((item) => (
                                <FeatureRequestCard
                                    key={item.id}
                                    featureRequest={item}
                                    isAuthenticated={!!user}
                                    isAdmin={isAdmin}
                                    onUpvote={handleUpvote}
                                    onStatusChange={handleStatusChange}
                                    onDelete={(id) => {
                                        setDeletingId(id)
                                        setShowDeleteModal(true)
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <Dialog
                    open={showCreateModal}
                    onOpenChange={setShowCreateModal}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {t('featureRequests.submitModalTitle')}
                            </DialogTitle>
                            <DialogDescription>
                                {t('featureRequests.submitModalDescription')}
                            </DialogDescription>
                        </DialogHeader>
                        <div className='mt-4 space-y-4'>
                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>
                                    {t('featureRequests.featureTitle')}
                                </label>
                                <Input
                                    value={createTitle}
                                    onChange={(e) =>
                                        setCreateTitle(e.target.value)
                                    }
                                    placeholder={t(
                                        'featureRequests.featureTitlePlaceholder'
                                    )}
                                    maxLength={200}
                                />
                            </div>
                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>
                                    {t('featureRequests.featureDescription')}
                                </label>
                                <textarea
                                    value={createDescription}
                                    onChange={(e) =>
                                        setCreateDescription(e.target.value)
                                    }
                                    placeholder={t(
                                        'featureRequests.featureDescriptionPlaceholder'
                                    )}
                                    maxLength={2000}
                                    rows={4}
                                    className='border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1'
                                />
                            </div>
                            <div className='flex justify-end gap-3'>
                                <Button
                                    variant='outline'
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    {t('common.cancel')}
                                </Button>
                                <Button
                                    onClick={handleCreate}
                                    disabled={
                                        createMutation.isPending ||
                                        !createTitle.trim() ||
                                        !createDescription.trim()
                                    }
                                >
                                    {createMutation.isPending && (
                                        <CircleNotchIcon className='h-4 w-4 animate-spin' />
                                    )}
                                    {createMutation.isPending
                                        ? t('featureRequests.submitting')
                                        : t('featureRequests.submitRequest')}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={showRejectModal}
                    onOpenChange={setShowRejectModal}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {t('featureRequests.rejectModalTitle')}
                            </DialogTitle>
                            <DialogDescription>
                                {t('featureRequests.rejectModalDescription')}
                            </DialogDescription>
                        </DialogHeader>
                        <div className='mt-4 space-y-4'>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) =>
                                    setRejectionReason(e.target.value)
                                }
                                placeholder={t(
                                    'featureRequests.rejectReasonPlaceholder'
                                )}
                                rows={3}
                                className='border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1'
                            />
                            <div className='flex justify-end gap-3'>
                                <Button
                                    variant='outline'
                                    onClick={() => setShowRejectModal(false)}
                                >
                                    {t('common.cancel')}
                                </Button>
                                <Button
                                    variant='destructive'
                                    onClick={handleRejectConfirm}
                                    disabled={
                                        updateStatusMutation.isPending ||
                                        !rejectionReason.trim()
                                    }
                                >
                                    {updateStatusMutation.isPending && (
                                        <CircleNotchIcon className='h-4 w-4 animate-spin' />
                                    )}
                                    {t('common.confirm')}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={showDeleteModal}
                    onOpenChange={setShowDeleteModal}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {t('featureRequests.deleteRequest')}
                            </DialogTitle>
                            <DialogDescription>
                                {t('featureRequests.deleteConfirmation')}
                            </DialogDescription>
                        </DialogHeader>
                        <div className='mt-4 flex justify-end gap-3'>
                            <Button
                                variant='outline'
                                onClick={() => setShowDeleteModal(false)}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button
                                variant='destructive'
                                onClick={handleDeleteConfirm}
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending && (
                                    <CircleNotchIcon className='h-4 w-4 animate-spin' />
                                )}
                                {t('common.confirm')}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </motion.main>
            <LandingFooter />
        </div>
    )
}

const FeatureRequestCard: FC<FeatureRequestCardProps> = ({
    featureRequest,
    isAuthenticated,
    isAdmin,
    onUpvote,
    onStatusChange,
    onDelete
}): ReactNode => {
    const locale = getLocale()

    return (
        <Card>
            <CardContent className='py-4'>
                <div className='flex items-start gap-4'>
                    <button
                        onClick={() => onUpvote(featureRequest.id)}
                        className={`flex flex-col items-center gap-0.5 rounded-lg border px-3 py-2 transition-colors ${
                            featureRequest.hasUpvoted
                                ? 'border-primary/30 bg-primary/10 text-primary'
                                : isAuthenticated
                                  ? 'border-border hover:border-primary/30 hover:bg-primary/5 text-muted-foreground'
                                  : 'border-border text-muted-foreground opacity-60'
                        }`}
                    >
                        <ArrowFatUpIcon
                            className='h-5 w-5'
                            weight={
                                featureRequest.hasUpvoted ? 'fill' : 'regular'
                            }
                        />
                        <span className='text-sm font-semibold'>
                            {featureRequest.upvoteCount}
                        </span>
                    </button>

                    <div className='flex-1 space-y-2'>
                        <div className='flex items-start justify-between gap-2'>
                            <h3 className='font-semibold'>
                                {featureRequest.title}
                            </h3>
                            <Badge
                                className={`pointer-events-none shrink-0 ${getStatusBadgeClasses(featureRequest.status)}`}
                            >
                                {getStatusLabel(featureRequest.status)}
                            </Badge>
                        </div>

                        <p className='text-muted-foreground text-sm'>
                            {featureRequest.description}
                        </p>

                        {featureRequest.status === 'rejected' &&
                            featureRequest.rejectionReason && (
                                <div className='rounded-md border border-red-500/20 bg-red-500/5 p-2'>
                                    <p className='text-sm text-red-600 dark:text-red-400'>
                                        <span className='font-medium'>
                                            {t(
                                                'featureRequests.rejectionReason'
                                            )}
                                            :
                                        </span>{' '}
                                        {featureRequest.rejectionReason}
                                    </p>
                                </div>
                            )}

                        <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                            <span>
                                {t('featureRequests.requestedBy')}{' '}
                                {featureRequest.userName ||
                                    featureRequest.userEmail}
                            </span>
                            <span>&middot;</span>
                            <span>
                                {new Date(
                                    featureRequest.createdAt
                                ).toLocaleDateString(locale, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>

                        {isAdmin && (
                            <div className='flex items-center gap-2 pt-1'>
                                <Select
                                    value={featureRequest.status}
                                    onValueChange={(value) =>
                                        onStatusChange(
                                            featureRequest.id,
                                            value as FeatureRequestStatus
                                        )
                                    }
                                >
                                    <SelectTrigger className='h-8 w-56 text-xs' />
                                    <SelectContent>
                                        {STATUS_ORDER.map((status) => (
                                            <SelectItem
                                                key={status}
                                                value={status}
                                            >
                                                {getStatusLabel(status)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    onClick={() => onDelete(featureRequest.id)}
                                >
                                    <TrashIcon className='text-destructive h-4 w-4' />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default FeatureRequests