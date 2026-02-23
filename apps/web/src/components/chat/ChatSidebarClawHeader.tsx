import type { FC, ReactNode } from 'react'
import type {
    ChatSidebarClawHeaderProps,
    ClawCardActions,
    ElectronWindow,
    ExportRateLimitError
} from '@/ts/Interfaces'

import { useState } from 'react'
import { t } from '@openclaw/i18n'
import { clawProvider, clawStatus } from '@openclaw/shared'
import { ClockIcon } from '@phosphor-icons/react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui'
import { useUIStore } from '@/lib/store'
import { getBaseDomain, getLocale } from '@/lib'
import { generateSlug } from '@/lib/claw-utils'
import { ClawAvatar } from '@/components'
import {
    useStartClaw,
    useStopClaw,
    useRestartClaw,
    useDeleteClaw,
    useCancelDeletion,
    useHardDeleteClaw,
    useRepairClaw,
    useReinstallClaw,
    useProfile,
    useCancelPendingClaw
} from '@/hooks'
import { api, TRUNCATE_LENGTHS } from '@/lib'
import {
    ClawCardDropdownMenu,
    ClawCardDialogs,
    ClawDiagnosticsDialog,
    ClawLogsDialog,
    ClawConfigDialog
} from '@/components/dashboard'

const ChatSidebarClawHeader: FC<ChatSidebarClawHeaderProps> = ({
    claw,
    isReachable: _isReachable,
    isSelected,
    statusConfig,
    onOpenClawSettings,
    onCreateAgent: _onCreateAgent
}): ReactNode => {
    const { showToast } = useUIStore()
    const [copied, setCopied] = useState(false)
    const [passwordCopied, setPasswordCopied] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showStopModal, setShowStopModal] = useState(false)
    const [showRestartModal, setShowRestartModal] = useState(false)
    const [showHardDeleteModal, setShowHardDeleteModal] = useState(false)
    const [showDiagnostics, setShowDiagnostics] = useState(false)
    const [showLogs, setShowLogs] = useState(false)
    const [showConfig, setShowConfig] = useState(false)
    const [showReinstallModal, setShowReinstallModal] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    const startMutation = useStartClaw()
    const stopMutation = useStopClaw()
    const restartMutation = useRestartClaw()
    const deleteMutation = useDeleteClaw()
    const cancelDeletionMutation = useCancelDeletion()
    const hardDeleteMutation = useHardDeleteClaw()
    const repairMutation = useRepairClaw()
    const reinstallMutation = useReinstallClaw()
    const cancelPendingMutation = useCancelPendingClaw()

    const { data: profile } = useProfile({ enabled: true })

    const isMutating =
        startMutation.isPending ||
        stopMutation.isPending ||
        restartMutation.isPending ||
        deleteMutation.isPending ||
        cancelDeletionMutation.isPending ||
        hardDeleteMutation.isPending ||
        repairMutation.isPending ||
        reinstallMutation.isPending ||
        cancelPendingMutation.isPending ||
        isExporting

    const isScheduledForDeletion = !!claw.deletionScheduledAt
    const hasActionItems =
        claw.status === clawStatus.running ||
        claw.status === clawStatus.stopped ||
        claw.status === clawStatus.off

    const copySSHWithKey = () => {
        const command = `ssh root@${claw.ip}`
        navigator.clipboard.writeText(command)
        setCopied(true)
        showToast(t('dashboard.sshCommandCopied'), 'success')
        setTimeout(() => setCopied(false), 2000)
    }

    const copySSHWithPassword = () => {
        const command = `sshpass -p '${claw.rootPassword}' ssh -o StrictHostKeyChecking=no root@${claw.ip}`
        navigator.clipboard.writeText(command)
        setCopied(true)
        showToast(t('dashboard.sshCommandWithPasswordCopied'), 'success')
        setTimeout(() => setCopied(false), 2000)
    }

    const copyPassword = () => {
        if (!claw.rootPassword) {
            showToast(t('errors.noPasswordAvailable'), 'warning')
            return
        }
        navigator.clipboard.writeText(claw.rootPassword)
        setPasswordCopied(true)
        showToast(t('dashboard.passwordCopiedToClipboard'), 'success')
        setTimeout(() => setPasswordCopied(false), 2000)
    }

    const handleUpdateInstance = () => {
        repairMutation.mutate(claw.id, {
            onSuccess: () => {
                showToast(t('dashboard.updateInstanceSuccess'), 'success')
            },
            onError: () => {
                showToast(t('dashboard.updateInstanceFailed'), 'error')
            }
        })
    }

    const handleExport = async () => {
        setIsExporting(true)
        try {
            await api.exportClaw(claw.id, `${claw.name}-export.tar.gz`)
        } catch (err) {
            const retryAfter = (err as ExportRateLimitError).retryAfter
            if (retryAfter && retryAfter > 30) {
                const minutes = Math.ceil(retryAfter / 60)
                showToast(
                    t('dashboard.exportRateLimited', {
                        minutes: String(minutes)
                    }),
                    'warning'
                )
            } else if (retryAfter && retryAfter > 0) {
                showToast(
                    t('dashboard.exportRateLimitedSeconds', {
                        seconds: String(retryAfter)
                    }),
                    'warning'
                )
            } else {
                showToast(t('dashboard.exportFailed'), 'error')
            }
        } finally {
            setIsExporting(false)
        }
    }

    const handleReinstall = () => {
        reinstallMutation.mutate(claw.id, {
            onSuccess: () => {
                showToast(t('dashboard.reinstallInstanceSuccess'), 'success')
            },
            onError: () => {
                showToast(t('dashboard.reinstallInstanceFailed'), 'error')
            }
        })
    }

    const actions: ClawCardActions = {
        onStart: () =>
            startMutation.mutate(claw.id, {
                onError: (err) => {
                    const message =
                        err instanceof Error
                            ? err.message
                            : typeof err === 'object' &&
                                err !== null &&
                                'message' in err
                              ? String((err as { message: unknown }).message)
                              : t('dashboard.startFailed')
                    showToast(message, 'error')
                }
            }),
        onShowStopModal: () => setShowStopModal(true),
        onShowRestartModal: () => setShowRestartModal(true),
        onShowDeleteModal: () => setShowDeleteModal(true),
        onCancelDeletion: () => cancelDeletionMutation.mutate(claw.id),
        onShowHardDeleteModal: () => setShowHardDeleteModal(true),
        onShowDiagnostics: () => setShowDiagnostics(true),
        onShowLogs: () => setShowLogs(true),
        onShowConfig: () => setShowConfig(true),
        onUpdateInstance: handleUpdateInstance,
        onShowReinstallModal: () => setShowReinstallModal(true),
        onCopySSH: claw.rootPassword ? copySSHWithPassword : copySSHWithKey,
        onCopySSHWithKey: copySSHWithKey,
        onCopySSHWithPassword: copySSHWithPassword,
        onCopyPassword: copyPassword,
        onExport: handleExport,
        onResumeCheckout: () => {
            if (claw.checkoutUrl) {
                window.open(claw.checkoutUrl, '_blank')
            }
        },
        onCancelPending: () => {
            const pendingId = claw.id.replace('pending-', '')
            cancelPendingMutation.mutate(pendingId)
        }
    }

    return (
        <>
            <div
                onClick={() => onOpenClawSettings(claw.id)}
                className={`group/header relative mb-1 flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-1.5 text-left transition-colors ${
                    isSelected ? 'bg-foreground/10' : 'hover:bg-foreground/5'
                }`}
            >
                <div className='relative shrink-0'>
                    <ClawAvatar size='sm' />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className='border-background absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2'>
                                <div
                                    className={`h-2 w-2 rounded-full ${statusConfig.color} ${statusConfig.pulse ? 'animate-pulse' : 'status-dot-alive'}`}
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side='bottom'>
                            <p>{statusConfig.label}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <div className='min-w-0 flex-1'>
                    {claw.name.length > TRUNCATE_LENGTHS.SIDEBAR_CLAW_NAME ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <p className='text-foreground truncate text-[13px] font-medium'>
                                    {claw.name.slice(
                                        0,
                                        TRUNCATE_LENGTHS.SIDEBAR_CLAW_NAME
                                    )}
                                    ...
                                </p>
                            </TooltipTrigger>
                            <TooltipContent>{claw.name}</TooltipContent>
                        </Tooltip>
                    ) : (
                        <p className='text-foreground truncate text-[13px] font-medium'>
                            {claw.name}
                        </p>
                    )}
                    {isScheduledForDeletion ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className='flex items-center gap-1'>
                                    <ClockIcon
                                        className='text-muted-foreground h-3 w-3 shrink-0'
                                        weight='fill'
                                    />
                                    <span className='text-muted-foreground truncate text-[11px]'>
                                        {t(
                                            'dashboard.scheduledDeletionShort',
                                            {
                                                date: new Date(
                                                    claw.deletionScheduledAt!
                                                ).toLocaleDateString(
                                                    getLocale(),
                                                    {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    }
                                                )
                                            }
                                        )}
                                    </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side='bottom'>
                                <p>{t('dashboard.scheduledForDeletion')}</p>
                            </TooltipContent>
                        </Tooltip>
                    ) : claw.status !== clawStatus.configuring && claw.status !== clawStatus.awaitingPayment ? (
                        claw.provider === clawProvider.local && claw.subdomain ? (
                            <button
                                type='button'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    const url = `https://${claw.subdomain}.clawhost${claw.gatewayToken ? `/?token=${claw.gatewayToken}` : ''}`
                                    const eApi = (window as unknown as ElectronWindow).electronAPI
                                    if (eApi?.openExternal) {
                                        eApi.openExternal(url)
                                    } else {
                                        window.open(url, '_blank')
                                    }
                                }}
                                className='text-muted-foreground hover:text-foreground/80 block truncate text-[11px] transition-colors'
                            >
                                {claw.subdomain}.clawhost
                            </button>
                        ) : (
                            <a
                                href={`https://${claw.subdomain || generateSlug(claw.id)}.${getBaseDomain()}${claw.gatewayToken ? `/?token=${claw.gatewayToken}` : ''}`}
                                target='_blank'
                                rel='noopener noreferrer'
                                onClick={(e) => e.stopPropagation()}
                                className='text-muted-foreground hover:text-foreground/80 block truncate text-[11px] transition-colors'
                            >
                                {claw.subdomain || generateSlug(claw.id)}.
                                {getBaseDomain()}
                            </a>
                        )
                    ) : (
                        <p className='text-muted-foreground truncate text-[11px]'>
                            {statusConfig.label}
                        </p>
                    )}
                </div>
                <div
                    className='flex shrink-0 items-center gap-1'
                    onClick={(e) => e.stopPropagation()}
                >
                    <div>
                        <ClawCardDropdownMenu
                            claw={claw}
                            actions={actions}
                            isLoading={isMutating}
                            copied={copied}
                            passwordCopied={passwordCopied}
                            hasActionItems={hasActionItems}
                            isScheduledForDeletion={isScheduledForDeletion}
                            isAdmin={profile?.role === 'admin'}
                            compact
                        />
                    </div>
                </div>
            </div>
            <ClawCardDialogs
                clawName={claw.name}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                showStopModal={showStopModal}
                setShowStopModal={setShowStopModal}
                showRestartModal={showRestartModal}
                setShowRestartModal={setShowRestartModal}
                showHardDeleteModal={showHardDeleteModal}
                setShowHardDeleteModal={setShowHardDeleteModal}
                onDelete={() => deleteMutation.mutate(claw.id)}
                onStop={() => stopMutation.mutate(claw.id)}
                onRestart={() => restartMutation.mutate(claw.id)}
                onHardDelete={() => hardDeleteMutation.mutate(claw.id)}
                isDeletePending={deleteMutation.isPending}
                isStopPending={stopMutation.isPending}
                isRestartPending={restartMutation.isPending}
                isHardDeletePending={hardDeleteMutation.isPending}
                showReinstallModal={showReinstallModal}
                setShowReinstallModal={setShowReinstallModal}
                onReinstall={handleReinstall}
                isReinstallPending={reinstallMutation.isPending}
            />
            <ClawDiagnosticsDialog
                clawId={claw.id}
                open={showDiagnostics}
                onOpenChange={setShowDiagnostics}
            />
            <ClawLogsDialog
                clawId={claw.id}
                open={showLogs}
                onOpenChange={setShowLogs}
            />
            <ClawConfigDialog
                clawId={claw.id}
                open={showConfig}
                onOpenChange={setShowConfig}
            />
        </>
    )
}

export default ChatSidebarClawHeader