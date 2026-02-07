import type { FC, ReactNode } from 'react'
import type { ClawCardProps, ClawCardActions } from '@/ts/Interfaces'
import { useState } from 'react'
import { t } from '@openclaw/i18n'
import { useUIStore } from '@/lib/store'
import {
  useStartClaw,
  useStopClaw,
  useRestartClaw,
  useDeleteClaw,
  useCancelDeletion,
} from '@/hooks'
import { getStatusConfig, locationFlags, locationNames } from '@/lib/claw-utils'
import { ClawCardGridView } from '@/components/dashboard/ClawCardGridView'
import { ClawCardListView } from '@/components/dashboard/ClawCardListView'
import { ClawCardDialogs } from '@/components/dashboard/ClawCardDialogs'

const ClawCard: FC<ClawCardProps> = ({ claw, sshKeys, plans, viewMode = 'list' }): ReactNode => {
  const { showToast } = useUIStore()
  const [copied, setCopied] = useState(false)
  const [passwordCopied, setPasswordCopied] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showStopModal, setShowStopModal] = useState(false)
  const [showRestartModal, setShowRestartModal] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const startMutation = useStartClaw()
  const stopMutation = useStopClaw()
  const restartMutation = useRestartClaw()
  const deleteMutation = useDeleteClaw()
  const cancelDeletionMutation = useCancelDeletion()

  const isLoading =
    startMutation.isPending ||
    stopMutation.isPending ||
    restartMutation.isPending ||
    deleteMutation.isPending ||
    cancelDeletionMutation.isPending

  const attachedSshKey = claw.sshKeyId ? sshKeys.find((k) => k.id === claw.sshKeyId) : null
  const isScheduledForDeletion = !!claw.deletionScheduledAt
  const hasActionItems = claw.status === 'running' || claw.status === 'stopped' || claw.status === 'off'

  const statusConfig = getStatusConfig()
  const status = statusConfig[claw.status] || statusConfig.stopped

  const hasBothOptions = !!(attachedSshKey && claw.rootPassword)
  const plan = plans.find((p) => p.id === claw.planId)
  const monthlyPrice = plan ? plan.priceMonthly : null
  const locationName = claw.location ? locationNames[claw.location] || claw.location : 'Unknown'
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

  const actions: ClawCardActions = {
    onStart: () => startMutation.mutate(claw.id),
    onShowStopModal: () => setShowStopModal(true),
    onShowRestartModal: () => setShowRestartModal(true),
    onShowDeleteModal: () => setShowDeleteModal(true),
    onCancelDeletion: () => cancelDeletionMutation.mutate(claw.id),
    onCopySSH: claw.rootPassword ? copySSHWithPassword : copySSHWithKey,
    onCopySSHWithKey: copySSHWithKey,
    onCopySSHWithPassword: copySSHWithPassword,
    onCopyPassword: copyPassword,
  }

  return (
    <>
      {viewMode === 'grid' ? (
        <ClawCardGridView
          claw={claw}
          status={status}
          flag={flag}
          actions={actions}
          isLoading={isLoading}
          copied={copied}
          passwordCopied={passwordCopied}
          hasActionItems={hasActionItems}
          hasBothOptions={hasBothOptions}
          isScheduledForDeletion={isScheduledForDeletion}
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
          hasBothOptions={hasBothOptions}
          isScheduledForDeletion={isScheduledForDeletion}
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
        onDelete={() => deleteMutation.mutate(claw.id)}
        onStop={() => stopMutation.mutate(claw.id)}
        onRestart={() => restartMutation.mutate(claw.id)}
        isDeletePending={deleteMutation.isPending}
        isStopPending={stopMutation.isPending}
        isRestartPending={restartMutation.isPending}
      />
    </>
  )
}

export { ClawCard }
