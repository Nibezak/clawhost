import type { FC, ReactNode } from 'react'
import type { ClawCardGridViewProps } from '@/ts/Interfaces'
import { t } from '@openclaw/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Terminal, Check, Key, Copy, ClockCountdown } from '@phosphor-icons/react'
import { ClawMascot } from '@/components/ClawMascot'
import { ClawCardDropdownMenu } from '@/components/dashboard/ClawCardDropdownMenu'

const ClawCardGridView: FC<ClawCardGridViewProps> = ({
  claw,
  status,
  flag,
  actions,
  isLoading,
  copied,
  passwordCopied,
  hasActionItems,
  hasBothOptions,
  isScheduledForDeletion,
}): ReactNode => {
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
          <ClawCardDropdownMenu
            claw={claw}
            actions={actions}
            isLoading={isLoading}
            copied={copied}
            passwordCopied={passwordCopied}
            hasActionItems={hasActionItems}
            isScheduledForDeletion={isScheduledForDeletion}
            compact
          />
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

        {isScheduledForDeletion && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="mb-3 inline-flex cursor-default items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-xs font-medium text-gray-400">
                <ClockCountdown className="h-3 w-3" />
                {t('dashboard.scheduledDeletionShort', {
                  date: new Date(claw.deletionScheduledAt!).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  }),
                })}
              </div>
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
                <DropdownMenuItem onClick={actions.onCopySSHWithKey}>
                  <Key className="mr-2 h-4 w-4" />
                  {t('dashboard.copySshWithKey')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={actions.onCopySSHWithPassword}>
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
              onClick={actions.onCopySSH}
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
    </Card>
  )
}

export { ClawCardGridView }
