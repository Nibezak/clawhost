import type { FC, ReactNode } from 'react'
import type {
  ClawCardProps,
  CopyableFieldProps,
  CreateClawModalProps,
  StatusConfig,
} from '@/ts/Interfaces'
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { t } from '@openclaw/i18n'
import { useAuth } from '@/lib/auth'
import { useUIStore, usePreferencesStore } from '@/lib/store'
import { ROUTES } from '@/lib/routes'
import {
  useClaws,
  usePurchaseClaw,
  useStartClaw,
  useStopClaw,
  useRestartClaw,
  useDeleteClaw,
  useSSHKeys,
  usePlans,
  useLocations,
  useVolumePricing,
  useUserStats,
} from '@/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Header } from '@/components/Header'
import { LandingFooter } from '@/components/LandingFooter'
import { PageBackground } from '@/components/PageBackground'
import { PageTitle } from '@/components/PageTitle'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Play,
  Square,
  ArrowClockwise,
  Trash,
  DotsThreeOutline,
  Terminal,
  Check,
  CircleNotch,
  Eye,
  EyeSlash,
  Key,
  List,
  SquaresFour,
  Copy,
  CaretDown,
  Lightning,
} from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { ActionButton } from '@/components/ActionButton'
import { ClawMascot } from '@/components/ClawMascot'

function generatePassword(length = 16): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => chars[byte % chars.length]).join('')
}

function generateSlug(id: string): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789' // Removed confusing chars: i, l, o, 0, 1
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash = hash & hash
  }
  let slug = ''
  let num = Math.abs(hash)
  for (let i = 0; i < 7; i++) {
    slug += chars[num % chars.length]
    num = Math.floor(num / chars.length) + id.charCodeAt(i % id.length)
  }
  return slug
}

const locationFlags: Record<string, string> = {
  ash: '🇺🇸', // Ashburn, USA
  hil: '🇺🇸', // Hillsboro, USA
  fsn1: '🇩🇪', // Falkenstein, Germany
  nbg1: '🇩🇪', // Nuremberg, Germany
  hel1: '🇫🇮', // Helsinki, Finland
  sin: '🇸🇬', // Singapore
  'fsn1-dc14': '🇩🇪',
  'nbg1-dc3': '🇩🇪',
  'hel1-dc2': '🇫🇮',
  'ash-dc1': '🇺🇸',
  'hil-dc1': '🇺🇸',
}

const locationNames: Record<string, string> = {
  ash: 'Ashburn, USA',
  hil: 'Hillsboro, USA',
  fsn1: 'Falkenstein, Germany',
  nbg1: 'Nuremberg, Germany',
  hel1: 'Helsinki, Finland',
  sin: 'Singapore',
  'fsn1-dc14': 'Falkenstein, Germany',
  'nbg1-dc3': 'Nuremberg, Germany',
  'hel1-dc2': 'Helsinki, Finland',
  'ash-dc1': 'Ashburn, USA',
  'hil-dc1': 'Hillsboro, USA',
}

function getStatusConfig(): Record<string, StatusConfig> {
  return {
    running: { color: 'bg-green-500', bgColor: 'bg-green-500/10', label: t('dashboard.status.running') },
    stopped: { color: 'bg-gray-400', bgColor: 'bg-gray-400/10', label: t('dashboard.status.stopped') },
    off: { color: 'bg-gray-400', bgColor: 'bg-gray-400/10', label: t('dashboard.status.off') },
    starting: {
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-500/10',
      label: t('dashboard.status.starting'),
      pulse: true,
    },
    stopping: {
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-500/10',
      label: t('dashboard.status.stopping'),
      pulse: true,
    },
    creating: { color: 'bg-blue-500', bgColor: 'bg-blue-500/10', label: t('dashboard.status.creating'), pulse: true },
    initializing: {
      color: 'bg-blue-500',
      bgColor: 'bg-blue-500/10',
      label: t('dashboard.status.initializing'),
      pulse: true,
    },
    migrating: {
      color: 'bg-purple-500',
      bgColor: 'bg-purple-500/10',
      label: t('dashboard.status.migrating'),
      pulse: true,
    },
    rebuilding: {
      color: 'bg-orange-500',
      bgColor: 'bg-orange-500/10',
      label: t('dashboard.status.rebuilding'),
      pulse: true,
    },
    deleting: { color: 'bg-red-500', bgColor: 'bg-red-500/10', label: t('dashboard.status.deleting'), pulse: true },
    unknown: { color: 'bg-gray-400', bgColor: 'bg-gray-400/10', label: t('dashboard.status.unknown') },
  }
}

const ClawSkeleton: FC = (): ReactNode => {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const ClawCard: FC<ClawCardProps> = ({ claw, sshKeys, plans, viewMode = 'list' }): ReactNode => {
  const { showToast } = useUIStore()
  const [copied, setCopied] = useState(false)
  const [passwordCopied, setPasswordCopied] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const startMutation = useStartClaw()
  const stopMutation = useStopClaw()
  const restartMutation = useRestartClaw()
  const deleteMutation = useDeleteClaw()

  const isLoading =
    startMutation.isPending ||
    stopMutation.isPending ||
    restartMutation.isPending ||
    deleteMutation.isPending

  const attachedSshKey = claw.sshKeyId ? sshKeys.find((k) => k.id === claw.sshKeyId) : null

  const statusConfig = getStatusConfig()
  const status = statusConfig[claw.status] || statusConfig.stopped

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

  const hasBothOptions = attachedSshKey && claw.rootPassword

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

  const copyField = (label: string, value: string) => {
    navigator.clipboard.writeText(value)
    setCopiedField(label)
    showToast(t('common.copiedWithLabel', { label }), 'success')
    setTimeout(() => setCopiedField(null), 2000)
  }

  const plan = plans.find((p) => p.id === claw.planId)
  const monthlyPrice = plan ? plan.priceMonthly : null
  const locationName = claw.location ? locationNames[claw.location] || claw.location : 'Unknown'
  const flag = claw.location ? locationFlags[claw.location] : null

  if (viewMode === 'grid') {
    return (
      <Card>
        <CardContent className="py-4">
          <div className="mb-3 flex items-start justify-between">
            <div className="relative">
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg text-xl">
                {flag || <ClawMascot className="h-5 w-5" />}
              </div>
              <div
                className={`border-background absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 ${status.color} ${status.pulse ? 'animate-pulse' : ''}`}
              />
            </div>
            {deleteMutation.isPending ? (
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                <CircleNotch className="h-4 w-4 animate-spin" />
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <DotsThreeOutline className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {(claw.status === 'stopped' || claw.status === 'off') && (
                    <DropdownMenuItem onClick={() => startMutation.mutate(claw.id)} disabled={isLoading}>
                      <Play className="mr-2 h-4 w-4" />
                      {t('dashboard.start')}
                    </DropdownMenuItem>
                  )}
                  {claw.status === 'running' && (
                    <>
                      <DropdownMenuItem onClick={() => stopMutation.mutate(claw.id)} disabled={isLoading}>
                        <Square className="mr-2 h-4 w-4" />
                        {t('dashboard.stop')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => restartMutation.mutate(claw.id)}
                        disabled={isLoading}
                      >
                        <ArrowClockwise className="mr-2 h-4 w-4" />
                        {t('dashboard.restart')}
                      </DropdownMenuItem>
                    </>
                  )}
                  {claw.rootPassword && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={copyPassword}>
                        {passwordCopied ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            {t('common.copied')}
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            {t('dashboard.copyPassword')}
                          </>
                        )}
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowDeleteModal(true)}
                    disabled={isLoading}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    {t('common.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="mb-2">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base font-semibold">{claw.name}</h3>
              {claw.hetznerServerId && (
                <span className="text-muted-foreground font-mono text-xs">
                  #{claw.hetznerServerId}
                </span>
              )}
            </div>
            <span
              className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${status.bgColor}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${status.color} mr-1.5 ${status.pulse ? 'animate-pulse' : ''}`}
              />
              {status.label}
            </span>
          </div>

          <div className="text-muted-foreground mb-3 space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span>{t('dashboard.plan')}</span>
              <span className="text-foreground">{claw.planId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{t('dashboard.location')}</span>
              <span className="text-foreground">{claw.location || t('common.unknown')}</span>
            </div>
            {claw.ip && (
              <div className="flex items-center justify-between">
                <span>{t('dashboard.ip')}</span>
                <span className="text-foreground font-mono text-xs">{claw.ip}</span>
              </div>
            )}
          </div>

          {claw.status === 'running' &&
            claw.ip &&
            (hasBothOptions ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        {t('common.copied')}
                      </>
                    ) : (
                      <>
                        <Terminal className="mr-2 h-4 w-4" />
                        {t('dashboard.connect')}
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem onClick={copySSHWithKey}>
                    <Key className="mr-2 h-4 w-4" />
                    {t('dashboard.copySshWithKey')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={copySSHWithPassword}>
                    <Copy className="mr-2 h-4 w-4" />
                    {t('dashboard.copySshWithPassword')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={claw.rootPassword ? copySSHWithPassword : copySSHWithKey}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {t('common.copied')}
                  </>
                ) : (
                  <>
                    <Terminal className="mr-2 h-4 w-4" />
                    {t('dashboard.connect')}
                  </>
                )}
              </Button>
            ))}
        </CardContent>

        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('dashboard.deleteClaw')}</DialogTitle>
              <DialogDescription>
                {t('dashboard.deleteClawConfirmation')} <strong>{claw.name}</strong>? {t('dashboard.actionCannotBeUndone')}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                {t('common.cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteMutation.mutate(claw.id)
                  setShowDeleteModal(false)
                }}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
                    {t('dashboard.deleting')}
                  </>
                ) : (
                  t('common.delete')
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    )
  }

  const CopyableField: FC<CopyableFieldProps> = ({ label, value }): ReactNode => (
    <div
      onClick={() => copyField(label, value)}
      className="bg-background hover:bg-background/80 group flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 transition-colors"
    >
      <div className="min-w-0">
        <span className="text-muted-foreground block text-xs">{label}</span>
        <span className="block truncate font-mono text-sm">{value}</span>
      </div>
      <div className="shrink-0">
        {copiedField === label ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="text-muted-foreground h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </div>
    </div>
  )

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-xl">
                <ClawMascot className="h-6 w-6" />
              </div>
              <div
                className={`border-background absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 ${status.color} ${status.pulse ? 'animate-pulse' : ''}`}
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold">{claw.name}</h3>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${status.bgColor}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${status.color} mr-1.5 ${status.pulse ? 'animate-pulse' : ''}`}
                  />
                  {status.label}
                </span>
              </div>
              <a
                href={`https://${claw.subdomain || generateSlug(claw.id)}.clawhost.cloud${claw.gatewayToken ? `/?token=${claw.gatewayToken}` : ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {claw.subdomain || generateSlug(claw.id)}.clawhost.cloud
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="shrink-0"
            >
              <CaretDown
                className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </Button>

            {deleteMutation.isPending ? (
              <Button variant="ghost" size="icon" disabled>
                <CircleNotch className="h-5 w-5 animate-spin" />
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <DotsThreeOutline className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {(claw.status === 'stopped' || claw.status === 'off') && (
                    <DropdownMenuItem onClick={() => startMutation.mutate(claw.id)} disabled={isLoading}>
                      <Play className="mr-2 h-4 w-4" />
                      {t('dashboard.start')}
                    </DropdownMenuItem>
                  )}
                  {claw.status === 'running' && (
                    <>
                      <DropdownMenuItem onClick={() => stopMutation.mutate(claw.id)} disabled={isLoading}>
                        <Square className="mr-2 h-4 w-4" />
                        {t('dashboard.stop')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => restartMutation.mutate(claw.id)}
                        disabled={isLoading}
                      >
                        <ArrowClockwise className="mr-2 h-4 w-4" />
                        {t('dashboard.restart')}
                      </DropdownMenuItem>
                    </>
                  )}
                  {claw.status === 'running' && claw.ip && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={claw.rootPassword ? copySSHWithPassword : copySSHWithKey}
                      >
                        {copied ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            {t('common.copied')}
                          </>
                        ) : (
                          <>
                            <Terminal className="mr-2 h-4 w-4" />
                            {t('dashboard.connect')}
                          </>
                        )}
                      </DropdownMenuItem>
                    </>
                  )}
                  {claw.rootPassword && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={copyPassword}>
                        {passwordCopied ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            {t('common.copied')}
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            {t('dashboard.copyPassword')}
                          </>
                        )}
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowDeleteModal(true)}
                    disabled={isLoading}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    {t('common.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-border mt-4 border-t pt-4"
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <CopyableField
                label={t('dashboard.domain')}
                value={`${claw.subdomain || generateSlug(claw.id)}.clawhost.cloud`}
              />

              {claw.ip && <CopyableField label={t('dashboard.ipAddress')} value={claw.ip} />}

              <CopyableField label={t('dashboard.location')} value={`${flag || ''} ${locationName}`.trim()} />

              <CopyableField
                label={t('dashboard.plan')}
                value={
                  plan
                    ? `${plan.name} (${plan.cpu} vCPU, ${plan.memory}GB RAM, ${plan.disk}GB SSD)`
                    : claw.planId
                }
              />

              {monthlyPrice && (
                <CopyableField label={t('dashboard.monthlyCost')} value={`$${monthlyPrice.toFixed(0)}/mo`} />
              )}

              {claw.hetznerServerId && (
                <CopyableField label={t('dashboard.serverId')} value={`#${claw.hetznerServerId}`} />
              )}

              {claw.createdAt && (
                <CopyableField
                  label={t('dashboard.created')}
                  value={new Date(claw.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                />
              )}

              {attachedSshKey && <CopyableField label={t('dashboard.sshKey')} value={attachedSshKey.name} />}

              {claw.volumes && claw.volumes.length > 0 && (
                <CopyableField
                  label={t('dashboard.storage')}
                  value={`${claw.volumes.reduce((sum, v) => sum + v.size, 0)} GB`}
                />
              )}

              {claw.gatewayToken && (
                <CopyableField label={t('dashboard.gatewayToken')} value={claw.gatewayToken} />
              )}
            </div>
          </motion.div>
        )}
      </CardContent>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dashboard.deleteClaw')}</DialogTitle>
            <DialogDescription>
              {t('dashboard.deleteClawConfirmation')} <strong>{claw.name}</strong>? {t('dashboard.actionCannotBeUndone')}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteMutation.mutate(claw.id)
                setShowDeleteModal(false)
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
                  {t('dashboard.deleting')}
                </>
              ) : (
                t('common.delete')
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

const CreateClawModal: FC<CreateClawModalProps> = ({
  plans,
  locations,
  sshKeys,
  volumePricing,
  preselectedPlanId,
  onClose,
  onNavigateToSSHKeys,
}): ReactNode => {
  const [name, setName] = useState('')
  const initialPlanId =
    preselectedPlanId && plans.find((p) => p.id === preselectedPlanId)
      ? preselectedPlanId
      : plans[0]?.id || ''
  const [planId, setPlanId] = useState(initialPlanId)
  const [location, setLocation] = useState(locations[0]?.id || '')
  const [password, setPassword] = useState(generatePassword())
  const [showPassword, setShowPassword] = useState(false)
  const [selectedSshKeyId, setSelectedSshKeyId] = useState<string>('')
  const [volumeSize, setVolumeSize] = useState<number>(0)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { showToast } = useUIStore()

  const purchaseMutation = usePurchaseClaw()

  const handleCreate = () => {
    const selectedPlanData = plans.find((p) => p.id === planId)
    if (!selectedPlanData) {
      showToast(t('errors.invalidPlan'), 'error')
      return
    }

    let totalPrice = selectedPlanData.priceMonthly
    if (volumeSize > 0 && volumePricing) {
      totalPrice += volumeSize * volumePricing.pricePerGbMonthly
    }

    purchaseMutation.mutate(
      {
        name,
        planId,
        location,
        password: password || undefined,
        sshKeyId: selectedSshKeyId || undefined,
        volumeSize: volumeSize > 0 ? volumeSize : undefined,
        priceMonthly: totalPrice,
      },
      {
        onSuccess: (data) => {
          if ((data as unknown as { error?: string }).error) {
            showToast((data as unknown as { error: string }).error, 'error')
            return
          }
          window.location.href = data.checkoutUrl
        },
        onError: (err: Error) => {
          showToast(err.message || t('errors.failedToCreateClaw'), 'error')
        },
      }
    )
  }

  const selectedPlan = plans.find((p) => p.id === planId)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="flex max-h-[85vh] max-w-lg flex-col gap-0 p-0">
        <DialogHeader className="shrink-0 px-6 pb-4 pt-6">
          <DialogTitle>{t('createClaw.title')}</DialogTitle>
          <DialogDescription>{t('createClaw.description')}</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleCreate()
          }}
          className="flex-1 space-y-5 overflow-y-auto px-6 pb-6"
        >
          <div className="space-y-2">
            <Label>{t('createClaw.clawName')}</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('createClaw.clawNamePlaceholder')}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label>{t('createClaw.location')}</Label>
            <div className="grid grid-cols-2 gap-2">
              {locations.map((loc) => {
                const isSelected = location === loc.id
                const flag = locationFlags[loc.id] || ''
                return (
                  <label
                    key={loc.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg p-3 transition ${
                      isSelected
                        ? 'border border-[#ef5350]/50 bg-[#ef5350]/20'
                        : 'bg-muted hover:bg-muted/80 border border-transparent'
                    }`}
                  >
                    <input
                      type="radio"
                      name="location"
                      value={loc.id}
                      checked={isSelected}
                      onChange={(e) => setLocation(e.target.value)}
                      className="sr-only"
                    />
                    {flag && <span className="text-lg">{flag}</span>}
                    <div>
                      <p className="text-sm font-medium">
                        {loc.city}, {loc.country}
                      </p>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('createClaw.plan')}</Label>
            <div className="space-y-2">
              {plans.map((plan) => {
                const isSelected = planId === plan.id
                return (
                  <label
                    key={plan.id}
                    className={`flex cursor-pointer items-center justify-between rounded-lg p-3 transition ${
                      isSelected
                        ? 'border border-[#ef5350]/50 bg-[#ef5350]/20'
                        : 'bg-muted hover:bg-muted/80 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="plan"
                        value={plan.id}
                        checked={isSelected}
                        onChange={(e) => setPlanId(e.target.value)}
                        className="sr-only"
                      />
                      <div>
                        <p className="text-sm font-medium">{plan.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {plan.cpu} vCPU / {plan.memory} GB RAM / {plan.disk} GB SSD
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">
                      ${plan.priceMonthly.toFixed(2)}/mo
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
          >
            <CaretDown
              className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            />
            {t('createClaw.advancedOptions')}
          </button>

          {showAdvanced && (
            <div className="space-y-5 pt-2">
              <div className="space-y-2">
                <Label>{t('createClaw.rootPassword')}</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('createClaw.rootPasswordPlaceholder')}
                      className="pr-10 font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeSlash className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(password)
                      showToast(t('createClaw.passwordCopied'), 'success')
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setPassword(generatePassword())}
                  >
                    <ArrowClockwise className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs">
                  {t('createClaw.autoGeneratePasswordHint')}
                </p>
              </div>

              <div className="space-y-2">
                <Label>{t('createClaw.sshKeyOptional')}</Label>
                {sshKeys.length > 0 ? (
                  <div className="space-y-2">
                    <label
                      className={`flex cursor-pointer items-center rounded-lg p-3 transition ${
                        selectedSshKeyId === ''
                          ? 'border border-[#ef5350]/50 bg-[#ef5350]/20'
                          : 'bg-muted hover:bg-muted/80 border border-transparent'
                      }`}
                    >
                      <input
                        type="radio"
                        name="sshKey"
                        value=""
                        checked={selectedSshKeyId === ''}
                        onChange={() => setSelectedSshKeyId('')}
                        className="sr-only"
                      />
                      <span className="text-sm">{t('createClaw.noSshKeyPasswordOnly')}</span>
                    </label>
                    {sshKeys.map((key) => (
                      <label
                        key={key.id}
                        className={`flex cursor-pointer items-center rounded-lg p-3 transition ${
                          selectedSshKeyId === key.id
                            ? 'border border-[#ef5350]/50 bg-[#ef5350]/20'
                            : 'bg-muted hover:bg-muted/80 border border-transparent'
                        }`}
                      >
                        <input
                          type="radio"
                          name="sshKey"
                          value={key.id}
                          checked={selectedSshKeyId === key.id}
                          onChange={() => setSelectedSshKeyId(key.id)}
                          className="sr-only"
                        />
                        <Key className="text-muted-foreground mr-3 h-4 w-4" />
                        <div>
                          <p className="text-sm font-medium">{key.name}</p>
                          <p className="text-muted-foreground font-mono text-xs">
                            {key.fingerprint}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted flex items-center gap-3 rounded-lg p-3">
                    <div className="bg-background flex h-10 w-10 items-center justify-center rounded-full">
                      <Key className="text-muted-foreground h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{t('createClaw.noSshKeysConfigured')}</p>
                      <p className="text-muted-foreground text-xs">
                        {t('createClaw.addSshKeyForPasswordlessLogin')}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={onNavigateToSSHKeys}
                    >
                      {t('common.addKey')}
                    </Button>
                  </div>
                )}
              </div>

              {volumePricing && (
                <div className="space-y-2">
                  <Label>{t('createClaw.additionalStorageOptional')}</Label>
                  <div className={`bg-muted space-y-4 rounded-lg p-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ClawMascot className="h-4 w-4" />
                        <span className="text-sm font-medium">{t('createClaw.volumeStorage')}</span>
                      </div>
                      <span className="text-sm font-semibold">
                        {volumeSize > 0
                          ? `+$${(volumeSize * volumePricing.pricePerGbMonthly).toFixed(2)}/mo`
                          : t('common.none')}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <Slider
                        value={[volumeSize]}
                        onValueChange={(value) => setVolumeSize(value[0])}
                        min={0}
                        max={500}
                        step={10}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-xs">0 GB</span>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            max={volumePricing.maxSize}
                            value={volumeSize}
                            onChange={(e) => {
                              const val = Math.min(
                                Math.max(0, Number(e.target.value)),
                                volumePricing.maxSize
                              )
                              setVolumeSize(val)
                            }}
                            className="h-8 w-20 text-center text-sm"
                          />
                          <span className="text-muted-foreground text-sm">GB</span>
                        </div>
                        <span className="text-muted-foreground text-xs">500 GB</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedPlan && (
            <div className="bg-muted rounded-lg p-4 space-y-2">
              {name && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('createClaw.clawName')}</span>
                  <span>{name}</span>
                </div>
              )}
              {location && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('createClaw.location')}</span>
                  <span>{locations.find((l) => l.id === location)?.city || location}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{selectedPlan.name}</span>
                <span>${selectedPlan.priceMonthly.toFixed(2)}/mo</span>
              </div>
              {volumeSize > 0 && volumePricing && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('createClaw.storageWithSize')} ({volumeSize} GB)</span>
                  <span>+${(volumeSize * volumePricing.pricePerGbMonthly).toFixed(2)}/mo</span>
                </div>
              )}
              <div className="border-border flex justify-between border-t pt-2 text-sm">
                <span className="text-muted-foreground">{t('createClaw.totalMonthly')}</span>
                <span className="font-semibold">
                  $
                  {(
                    selectedPlan.priceMonthly +
                    (volumeSize > 0 && volumePricing
                      ? volumeSize * volumePricing.pricePerGbMonthly
                      : 0)
                  ).toFixed(2)}/mo
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={purchaseMutation.isPending}>
              {purchaseMutation.isPending ? (
                <>
                  <CircleNotch className="h-4 w-4 animate-spin" />
                  {t('createClaw.redirecting')}
                </>
              ) : (
                t('createClaw.proceedToPayment', {
                  amount: (
                    (selectedPlan?.priceMonthly ?? 0) +
                    (volumeSize > 0 && volumePricing
                      ? volumeSize * volumePricing.pricePerGbMonthly
                      : 0)
                  ).toFixed(2)
                })
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const Dashboard: FC = (): ReactNode => {
  const { loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showCreate, setShowCreate] = useState(false)
  const [preselectedPlanId, setPreselectedPlanId] = useState<string | null>(null)
  const { instancesViewMode, setInstancesViewMode } = usePreferencesStore()

  useEffect(() => {
    const planParam = searchParams.get('plan')
    if (planParam) {
      setPreselectedPlanId(planParam)
      setShowCreate(true)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const { data: claws, isLoading, isError, refetch } = useClaws()
  const { data: userStats, isLoading: isStatsLoading } = useUserStats()
  const skeletonCount = userStats?.clawCount ?? 0
  const knowsCount = !isStatsLoading && userStats !== undefined

  const { data: plans } = usePlans()
  const { data: locations } = useLocations()
  const { data: sshKeys } = useSSHKeys()
  const { data: volumePricing } = useVolumePricing()

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0a0a0f] text-white">
      <PageTitle title={t('dashboard.title')} description={t('dashboard.description')} />
      <PageBackground />
      <Header />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative mx-auto w-full max-w-6xl flex-1 px-6 py-8"
      >
        {authLoading || !claws ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <CircleNotch className="text-primary h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <PageHeader
              title={t('dashboard.title')}
              description={`${claws?.length ?? 0} ${claws?.length === 1 ? t('dashboard.claw') : t('dashboard.clawsPlural')}`}
              action={
                !isLoading && claws?.length === 0 ? undefined : (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-lg border border-white/10 p-0.5">
                      <button
                        onClick={() => setInstancesViewMode('list')}
                        className={`rounded-md p-1.5 transition-colors ${
                          instancesViewMode === 'list'
                            ? 'bg-white/10 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <List className="h-4 w-4" weight="bold" />
                      </button>
                      <button
                        onClick={() => setInstancesViewMode('grid')}
                        className={`rounded-md p-1.5 transition-colors ${
                          instancesViewMode === 'grid'
                            ? 'bg-white/10 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <SquaresFour className="h-4 w-4" weight="bold" />
                      </button>
                    </div>
                    <ActionButton
                      onClick={() => setShowCreate(true)}
                      icon={<Lightning className="h-5 w-5" weight="fill" />}
                      label={t('createClaw.title')}
                    />
                  </div>
                )
              }
            />

            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              {isError ? (
                <ErrorState
                  title={t('errors.failedToLoadClaws')}
                  description={t('errors.failedToLoadClawsDescription')}
                  onRetry={() => refetch()}
                />
              ) : isLoading && knowsCount && skeletonCount === 0 ? (
                <EmptyState
                  icon={<ClawMascot className="h-10 w-10" />}
                  title={t('dashboard.noClawsYet')}
                  description={t('dashboard.noClawsDescription')}
                  actionLabel={t('nav.deployOpenClaw')}
                  onAction={() => setShowCreate(true)}
                />
              ) : isLoading && skeletonCount > 0 ? (
                <div className="space-y-1.5">
                  {Array.from({ length: skeletonCount }).map((_, i) => (
                    <ClawSkeleton key={i} />
                  ))}
                </div>
              ) : claws?.length === 0 ? (
                <EmptyState
                  icon={<ClawMascot className="h-10 w-10" />}
                  title={t('dashboard.noClawsYet')}
                  description={t('dashboard.noClawsDescription')}
                  actionLabel={t('nav.deployOpenClaw')}
                  onAction={() => setShowCreate(true)}
                />
              ) : (
                <div
                  className={
                    instancesViewMode === 'grid' ? 'grid grid-cols-1 gap-1.5 md:grid-cols-2' : 'space-y-1.5'
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

            {showCreate && plans && locations && (
              <CreateClawModal
                plans={plans}
                locations={locations}
                sshKeys={sshKeys || []}
                volumePricing={volumePricing}
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
