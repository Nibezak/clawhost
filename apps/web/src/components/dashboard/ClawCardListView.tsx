import type { FC, ReactNode } from 'react'
import type { ClawCardListViewProps } from '@/ts/Interfaces'
import { t } from '@openclaw/i18n'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { CaretDown, ClockCountdown } from '@phosphor-icons/react'
import { ClawMascot } from '@/components/ClawMascot'
import { ClawCardDropdownMenu } from '@/components/dashboard/ClawCardDropdownMenu'
import { CopyableField } from '@/components/dashboard/CopyableField'
import { generateSlug } from '@/lib/claw-utils'

const ClawCardListView: FC<ClawCardListViewProps> = ({
  claw,
  status,
  flag,
  locationName,
  plan,
  monthlyPrice,
  attachedSshKey,
  actions,
  isLoading,
  copied,
  passwordCopied,
  hasActionItems,
  isScheduledForDeletion,
  isExpanded,
  onToggleExpand,
}): ReactNode => {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-xl">
              <ClawMascot className="h-6 w-6" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold">{claw.name}</h3>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${status.bgColor}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${status.color} mr-1.5 ${status.pulse ? 'animate-pulse' : ''} ${claw.status === 'running' ? 'animate-pulse shadow-[0_0_4px_2px_rgba(34,197,94,0.5)]' : ''}`}
                  />
                  {status.label}
                </span>
                {isScheduledForDeletion && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex cursor-default items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-xs font-medium text-gray-400">
                        <ClockCountdown className="h-3 w-3" />
                        {t('dashboard.scheduledDeletionShort', {
                          date: new Date(claw.deletionScheduledAt!).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          }),
                        })}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('dashboard.deletionTooltip', {
                        date: new Date(claw.deletionScheduledAt!).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }),
                      })}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
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
              onClick={onToggleExpand}
              className="shrink-0"
            >
              <CaretDown
                className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </Button>

            <ClawCardDropdownMenu
              claw={claw}
              actions={actions}
              isLoading={isLoading}
              copied={copied}
              passwordCopied={passwordCopied}
              hasActionItems={hasActionItems}
              isScheduledForDeletion={isScheduledForDeletion}
            />
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

            {isScheduledForDeletion && (
              <div className="mt-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center gap-2">
                  <ClockCountdown className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-300">
                      {t('dashboard.scheduledForDeletion')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('dashboard.deletionDate', {
                        date: new Date(claw.deletionScheduledAt!).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }),
                      })}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={actions.onCancelDeletion}
                  disabled={isLoading}
                >
                  {t('dashboard.cancelDeletion')}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

export { ClawCardListView }
