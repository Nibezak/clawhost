import type { FC, ReactNode } from 'react'
import type {
    ClawCardProps,
    ClawCardActions,
    ExportRateLimitError
} from '@/ts/Interfaces'

import { useState } from 'react'
import { t } from '@openclaw/i18n'
import { useUIStore } from '@/lib/store'
import {
    useStartClaw,
    useStopClaw,
    useRestartClaw,
    useDeleteClaw,
    useCancelDeletion,
    useHardDeleteClaw,
    useRepairClaw,
    useReinstallClaw,
    useProfile
} from '@/hooks'
import { api } from '@/lib/api'
import { getStatusConfig, locationFlags, locationNames } from '@/lib/claw-utils'
import { ClawCardGridView } from '@/components/dashboard/ClawCardGridView'
import { ClawCardListView } from '@/components/dashboard/ClawCardListView'
import { ClawCardDialogs } from '@/components/dashboard/ClawCardDialogs'
import ClawDiagnosticsDialog from '@/components/dashboard/ClawDiagnosticsDialog'
import ClawLogsDialog from '@/components/dashboard/ClawLogsDialog'
import ClawConfigDialog from '@/components/dashboard/ClawConfigDialog'

const ClawCard: FC<ClawCardProps> = ({
    claw,
    sshKeys,
    plans,
    viewMode = 'list'
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
    const [isExpanded, setIsExpanded] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    const startMutation = useStartClaw()
    const stopMutation = useStopClaw()
    const restartMutation = useRestartClaw()
    const deleteMutation = useDeleteClaw()
    const cancelDeletionMutation = useCancelDeletion()
    const hardDeleteMutation = useHardDeleteClaw()
    const repairMutation = useRepairClaw()
    const reinstallMutation = useReinstallClaw()

    const { data: profile } = useProfile({ enabled: true })

    const isLoading =
        startMutation.isPending ||
        stopMutation.isPending ||
        restartMutation.isPending ||
        deleteMutation.isPending ||
        cancelDeletionMutation.isPending ||
        hardDeleteMutation.isPending ||
        repairMutation.isPending ||
        reinstallMutation.isPending ||
        isExporting

    const attachedSshKey = claw.sshKeyId
        ? sshKeys.find((k) => k.id === claw.sshKeyId)
        : null
    const isScheduledForDeletion = !!claw.deletionScheduledAt
    const hasActionItems =
        claw.status === 'running' ||
        claw.status === 'stopped' ||
        claw.status === 'off'

    const statusConfig = getStatusConfig()
    const status = statusConfig[claw.status] || statusConfig.stopped

    const hasBothOptions = !!(attachedSshKey && claw.rootPassword)
    const plan = plans.find((p) => p.id === claw.planId)
    const monthlyPrice = plan ? plan.priceMonthly : null
    const locationName = claw.location
        ? locationNames[claw.location] || claw.location
        : 'Unknown'
    const flag = claw.location ? locationFlags[claw.location] : null

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
        onStart: () => startMutation.mutate(claw.id),
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
        onExport: handleExport
    }

    return (
        <>
            {viewMode === 'grid' ? (
                <ClawCardGridView
                    claw={claw}
                    status={status}
                    flag={flag}
                    locationName={locationName}
                    plan={plan}
                    monthlyPrice={monthlyPrice}
                    attachedSshKey={attachedSshKey || null}
                    actions={actions}
                    isLoading={isLoading}
                    copied={copied}
                    passwordCopied={passwordCopied}
                    hasActionItems={hasActionItems}
                    hasBothOptions={hasBothOptions}
                    isScheduledForDeletion={isScheduledForDeletion}
                    isAdmin={profile?.role === 'admin'}
                />
            ) : (
                <ClawCardListView
                    claw={claw}
                    status={status}
                    flag={flag}
                    locationName={locationName}
                    plan={plan}
                    monthlyPrice={monthlyPrice}
                    attachedSshKey={attachedSshKey || null}
                    actions={actions}
                    isLoading={isLoading}
                    copied={copied}
                    passwordCopied={passwordCopied}
                    hasActionItems={hasActionItems}
                    isScheduledForDeletion={isScheduledForDeletion}
                    isAdmin={profile?.role === 'admin'}
                    isExpanded={isExpanded}
                    onToggleExpand={() => setIsExpanded(!isExpanded)}
                />
            )}
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

export { ClawCard }