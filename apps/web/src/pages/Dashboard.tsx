import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api, Instance, Plan, Location, SSHKey, VolumePricing } from '../lib/api'
import { useUIStore, usePreferencesStore, type ViewMode } from '@/lib/store'
import { ROUTES } from '@/lib/routes'
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
  PlusCircle,
  HardDrive,
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
  Desktop,
  CaretDown,
} from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'

// Generate a secure random password
function generatePassword(length = 16): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => chars[byte % chars.length]).join('')
}

// Generate a readable slug from instance ID (deterministic, 7 chars)
function generateSlug(id: string): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789' // Removed confusing chars: i, l, o, 0, 1
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i)
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

export default function Dashboard() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showCreate, setShowCreate] = useState(false)
  const [preselectedPlanId, setPreselectedPlanId] = useState<string | null>(null)
  const { instancesViewMode, setInstancesViewMode } = usePreferencesStore()

  // Check for plan param in URL and open modal if present
  useEffect(() => {
    const planParam = searchParams.get('plan')
    if (planParam) {
      setPreselectedPlanId(planParam)
      setShowCreate(true)
      // Clear the param from URL
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const queryClient = useQueryClient()

  // Check if any instances are in transitional states (need syncing)
  const cachedInstances = queryClient.getQueryData<Instance[]>(['instances'])
  const hasTransitionalInstances = cachedInstances?.some(
    (i) => ['initializing', 'starting', 'stopping', 'creating', 'migrating', 'rebuilding'].includes(i.status)
  )

  const {
    data: instances,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['instances'],
    // Sync with Hetzner when there are transitional instances
    queryFn: () => api.getInstances(hasTransitionalInstances),
    placeholderData: (previousData) => previousData,
    // Poll every 5 seconds when instances are in transitional states
    refetchInterval: hasTransitionalInstances ? 5000 : false,
  })
  const skeletonCount = cachedInstances !== undefined ? cachedInstances.length : 3

  const { data: plans } = useQuery({
    queryKey: ['plans'],
    queryFn: api.getPlans,
  })

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: api.getLocations,
  })

  const { data: sshKeys } = useQuery({
    queryKey: ['sshKeys'],
    queryFn: api.getSSHKeys,
  })

  const { data: volumePricing } = useQuery({
    queryKey: ['volumePricing'],
    queryFn: api.getVolumePricing,
  })

  return (
<div className="relative min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <PageTitle title="Claws" />
      <PageBackground />
      <Header />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative flex-1 max-w-6xl mx-auto px-6 py-8 w-full"
      >
        {/* Title + Create button */}
        <PageHeader
          title="Your Claws"
          description={`${instances?.length ?? 0} ${instances?.length === 1 ? 'claw' : 'claws'}`}
          action={
            <div className="flex items-center gap-2">
              {/* View mode toggle */}
              <div className="flex items-center rounded-lg border border-white/10 p-0.5">
                <button
                  onClick={() => setInstancesViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${
                    instancesViewMode === 'list'
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" weight="bold" />
                </button>
                <button
                  onClick={() => setInstancesViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${
                    instancesViewMode === 'grid'
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <SquaresFour className="w-4 h-4" weight="bold" />
                </button>
              </div>
              <Button onClick={() => setShowCreate(true)}>
                <PlusCircle className="w-5 h-5" weight="bold" />
                New Claw
              </Button>
            </div>
          }
        />

        {/* Claws container */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          {isError ? (
            <ErrorState
              title="Failed to load claws"
              description="We couldn't load your Claws. Please check your connection and try again."
              onRetry={() => refetch()}
            />
          ) : isLoading && skeletonCount === 0 ? (
            <EmptyState
              icon={<HardDrive className="w-10 h-10 text-primary" />}
              title="No Claws yet"
              description="Deploy OpenClaw on your first VPS and start browsing securely"
              actionLabel="Deploy OpenClaw"
              onAction={() => setShowCreate(true)}
            />
          ) : isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: skeletonCount }).map((_, i) => (
                <InstanceSkeleton key={i} />
              ))}
            </div>
          ) : instances?.length === 0 ? (
<EmptyState
              icon={<HardDrive className="w-10 h-10 text-primary" />}
              title="No Claws yet"
              description="Deploy OpenClaw on your first VPS and start browsing securely"
              actionLabel="Deploy OpenClaw"
              onAction={() => setShowCreate(true)}
            />
          ) : (
            <div className={instancesViewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
              {instances?.map((instance) => (
                <InstanceCard key={instance.id} instance={instance} sshKeys={sshKeys || []} plans={plans || []} viewMode={instancesViewMode} />
              ))}
            </div>
          )}
        </div>

        {/* Create modal */}
        {showCreate && plans && locations && (
          <CreateInstanceModal
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
      </motion.main>

      <LandingFooter />
    </div>
  )
}

// Location to country flag emoji mapping
const locationFlags: Record<string, string> = {
  'ash': '🇺🇸', // Ashburn, USA
  'hil': '🇺🇸', // Hillsboro, USA
  'fsn1': '🇩🇪', // Falkenstein, Germany
  'nbg1': '🇩🇪', // Nuremberg, Germany
  'hel1': '🇫🇮', // Helsinki, Finland
  'sin': '🇸🇬', // Singapore
  // Additional Hetzner locations
  'fsn1-dc14': '🇩🇪',
  'nbg1-dc3': '🇩🇪',
  'hel1-dc2': '🇫🇮',
  'ash-dc1': '🇺🇸',
  'hil-dc1': '🇺🇸',
}

// Location to full name mapping
const locationNames: Record<string, string> = {
  'ash': 'Ashburn, USA',
  'hil': 'Hillsboro, USA',
  'fsn1': 'Falkenstein, Germany',
  'nbg1': 'Nuremberg, Germany',
  'hel1': 'Helsinki, Finland',
  'sin': 'Singapore',
  'fsn1-dc14': 'Falkenstein, Germany',
  'nbg1-dc3': 'Nuremberg, Germany',
  'hel1-dc2': 'Helsinki, Finland',
  'ash-dc1': 'Ashburn, USA',
  'hil-dc1': 'Hillsboro, USA',
}

// Status colors and labels (matches Hetzner statuses)
const statusConfig: Record<string, { color: string; bgColor: string; label: string; pulse?: boolean }> = {
  running: { color: 'bg-green-500', bgColor: 'bg-green-500/10', label: 'Running' },
  stopped: { color: 'bg-gray-400', bgColor: 'bg-gray-400/10', label: 'Stopped' },
  off: { color: 'bg-gray-400', bgColor: 'bg-gray-400/10', label: 'Off' },
  starting: { color: 'bg-yellow-500', bgColor: 'bg-yellow-500/10', label: 'Starting...', pulse: true },
  stopping: { color: 'bg-yellow-500', bgColor: 'bg-yellow-500/10', label: 'Stopping...', pulse: true },
  creating: { color: 'bg-blue-500', bgColor: 'bg-blue-500/10', label: 'Creating...', pulse: true },
  initializing: { color: 'bg-blue-500', bgColor: 'bg-blue-500/10', label: 'Setting up...', pulse: true },
  migrating: { color: 'bg-purple-500', bgColor: 'bg-purple-500/10', label: 'Migrating...', pulse: true },
  rebuilding: { color: 'bg-orange-500', bgColor: 'bg-orange-500/10', label: 'Rebuilding...', pulse: true },
  deleting: { color: 'bg-red-500', bgColor: 'bg-red-500/10', label: 'Deleting...', pulse: true },
  unknown: { color: 'bg-gray-400', bgColor: 'bg-gray-400/10', label: 'Unknown' },
}

function InstanceSkeleton() {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
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

function InstanceCard({ instance, sshKeys, plans, viewMode = 'list' }: { instance: Instance; sshKeys: SSHKey[]; plans: Plan[]; viewMode?: ViewMode }) {
  const queryClient = useQueryClient()
  const { showToast } = useUIStore()
  const [copied, setCopied] = useState(false)
  const [passwordCopied, setPasswordCopied] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const startMutation = useMutation({
    mutationFn: () => api.startInstance(instance.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['instances'] }),
  })

  const stopMutation = useMutation({
    mutationFn: () => api.stopInstance(instance.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['instances'] }),
  })

  const restartMutation = useMutation({
    mutationFn: () => api.restartInstance(instance.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['instances'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteInstance(instance.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['instances'] }),
  })

  const isLoading =
    startMutation.isPending ||
    stopMutation.isPending ||
    restartMutation.isPending ||
    deleteMutation.isPending

  const attachedSshKey = instance.sshKeyId
    ? sshKeys.find((k) => k.id === instance.sshKeyId)
    : null

  const status = statusConfig[instance.status] || statusConfig.stopped

  const copySSHWithKey = () => {
    const command = `ssh root@${instance.ip}`
    navigator.clipboard.writeText(command)
    setCopied(true)
    showToast('SSH command copied!', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  const copySSHWithPassword = () => {
    const command = `sshpass -p '${instance.rootPassword}' ssh -o StrictHostKeyChecking=no root@${instance.ip}`
    navigator.clipboard.writeText(command)
    setCopied(true)
    showToast('SSH command with password copied!', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  const hasBothOptions = attachedSshKey && instance.rootPassword

  const copyPassword = () => {
    if (!instance.rootPassword) {
      showToast('No password available for this instance.', 'warning')
      return
    }
    navigator.clipboard.writeText(instance.rootPassword)
    setPasswordCopied(true)
    showToast('Password copied to clipboard!', 'success')
    setTimeout(() => setPasswordCopied(false), 2000)
  }

  const copyField = (label: string, value: string) => {
    navigator.clipboard.writeText(value)
    setCopiedField(label)
    showToast(`${label} copied!`, 'success')
    setTimeout(() => setCopiedField(null), 2000)
  }

  const plan = plans.find(p => p.id === instance.planId)
  const monthlyPrice = plan ? plan.priceMonthly + 20 : null // +20 for OpenClaw fee
  const locationName = instance.location ? locationNames[instance.location] || instance.location : 'Unknown'
  const flag = instance.location ? locationFlags[instance.location] : null

  if (viewMode === 'grid') {
    return (
      <Card>
        <CardContent className="py-4">
          {/* Header with flag and actions */}
          <div className="flex items-start justify-between mb-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl">
                {flag || <Desktop className="w-5 h-5 text-muted-foreground" />}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${status.color} ${status.pulse ? 'animate-pulse' : ''}`} />
            </div>
            {deleteMutation.isPending ? (
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                <CircleNotch className="w-4 h-4 animate-spin" />
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <DotsThreeOutline className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {(instance.status === 'stopped' || instance.status === 'off') && (
                    <DropdownMenuItem onClick={() => startMutation.mutate()} disabled={isLoading}>
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </DropdownMenuItem>
                  )}
                  {instance.status === 'running' && (
                    <>
                      <DropdownMenuItem onClick={() => stopMutation.mutate()} disabled={isLoading}>
                        <Square className="w-4 h-4 mr-2" />
                        Stop
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => restartMutation.mutate()} disabled={isLoading}>
                        <ArrowClockwise className="w-4 h-4 mr-2" />
                        Restart
                      </DropdownMenuItem>
                    </>
                  )}
                  {instance.rootPassword && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={copyPassword}>
                        {passwordCopied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Password
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
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Instance name and status */}
          <div className="mb-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base truncate">{instance.name}</h3>
              {instance.hetznerServerId && (
                <span className="text-xs text-muted-foreground font-mono">#{instance.hetznerServerId}</span>
              )}
            </div>
            <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${status.bgColor}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.color} mr-1.5 ${status.pulse ? 'animate-pulse' : ''}`} />
              {status.label}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-1 text-sm text-muted-foreground mb-3">
            <div className="flex items-center justify-between">
              <span>Plan</span>
              <span className="text-foreground">{instance.planId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Location</span>
              <span className="text-foreground">{instance.location || 'Unknown'}</span>
            </div>
            {instance.ip && (
              <div className="flex items-center justify-between">
                <span>IP</span>
                <span className="text-foreground font-mono text-xs">{instance.ip}</span>
              </div>
            )}
          </div>

          {/* Connect button */}
          {instance.status === 'running' && instance.ip && (
            hasBothOptions ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Terminal className="w-4 h-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem onClick={copySSHWithKey}>
                    <Key className="w-4 h-4 mr-2" />
                    Copy SSH (with key)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={copySSHWithPassword}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy SSH (with password)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={instance.rootPassword ? copySSHWithPassword : copySSHWithKey}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Terminal className="w-4 h-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
            )
          )}
        </CardContent>

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Claw</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>{instance.name}</strong>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 justify-end mt-4">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteMutation.mutate()
                  setShowDeleteModal(false)
                }}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <CircleNotch className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    )
  }

  // Copyable field component for expanded section
  const CopyableField = ({ label, value }: { label: string; value: string }) => (
    <div
      onClick={() => copyField(label, value)}
      className="group flex items-center justify-between gap-2 bg-background rounded-lg px-3 py-2 cursor-pointer hover:bg-background/80 transition-colors"
    >
      <div className="min-w-0">
        <span className="text-xs text-muted-foreground block">{label}</span>
        <span className="text-sm font-mono truncate block">{value}</span>
      </div>
      <div className="shrink-0">
        {copiedField === label ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </div>
  )

  return (
    <Card>
      <CardContent className="py-4">
        {/* Main row - always visible */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Server icon + Status indicator */}
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <Desktop className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${status.color} ${status.pulse ? 'animate-pulse' : ''}`} />
            </div>

            {/* Instance name + status */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-base">{instance.name}</h3>
                <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${status.bgColor}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.color} mr-1.5 ${status.pulse ? 'animate-pulse' : ''}`} />
                  {status.label}
                </span>
              </div>
              <a
                href={`https://${instance.subdomain || generateSlug(instance.id)}.clawhost.cloud`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground text-sm hover:text-foreground transition-colors"
              >
                {instance.subdomain || generateSlug(instance.id)}.clawhost.cloud
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Expand/collapse toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="shrink-0"
            >
              <CaretDown className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>

            {/* Actions menu */}
            {deleteMutation.isPending ? (
              <Button variant="ghost" size="icon" disabled>
                <CircleNotch className="w-5 h-5 animate-spin" />
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <DotsThreeOutline className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {(instance.status === 'stopped' || instance.status === 'off') && (
                    <DropdownMenuItem
                      onClick={() => startMutation.mutate()}
                      disabled={isLoading}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </DropdownMenuItem>
                  )}
                  {instance.status === 'running' && (
                    <>
                      <DropdownMenuItem
                        onClick={() => stopMutation.mutate()}
                        disabled={isLoading}
                      >
                        <Square className="w-4 h-4 mr-2" />
                        Stop
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => restartMutation.mutate()}
                        disabled={isLoading}
                      >
                        <ArrowClockwise className="w-4 h-4 mr-2" />
                        Restart
                      </DropdownMenuItem>
                    </>
                  )}
                  {instance.status === 'running' && instance.ip && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={instance.rootPassword ? copySSHWithPassword : copySSHWithKey}>
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Terminal className="w-4 h-4 mr-2" />
                            Connect
                          </>
                        )}
                      </DropdownMenuItem>
                    </>
                  )}
                  {instance.rootPassword && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={copyPassword}>
                        {passwordCopied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Password
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
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Expanded details section */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 pt-4 border-t border-border"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Domain */}
              <CopyableField label="Domain" value={`${instance.subdomain || generateSlug(instance.id)}.clawhost.cloud`} />

              {/* IP Address */}
              {instance.ip && (
                <CopyableField label="IP Address" value={instance.ip} />
              )}

              {/* Location */}
              <CopyableField label="Location" value={`${flag || ''} ${locationName}`.trim()} />

              {/* Plan */}
              <CopyableField label="Plan" value={plan ? `${plan.name} (${plan.cpu} vCPU, ${plan.memory}GB RAM, ${plan.disk}GB SSD)` : instance.planId} />

              {/* Monthly Cost */}
              {monthlyPrice && (
                <CopyableField label="Monthly Cost" value={`$${monthlyPrice.toFixed(0)}/mo`} />
              )}

              {/* Server ID */}
              {instance.hetznerServerId && (
                <CopyableField label="Server ID" value={`#${instance.hetznerServerId}`} />
              )}

              {/* Created At */}
              {instance.createdAt && (
                <CopyableField label="Created" value={new Date(instance.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} />
              )}

              {/* SSH Key */}
              {attachedSshKey && (
                <CopyableField label="SSH Key" value={attachedSshKey.name} />
              )}

              {/* Storage */}
              {instance.volumes && instance.volumes.length > 0 && (
                <CopyableField label="Storage" value={`${instance.volumes.reduce((sum, v) => sum + v.size, 0)} GB`} />
              )}
            </div>
          </motion.div>
        )}
      </CardContent>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Claw</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{instance.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteMutation.mutate()
                setShowDeleteModal(false)
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <CircleNotch className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

function CreateInstanceModal({
  plans,
  locations,
  sshKeys,
  volumePricing,
  preselectedPlanId,
  onClose,
  onNavigateToSSHKeys,
}: {
  plans: Plan[]
  locations: Location[]
  sshKeys: SSHKey[]
  volumePricing?: VolumePricing
  preselectedPlanId?: string | null
  onClose: () => void
  onNavigateToSSHKeys: () => void
}) {
  const [name, setName] = useState('')
  // Use preselected plan if provided and valid, otherwise fall back to first plan
  const initialPlanId = preselectedPlanId && plans.find(p => p.id === preselectedPlanId)
    ? preselectedPlanId
    : (plans[0]?.id || '')
  const [planId, setPlanId] = useState(initialPlanId)
  const [location, setLocation] = useState(locations[0]?.id || '')
  const [password, setPassword] = useState(generatePassword())
  const [showPassword, setShowPassword] = useState(false)
  const [selectedSshKeyId, setSelectedSshKeyId] = useState<string>('')
  const [volumeSize, setVolumeSize] = useState<number>(0) // 0 means no volume
  const [createdInstance, setCreatedInstance] = useState<Instance | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const queryClient = useQueryClient()
  const { showToast } = useUIStore()

  const createMutation = useMutation({
    mutationFn: () => api.createInstance({
      name,
      planId,
      location,
      password: password || undefined,
      sshKeyId: selectedSshKeyId || undefined,
      volumeSize: volumeSize > 0 ? volumeSize : undefined,
    }),
    onSuccess: (data: Instance) => {
      if ((data as any).error) {
        showToast((data as any).error, 'error')
        return
      }
      setCreatedInstance(data)
      queryClient.invalidateQueries({ queryKey: ['instances'] })
    },
    onError: (err: Error) => {
      showToast(err.message || 'Failed to create instance.', 'error')
    },
  })

  const selectedPlan = plans.find((p) => p.id === planId)
  const selectedSshKey = sshKeys.find((k) => k.id === selectedSshKeyId)

  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopyField = (label: string, value: string) => {
    navigator.clipboard.writeText(value)
    setCopiedField(label)
    showToast(`${label} copied!`, 'success')
    setTimeout(() => setCopiedField(null), 2000)
  }

  if (createdInstance) {
    const sshCommand = selectedSshKey
      ? `ssh root@${createdInstance.ip || '...'}`
      : `sshpass -p '${createdInstance.rootPassword}' ssh -o StrictHostKeyChecking=no root@${createdInstance.ip || '...'}`

    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <DialogTitle className="text-center">Claw Created!</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 bg-muted rounded-xl p-4">
            {/* IP Address */}
            <div>
              <span className="text-muted-foreground text-sm">IP Address</span>
              <div
                onClick={() => handleCopyField('IP Address', createdInstance.ip || '')}
                className="group relative flex items-center justify-between gap-2 bg-background rounded-lg p-3 mt-1 cursor-pointer hover:bg-background/80 transition-colors"
              >
                <p className="font-mono text-sm break-all pr-8">{createdInstance.ip || 'Assigning...'}</p>
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {copiedField === 'IP Address' ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>
            </div>

            {selectedSshKey && (
              <div>
                <span className="text-muted-foreground text-sm">SSH Key</span>
                <div className="flex items-center gap-2 bg-background rounded-lg p-3 mt-1">
                  <Key className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedSshKey.name}</span>
                </div>
              </div>
            )}

            {createdInstance.rootPassword && (
              <div>
                <span className="text-muted-foreground text-sm">Root Password (save this!)</span>
                <div
                  onClick={() => handleCopyField('Password', createdInstance.rootPassword!)}
                  className="group relative flex items-center justify-between gap-2 bg-background rounded-lg p-3 mt-1 cursor-pointer hover:bg-background/80 transition-colors"
                >
                  <p className="font-mono text-sm break-all pr-8">{createdInstance.rootPassword}</p>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {copiedField === 'Password' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SSH Command */}
            <div>
              <span className="text-muted-foreground text-sm">
                SSH Command {selectedSshKey ? '(using your key)' : '(with password)'}
              </span>
              <div
                onClick={() => handleCopyField('SSH Command', sshCommand)}
                className="group relative flex items-center justify-between gap-2 bg-background rounded-lg p-3 mt-1 cursor-pointer hover:bg-background/80 transition-colors"
              >
                <p className="font-mono text-xs break-all pr-8">{sshCommand}</p>
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {copiedField === 'SSH Command' ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[70vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle>Create New Claw</DialogTitle>
          <DialogDescription>
            Deploy OpenClaw on your own VPS
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            createMutation.mutate()
          }}
          className="flex-1 overflow-y-auto px-6 pb-6 space-y-5"
        >
          {/* Claw Name */}
          <div className="space-y-2">
            <Label>Claw Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-server"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Location</Label>
            <div className="grid grid-cols-2 gap-2">
              {locations.map((loc) => {
                const isSelected = location === loc.id
                const flag = locationFlags[loc.id] || ''
                return (
                  <label
                    key={loc.id}
                    className={`flex items-center gap-2 p-3 cursor-pointer transition rounded-lg ${
                      isSelected
                        ? 'bg-[#ef5350]/20 border border-[#ef5350]/50'
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
                      <p className="font-medium text-sm">{loc.city}, {loc.country}</p>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Plan */}
          <div className="space-y-2">
            <Label>Plan</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {plans.map((plan) => {
                const isSelected = planId === plan.id
                return (
                  <label
                    key={plan.id}
                    className={`flex items-center justify-between p-3 cursor-pointer transition rounded-lg ${
                      isSelected
                        ? 'bg-[#ef5350]/20 border border-[#ef5350]/50'
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
                        <p className="font-medium text-sm">{plan.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {plan.cpu} vCPU / {plan.memory} GB RAM / {plan.disk} GB SSD
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-sm">${plan.priceMonthly.toFixed(2)}/mo</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <CaretDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            Advanced Options
          </button>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-5 pt-2">
              {/* Root Password */}
              <div className="space-y-2">
                <Label>Root Password</Label>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password or generate one"
                      className="pr-10 font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeSlash className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(password)
                      showToast('Password copied!', 'success')
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setPassword(generatePassword())}
                  >
                    <ArrowClockwise className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs">Leave empty to auto-generate a secure password</p>
              </div>

              {/* SSH Key */}
              <div className="space-y-2">
                <Label>SSH Key (Optional)</Label>
                {sshKeys.length > 0 ? (
                  <div className="space-y-2">
                    <label
                      className={`flex items-center p-3 cursor-pointer transition rounded-lg ${
                        selectedSshKeyId === ''
                          ? 'bg-[#ef5350]/20 border border-[#ef5350]/50'
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
                      <span className="text-sm">No SSH key (password only)</span>
                    </label>
                    {sshKeys.map((key) => (
                      <label
                        key={key.id}
                        className={`flex items-center p-3 cursor-pointer transition rounded-lg ${
                          selectedSshKeyId === key.id
                            ? 'bg-[#ef5350]/20 border border-[#ef5350]/50'
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
                        <Key className="w-4 h-4 mr-3 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{key.name}</p>
                          <p className="text-muted-foreground text-xs font-mono">{key.fingerprint}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center">
                      <Key className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">No SSH keys configured</p>
                      <p className="text-xs text-muted-foreground">
                        Add an SSH key for passwordless login
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={onNavigateToSSHKeys}
                    >
                      Add Key
                    </Button>
                  </div>
                )}
              </div>

              {/* Additional Storage */}
              {volumePricing && (
                <div className="space-y-2">
                  <Label>Additional Storage (Optional)</Label>
                  <div className={`p-4 rounded-lg bg-muted space-y-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-sm">Volume Storage</span>
                      </div>
                      <span className="text-sm font-semibold">
                        {volumeSize > 0 ? `+$${(volumeSize * volumePricing.pricePerGbMonthly).toFixed(2)}/mo` : 'None'}
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
                        <span className="text-xs text-muted-foreground">0 GB</span>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            max={volumePricing.maxSize}
                            value={volumeSize}
                            onChange={(e) => {
                              const val = Math.min(Math.max(0, Number(e.target.value)), volumePricing.maxSize)
                              setVolumeSize(val)
                            }}
                            className="w-20 text-center text-sm h-8"
                          />
                          <span className="text-sm text-muted-foreground">GB</span>
                        </div>
                        <span className="text-xs text-muted-foreground">500 GB</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Pricing Summary */}
          {selectedPlan && (
            <div className="bg-muted rounded-lg p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">VPS Server</span>
                <span>${selectedPlan.priceMonthly.toFixed(2)}/mo</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">OpenClaw Pre-installed</span>
                <span>+$20.00/mo</span>
              </div>
              {volumeSize > 0 && volumePricing && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Storage ({volumeSize} GB)</span>
                  <span>+${(volumeSize * volumePricing.pricePerGbMonthly).toFixed(2)}/mo</span>
                </div>
              )}
              <div className="border-t border-border mt-2 pt-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Total monthly</span>
                <span className="font-semibold">
                  ${(selectedPlan.priceMonthly + 20 + (volumeSize > 0 && volumePricing ? volumeSize * volumePricing.pricePerGbMonthly : 0)).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <>
                  <CircleNotch className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
