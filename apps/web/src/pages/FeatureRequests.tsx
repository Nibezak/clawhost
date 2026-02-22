import type { FC, ReactNode } from 'react'
import type { FeatureRequest, FeatureRequestCardProps } from '@/ts/Interfaces'
import type { FeatureRequestPlatform, FeatureRequestSortBy, FeatureRequestStatus } from '@/ts/Types'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { t } from '@openclaw/i18n'
import { inputValidation } from '@openclaw/shared'
import { useAuth } from '@/lib/auth'
import { useUIStore } from '@/lib/store'
import { PATHS, getBaseDomain } from '@/lib'
import { useProfile } from '@/hooks'
import {
    useFeatureRequests,
    useCreateFeatureRequest,
    useUpvoteFeatureRequest,
    useEditFeatureRequest,
    useDeleteFeatureRequest
} from '@/hooks/useFeatureRequests'
import {
    Button,
    Card,
    CardContent,
    Checkbox,
    Input,
    Label,
    Skeleton,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
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
    DotsThreeOutlineIcon,
    FunnelIcon,
    LightningIcon,
    PencilSimpleIcon,
    PlusCircleIcon,
    RobotIcon,
    TrashIcon
} from '@phosphor-icons/react'

let skipDeleteConfirmation = false

const STATUS_ORDER: FeatureRequestStatus[] = [
    'awaiting_approval',
    'requested',
    'marked_for_implementation',
    'implemented'
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
        default:
            return ''
    }
}

const FeatureRequestSkeleton: FC = (): ReactNode => {
    return (
        <Card>
            <CardContent className='py-4'>
                <div className='flex items-start gap-4 pt-1'>
                    <Skeleton className='mt-1 h-[60px] w-14 shrink-0 rounded-lg' />
                    <div className='min-w-0 flex-1'>
                        <Skeleton className='h-5 w-48' />
                        <div className='mt-1.5 flex items-center gap-1.5'>
                            <Skeleton className='h-5 w-28 rounded-full' />
                        </div>
                        <Skeleton className='mt-1.5 h-4 w-full max-w-md' />
                    </div>
                    <div className='mt-1 flex shrink-0 items-center gap-1'>
                        <Skeleton className='h-8 w-8 rounded-md' />
                        <Skeleton className='h-8 w-8 rounded-md' />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

const getStatusDotColor = (status: FeatureRequestStatus): string => {
    switch (status) {
        case 'awaiting_approval':
            return 'bg-amber-500'
        case 'requested':
            return 'bg-blue-500'
        case 'marked_for_implementation':
            return 'bg-purple-500'
        case 'implemented':
            return 'bg-green-500'
        default:
            return 'bg-muted-foreground'
    }
}

const FeatureRequestCard: FC<FeatureRequestCardProps> = ({
    featureRequest,
    isAuthenticated,
    isAdmin,
    isDeleting,
    currentUserId,
    onUpvote,
    onEdit,
    onDelete
}): ReactNode => {
    const isOwner = currentUserId === featureRequest.userId

    return (
        <Card>
            <CardContent className='py-4'>
                <div className='flex items-start gap-4 pt-1'>
                    <button
                        onClick={() => onUpvote(featureRequest.id)}
                        className={`mt-1 flex h-[60px] w-14 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border transition-all ${
                            featureRequest.hasUpvoted
                                ? 'border-[#ef5350]/40 bg-[#ef5350]/10 text-[#ef5350]'
                                : isAuthenticated
                                  ? 'border-border text-muted-foreground hover:border-[#ef5350]/30 hover:bg-[#ef5350]/5'
                                  : 'border-border text-muted-foreground opacity-50'
                        }`}
                    >
                        <ArrowFatUpIcon
                            className='h-5 w-5'
                            weight={
                                featureRequest.hasUpvoted ? 'fill' : 'regular'
                            }
                        />
                        <span className='text-xs font-bold tabular-nums'>
                            {featureRequest.upvoteCount}
                        </span>
                    </button>

                    <div className='min-w-0 flex-1'>
                        <h3 className='font-semibold'>
                            {featureRequest.title}
                        </h3>
                        <p className='text-muted-foreground mt-1 w-[90%] text-sm'>
                            {featureRequest.description}
                        </p>
                    </div>

                    <div className='mt-1 flex shrink-0 items-center gap-1'>
                        <span
                            className={`mr-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${getStatusBadgeClasses(featureRequest.status)}`}
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${getStatusDotColor(featureRequest.status)} ${featureRequest.status === 'awaiting_approval' ? 'animate-pulse' : ''}`}
                            />
                            {getStatusLabel(featureRequest.status)}
                        </span>
                        {isAdmin && (
                            <>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    onClick={() => onEdit(featureRequest)}
                                >
                                    <PencilSimpleIcon className='h-4 w-4' />
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    disabled={isDeleting}
                                    onClick={() => onDelete(featureRequest.id)}
                                >
                                    {isDeleting
                                        ? <CircleNotchIcon className='h-4 w-4 animate-spin' />
                                        : <TrashIcon className='h-4 w-4' />}
                                </Button>
                            </>
                        )}
                        {!isAdmin && isOwner && (
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='ghost' size='icon' disabled={isDeleting}>
                                        {isDeleting
                                            ? <CircleNotchIcon className='h-4 w-4 animate-spin' />
                                            : <DotsThreeOutlineIcon className='h-4 w-4' />}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            onDelete(featureRequest.id)
                                        }
                                        className='text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400'
                                    >
                                        <TrashIcon className='mr-2 h-4 w-4' />
                                        {t('featureRequests.deleteRequest')}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
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
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingRequest, setEditingRequest] = useState<FeatureRequest | null>(
        null
    )
    const [editTitle, setEditTitle] = useState('')
    const [editDescription, setEditDescription] = useState('')
    const [editStatus, setEditStatus] =
        useState<FeatureRequestStatus>('awaiting_approval')
    const [editPlatforms, setEditPlatforms] = useState<FeatureRequestPlatform[]>(['web'])
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [dontAskAgain, setDontAskAgain] = useState(false)
    const [createTitle, setCreateTitle] = useState('')
    const [createDescription, setCreateDescription] = useState('')
    const [createTitleTouched, setCreateTitleTouched] = useState(false)
    const [createDescriptionTouched, setCreateDescriptionTouched] =
        useState(false)
    const [editTitleTouched, setEditTitleTouched] = useState(false)
    const [editDescriptionTouched, setEditDescriptionTouched] = useState(false)

    const { data, isLoading, isError, refetch } = useFeatureRequests(sort)
    const createMutation = useCreateFeatureRequest()
    const upvoteMutation = useUpvoteFeatureRequest()
    const editMutation = useEditFeatureRequest()
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

    const titleLimits = inputValidation.FEATURE_REQUEST_TITLE
    const descLimits = inputValidation.FEATURE_REQUEST_DESCRIPTION

    const getTitleError = (value: string): string | null => {
        const trimmed = value.trim()
        if (trimmed.length < titleLimits.MIN)
            return t('featureRequests.featureTitleMinLength', {
                min: String(titleLimits.MIN)
            })
        if (trimmed.length > titleLimits.MAX)
            return t('featureRequests.featureTitleMaxLength', {
                max: String(titleLimits.MAX)
            })
        return null
    }

    const getDescriptionError = (value: string): string | null => {
        const trimmed = value.trim()
        if (trimmed.length < descLimits.MIN)
            return t('featureRequests.featureDescriptionMinLength', {
                min: String(descLimits.MIN)
            })
        if (trimmed.length > descLimits.MAX)
            return t('featureRequests.featureDescriptionMaxLength', {
                max: String(descLimits.MAX)
            })
        return null
    }

    const isTitleValid = (value: string): boolean => {
        const trimmed = value.trim()
        return (
            trimmed.length >= titleLimits.MIN &&
            trimmed.length <= titleLimits.MAX
        )
    }

    const isDescriptionValid = (value: string): boolean => {
        const trimmed = value.trim()
        return (
            trimmed.length >= descLimits.MIN && trimmed.length <= descLimits.MAX
        )
    }

    const handleOpenEdit = (featureRequest: FeatureRequest) => {
        setEditingRequest(featureRequest)
        setEditTitle(featureRequest.title)
        setEditDescription(featureRequest.description)
        setEditStatus(featureRequest.status)
        setEditPlatforms(featureRequest.platforms ?? ['web'])
        setEditTitleTouched(false)
        setEditDescriptionTouched(false)
        setShowEditModal(true)
    }

    const handleEditSave = () => {
        if (!editingRequest) return
        if (!isTitleValid(editTitle) || !isDescriptionValid(editDescription))
            return
        editMutation.mutate(
            {
                id: editingRequest.id,
                data: {
                    title: editTitle.trim(),
                    description: editDescription.trim(),
                    status: editStatus,
                    platforms: editPlatforms
                }
            },
            {
                onSuccess: () => {
                    showToast(t('featureRequests.updated'), 'success')
                    setShowEditModal(false)
                    setEditingRequest(null)
                },
                onError: () =>
                    showToast(t('featureRequests.failedToUpdate'), 'error')
            }
        )
    }

    const executeDelete = (id: string) => {
        deleteMutation.mutate(id, {
            onSuccess: () => {
                showToast(t('featureRequests.deleted'), 'success')
                setShowDeleteModal(false)
                setDeletingId(null)
            },
            onError: () =>
                showToast(t('featureRequests.failedToDelete'), 'error')
        })
    }

    const handleDelete = (id: string) => {
        if (skipDeleteConfirmation) {
            executeDelete(id)
            return
        }
        setDeletingId(id)
        setDontAskAgain(false)
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = () => {
        if (!deletingId) return
        if (dontAskAgain) {
            skipDeleteConfirmation = true
        }
        executeDelete(deletingId)
    }

    const handleCreate = () => {
        setCreateTitleTouched(true)
        setCreateDescriptionTouched(true)
        if (
            !isTitleValid(createTitle) ||
            !isDescriptionValid(createDescription)
        )
            return
        createMutation.mutate(
            {
                title: createTitle.trim(),
                description: createDescription.trim(),
                platforms: ['web']
            },
            {
                onSuccess: () => {
                    showToast(t('featureRequests.submitted'), 'success')
                    setShowCreateModal(false)
                    setCreateTitle('')
                    setCreateDescription('')
                    setCreateTitleTouched(false)
                    setCreateDescriptionTouched(false)
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
        { value: 'newest', label: t('featureRequests.sortByNewest') }
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
                        <div className='flex items-center gap-2'>
                            {items.length > 0 && (
                                <Select
                                    value={sort}
                                    displayValue={
                                        sortOptions.find((o) => o.value === sort)
                                            ?.label
                                    }
                                    onValueChange={(value) =>
                                        setSort(value as FeatureRequestSortBy)
                                    }
                                >
                                    <SelectTrigger
                                        className='bg-secondary text-secondary-foreground hover:bg-secondary/80 !h-8 w-auto gap-2 rounded-lg border-0 px-3.5 text-sm font-semibold shadow-sm'
                                        icon={
                                            <FunnelIcon className='h-4 w-4 shrink-0' />
                                        }
                                    />
                                    <SelectContent>
                                        {sortOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            <ActionButton
                                onClick={() => {
                                    if (!user) {
                                        showToast(t('featureRequests.signInToSubmit'), 'info')
                                        return
                                    }
                                    setShowCreateModal(true)
                                }}
                                label={t('featureRequests.submitRequest')}
                                icon={
                                    <PlusCircleIcon className='h-5 w-5' />
                                }
                            />
                        </div>
                    }
                />

                <div className='border-border bg-foreground/5 mt-6 flex items-center gap-3 rounded-xl border px-5 py-4 backdrop-blur-sm'>
                    <RobotIcon className='text-primary h-5 w-5 shrink-0' />
                    <p className='text-sm'>
                        {t('featureRequests.agentBannerDescription')}
                    </p>
                </div>

                <div className='border-border bg-foreground/5 mt-4 rounded-xl border p-4 backdrop-blur-sm sm:p-8'>
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
                        />
                    ) : (
                        <div className='space-y-1.5'>
                            {items.map((item) => (
                                <FeatureRequestCard
                                    key={item.id}
                                    featureRequest={item}
                                    isAuthenticated={!!user}
                                    isAdmin={isAdmin}
                                    isDeleting={deleteMutation.isPending && deleteMutation.variables === item.id}
                                    currentUserId={user?.uid ?? null}
                                    onUpvote={handleUpvote}
                                    onEdit={handleOpenEdit}
                                    onDelete={handleDelete}
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
                            <DialogDescription className='pr-6'>
                                {t('featureRequests.submitModalDescription')}
                            </DialogDescription>
                        </DialogHeader>
                        <div className='mt-4 space-y-4'>
                            <div className='space-y-2'>
                                <Label>
                                    {t('featureRequests.featureTitle')}
                                    <span className='text-red-600 dark:text-red-400'>
                                        {' '}
                                        *
                                    </span>
                                </Label>
                                <Input
                                    value={createTitle}
                                    onChange={(e) => {
                                        setCreateTitle(e.target.value)
                                        setCreateTitleTouched(true)
                                    }}
                                    placeholder={t(
                                        'featureRequests.featureTitlePlaceholder'
                                    )}
                                    maxLength={titleLimits.MAX}
                                />
                                {createTitleTouched &&
                                    getTitleError(createTitle) && (
                                        <p className='text-xs text-red-600 dark:text-red-400'>
                                            {getTitleError(createTitle)}
                                        </p>
                                    )}
                            </div>
                            <div className='space-y-2'>
                                <Label>
                                    {t('featureRequests.featureDescription')}
                                    <span className='text-red-600 dark:text-red-400'>
                                        {' '}
                                        *
                                    </span>
                                </Label>
                                <textarea
                                    value={createDescription}
                                    onChange={(e) => {
                                        setCreateDescription(e.target.value)
                                        setCreateDescriptionTouched(true)
                                    }}
                                    placeholder={t(
                                        'featureRequests.featureDescriptionPlaceholder'
                                    )}
                                    maxLength={descLimits.MAX}
                                    rows={8}
                                    className='border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1'
                                />
                                {createDescriptionTouched &&
                                    getDescriptionError(createDescription) && (
                                        <p className='text-xs text-red-600 dark:text-red-400'>
                                            {getDescriptionError(
                                                createDescription
                                            )}
                                        </p>
                                    )}
                            </div>
                            <div className='!mt-8 flex justify-end gap-3'>
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
                                        !isTitleValid(createTitle) ||
                                        !isDescriptionValid(createDescription)
                                    }
                                >
                                    {createMutation.isPending && (
                                        <CircleNotchIcon className='h-4 w-4 animate-spin' />
                                    )}
                                    {t('featureRequests.submitRequest')}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {t('featureRequests.editModalTitle')}
                            </DialogTitle>
                            <DialogDescription className='pr-6'>
                                {t('featureRequests.editModalDescription')}
                            </DialogDescription>
                        </DialogHeader>
                        <div className='mt-4 space-y-4'>
                            <div className='space-y-2'>
                                <Label>
                                    {t('featureRequests.featureTitle')}
                                    <span className='text-red-600 dark:text-red-400'>
                                        {' '}
                                        *
                                    </span>
                                </Label>
                                <Input
                                    value={editTitle}
                                    onChange={(e) =>
                                        setEditTitle(e.target.value)
                                    }
                                    onBlur={() => setEditTitleTouched(true)}
                                    maxLength={titleLimits.MAX}
                                />
                                {editTitleTouched &&
                                    getTitleError(editTitle) && (
                                        <p className='text-xs text-red-600 dark:text-red-400'>
                                            {getTitleError(editTitle)}
                                        </p>
                                    )}
                            </div>
                            <div className='space-y-2'>
                                <Label>
                                    {t('featureRequests.featureDescription')}
                                    <span className='text-red-600 dark:text-red-400'>
                                        {' '}
                                        *
                                    </span>
                                </Label>
                                <textarea
                                    value={editDescription}
                                    onChange={(e) =>
                                        setEditDescription(e.target.value)
                                    }
                                    onBlur={() =>
                                        setEditDescriptionTouched(true)
                                    }
                                    maxLength={descLimits.MAX}
                                    rows={8}
                                    className='border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1'
                                />
                                {editDescriptionTouched &&
                                    getDescriptionError(editDescription) && (
                                        <p className='text-xs text-red-600 dark:text-red-400'>
                                            {getDescriptionError(
                                                editDescription
                                            )}
                                        </p>
                                    )}
                            </div>
                            <div className='space-y-2'>
                                <Label>{t('featureRequests.status')}</Label>
                                <Select
                                    value={editStatus}
                                    displayValue={getStatusLabel(editStatus)}
                                    onValueChange={(value) =>
                                        setEditStatus(
                                            value as FeatureRequestStatus
                                        )
                                    }
                                >
                                    <SelectTrigger className='w-full' />
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
                            </div>
                            <div className='!mt-8 flex justify-end gap-3'>
                                <Button
                                    variant='outline'
                                    onClick={() => setShowEditModal(false)}
                                >
                                    {t('common.cancel')}
                                </Button>
                                <Button
                                    onClick={handleEditSave}
                                    disabled={
                                        editMutation.isPending ||
                                        !isTitleValid(editTitle) ||
                                        !isDescriptionValid(editDescription)
                                    }
                                >
                                    {editMutation.isPending && (
                                        <CircleNotchIcon className='h-4 w-4 animate-spin' />
                                    )}
                                    {t('common.save')}
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
                        <label className='mt-3 flex cursor-pointer items-center gap-2.5'>
                            <Checkbox
                                checked={dontAskAgain}
                                onCheckedChange={(checked) =>
                                    setDontAskAgain(!!checked)
                                }
                            />
                            <span className='text-muted-foreground text-xs'>
                                {t('featureRequests.dontAskAgain')}
                            </span>
                        </label>
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

export default FeatureRequests