import type { FC, ReactNode } from 'react'
import type {
    ClawCardActions,
    ExportRateLimitError,
    PlaygroundClawNodeProps
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
import ProviderIcon from '@/components/ProviderIcon'
import getStatusConfig from '@/lib/claw-utils/getStatusConfig'
import { Plus, WifiSlash } from '@phosphor-icons/react'
import { ClawCardDropdownMenu } from '@/components/dashboard/ClawCardDropdownMenu'
import { ClawCardDialogs } from '@/components/dashboard/ClawCardDialogs'
import ClawDiagnosticsDialog from '@/components/dashboard/ClawDiagnosticsDialog'
import ClawLogsDialog from '@/components/dashboard/ClawLogsDialog'
import ClawConfigDialog from '@/components/dashboard/ClawConfigDialog'
import CreateAgentModal from '@/components/playground/CreateAgentModal'
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent
} from '@/components/ui/tooltip'
import { Handle, Position } from '@xyflow/react'

const handleStyle = {
    bottom: 0,
    width: 0,
    height: 0,
    minWidth: 0,
    minHeight: 0,
    border: 'none',
    background: 'none',
    opacity: 0
}

const PlaygroundClawNode: FC<PlaygroundClawNodeProps> = ({
    data
}): ReactNode => {
    const { claw, agentCount, isLoadingAgents, isReachable, isSelected, readOnly } = data
    const statusConfigs = getStatusConfig()
    const status = statusConfigs[claw.status] || statusConfigs.unknown

    const isRunning = claw.status === 'running'
    const isOffline = claw.status === 'stopped' || claw.status === 'off'

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
    const [showAddAgent, setShowAddAgent] = useState(false)

    const startMutation = useStartClaw()
    const stopMutation = useStopClaw()
    const restartMutation = useRestartClaw()
    const deleteMutation = useDeleteClaw()
    const cancelDeletionMutation = useCancelDeletion()
    const hardDeleteMutation = useHardDeleteClaw()
    const repairMutation = useRepairClaw()
    const reinstallMutation = useReinstallClaw()

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
        isExporting

    const isScheduledForDeletion = !!claw.deletionScheduledAt
    const hasActionItems =
        claw.status === 'running' ||
        claw.status === 'stopped' ||
        claw.status === 'off'

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
            <div
                className={`playground-node-enter relative w-[280px] cursor-pointer rounded-xl border bg-[#151518] ${
                    isSelected
                        ? 'border-[#ef5350]/50 shadow-[0_0_20px_rgba(239,83,80,0.15)]'
                        : isOffline || !isReachable
                          ? 'border-white/5 opacity-50'
                          : 'border-white/10'
                } ${isRunning && !isSelected ? 'shadow-[0_0_30px_rgba(239,83,80,0.08)]' : ''}`}
            >
                <div className='flex items-center gap-2 border-b border-white/5 px-4 py-3'>
                    <ProviderIcon
                        provider={claw.provider}
                        className='h-5 w-5'
                    />
                    <div className='flex flex-1 items-center gap-2 overflow-hidden'>
                        <span className='truncate text-sm font-semibold text-white'>
                            {claw.name}
                        </span>
                        <span
                            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${status.bgColor}`}
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${status.color} ${status.pulse ? 'animate-pulse' : ''}`}
                            />
                            {status.label}
                        </span>
                    </div>
                    {!readOnly && (
                        <>
                            <div
                                className='flex shrink-0 items-center'
                                onClick={(e) => e.stopPropagation()}
                                onPointerDown={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <ClawCardDropdownMenu
                                    claw={claw}
                                    actions={actions}
                                    isLoading={isMutating}
                                    copied={copied}
                                    passwordCopied={passwordCopied}
                                    hasActionItems={hasActionItems}
                                    isScheduledForDeletion={isScheduledForDeletion}
                                    isAdmin={profile?.role === 'admin'}
                                    isPlayground
                                    compact
                                />
                            </div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (!isLoadingAgents) setShowAddAgent(true)
                                        }}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        disabled={isLoadingAgents}
                                        className={`shrink-0 rounded-md p-1 transition-colors ${
                                            isLoadingAgents
                                                ? 'cursor-not-allowed text-gray-700'
                                                : 'text-gray-500 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        <Plus className='h-3.5 w-3.5' weight='bold' />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side='top'>
                                    <p>{t('playground.addAgent')}</p>
                                </TooltipContent>
                            </Tooltip>
                        </>
                    )}
                </div>

                <div className='px-4 py-3'>
                    {claw.ip && (
                        <p className='mb-2 font-mono text-xs text-gray-500'>
                            {claw.ip}
                        </p>
                    )}

                    <div className='flex items-center gap-2'>
                        {isLoadingAgents ? (
                            <div className='flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1'>
                                <div className='h-3 w-3 animate-spin rounded-full border border-white/10 border-t-white/40' />
                                <span className='text-xs text-gray-500'>
                                    {t('playground.loadingAgents')}
                                </span>
                            </div>
                        ) : !isReachable && !isOffline ? (
                            <div className='flex items-center gap-1.5 rounded-md bg-red-500/10 px-2 py-1'>
                                <WifiSlash className='h-3 w-3 text-red-400' />
                                <span className='text-xs text-red-400'>
                                    {t('playground.unreachable')}
                                </span>
                            </div>
                        ) : isOffline ? (
                            <div className='flex items-center gap-1.5 rounded-md bg-gray-500/10 px-2 py-1'>
                                <span className='text-xs text-gray-400'>
                                    {t('playground.offline')}
                                </span>
                            </div>
                        ) : agentCount === 0 ? (
                            <div className='flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1'>
                                <span className='text-xs text-gray-400'>
                                    {t('playground.noAgents')}
                                </span>
                            </div>
                        ) : (
                            <div className='flex items-center gap-1.5 rounded-md bg-[#ef5350]/10 px-2 py-1'>
                                <span className='text-xs text-[#ef5350]'>
                                    {agentCount === 1
                                        ? t('playground.agentCount', {
                                              count: String(agentCount)
                                          })
                                        : t('playground.agentCountPlural', {
                                              count: String(agentCount)
                                          })}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <Handle
                    type='source'
                    position={Position.Bottom}
                    isConnectable={false}
                    style={handleStyle}
                />
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
            <CreateAgentModal
                clawId={claw.id}
                clawName={claw.name}
                open={showAddAgent}
                onOpenChange={setShowAddAgent}
            />
        </>
    )
}

export default PlaygroundClawNode