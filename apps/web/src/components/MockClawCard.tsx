import type { FC, ReactNode } from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { t } from '@openclaw/i18n'
import { useUIStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Desktop,
  CaretDown,
  DotsThreeOutline,
  Play,
  Square,
  ArrowClockwise,
  Trash,
  Copy,
  Check,
  Terminal,
  CircleNotch,
} from '@phosphor-icons/react'

interface MockClawData {
  id: string
  name: string
  status: 'running' | 'stopped' | 'restarting'
  subdomain: string
  ip: string
  location: string
  locationFlag: string
  plan: string
  planDetails: string
}

interface MockClawCardProps {
  claw: MockClawData
  onStart?: (id: string) => void
  onStop?: (id: string) => void
  onRestart?: (id: string) => void
  onDelete?: (id: string) => void
}

const MockClawCard: FC<MockClawCardProps> = ({ claw, onStart, onStop, onRestart, onDelete }): ReactNode => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const { showToast } = useUIStore()

  const statusConfig = {
    running: { color: 'bg-green-500', bgColor: 'bg-green-500/10', label: t('dashboard.status.running'), pulse: false },
    stopped: { color: 'bg-gray-400', bgColor: 'bg-gray-400/10', label: t('dashboard.status.stopped'), pulse: false },
    restarting: { color: 'bg-yellow-500', bgColor: 'bg-yellow-500/10', label: 'Restarting', pulse: true },
  }

  const status = statusConfig[claw.status]

  const copyField = (label: string, value: string) => {
    navigator.clipboard.writeText(value)
    setCopiedField(label)
    showToast(t('common.copiedWithLabel', { label }), 'success')
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleConnect = () => {
    navigator.clipboard.writeText(`ssh root@${claw.ip}`)
    showToast('SSH command copied!', 'success')
  }

  const handleCopyPassword = () => {
    navigator.clipboard.writeText('Cl@wH0st2024!')
    showToast('Password copied!', 'success')
  }

  const CopyableField: FC<{ label: string; value: string }> = ({ label, value }): ReactNode => (
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
        {/* Main row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Server icon + Status indicator */}
            <div className="relative">
              <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-xl">
                <Desktop className="text-muted-foreground h-6 w-6" />
              </div>
              <div
                className={`border-background absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 ${status.color} ${status.pulse ? 'animate-pulse' : ''}`}
              />
            </div>

            {/* Claw name + status */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold">{claw.name}</h3>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${status.bgColor}`}
                >
                  {status.pulse && <CircleNotch className="mr-1.5 h-3 w-3 animate-spin" />}
                  {!status.pulse && <span className={`h-1.5 w-1.5 rounded-full ${status.color} mr-1.5`} />}
                  {status.label}
                </span>
              </div>
              <span className="text-muted-foreground text-sm">
                {claw.subdomain}.clawhost.cloud
              </span>
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
              <CaretDown
                className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </Button>

            {/* Actions menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={claw.status === 'restarting'}>
                  {claw.status === 'restarting' ? (
                    <CircleNotch className="h-5 w-5 animate-spin" />
                  ) : (
                    <DotsThreeOutline className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {claw.status === 'stopped' ? (
                  <DropdownMenuItem onClick={() => onStart?.(claw.id)}>
                    <Play className="mr-2 h-4 w-4" />
                    {t('dashboard.start')}
                  </DropdownMenuItem>
                ) : claw.status === 'running' ? (
                  <>
                    <DropdownMenuItem onClick={() => onStop?.(claw.id)}>
                      <Square className="mr-2 h-4 w-4" />
                      {t('dashboard.stop')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onRestart?.(claw.id)}>
                      <ArrowClockwise className="mr-2 h-4 w-4" />
                      {t('dashboard.restart')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleConnect}>
                      <Terminal className="mr-2 h-4 w-4" />
                      {t('dashboard.connect')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleCopyPassword}>
                      <Copy className="mr-2 h-4 w-4" />
                      {t('dashboard.copyPassword')}
                    </DropdownMenuItem>
                  </>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete?.(claw.id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  {t('common.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Expanded details section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-border mt-4 grid grid-cols-2 gap-3 border-t pt-4 md:grid-cols-4">
                <CopyableField label={t('dashboard.domain')} value={`${claw.subdomain}.clawhost.cloud`} />
                <CopyableField label={t('dashboard.ipAddress')} value={claw.ip} />
                <CopyableField label={t('dashboard.location')} value={`${claw.locationFlag} ${claw.location}`} />
                <CopyableField label={t('dashboard.plan')} value={`${claw.plan} (${claw.planDetails})`} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

export { MockClawCard }
export type { MockClawData }
