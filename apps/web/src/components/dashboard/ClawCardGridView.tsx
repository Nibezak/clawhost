import type { FC, ReactNode } from 'react'
import type { ClawCardGridViewProps, Volume } from '@/ts/Interfaces'

import { t } from '@openclaw/i18n'
import { Card, CardContent } from '@/components/ui/card'
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent
} from '@/components/ui/tooltip'
import ClawAvatar from '@/components/ClawAvatar'
import ProviderIcon from '@/components/ProviderIcon'
import ClawCardDropdownMenu from '@/components/dashboard/ClawCardDropdownMenu'
import CopyableField from '@/components/dashboard/CopyableField'
import ScheduledDeletionBanner from '@/components/dashboard/ScheduledDeletionBanner'
import getBaseDomain from '@/lib/getBaseDomain'
import { generateSlug, aiModels } from '@/lib/claw-utils'

const ClawCardGridView: FC<ClawCardGridViewProps> = ({
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
    isAdmin
}): ReactNode => {
    return (
        <Card>
            <CardContent className='py-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <ClawAvatar />

                        <div className='min-w-0'>
                            <div className='flex flex-wrap items-center gap-2'>
                                <h3 className='truncate text-base font-semibold'>
                                    {claw.name}
                                </h3>
                                {claw.status === 'configuring' ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span
                                                className={`inline-flex cursor-default items-center rounded-full px-2 py-0.5 text-xs font-medium ${status.bgColor}`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${status.color} mr-1.5 ${status.pulse ? 'animate-pulse' : ''}`}
                                                />
                                                {status.label}
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                {t(
                                                    'dashboard.configuringTooltip'
                                                )}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${status.bgColor}`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${status.color} mr-1.5 ${status.pulse ? 'animate-pulse' : ''} ${claw.status === 'running' ? 'animate-pulse shadow-[0_0_4px_2px_rgba(34,197,94,0.5)]' : ''}`}
                                        />
                                        {status.label}
                                    </span>
                                )}
                            </div>
                            {claw.status !== 'configuring' && (
                                <a
                                    href={`https://${claw.subdomain || generateSlug(claw.id)}.${getBaseDomain()}${claw.gatewayToken ? `/?token=${claw.gatewayToken}` : ''}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                                >
                                    {claw.subdomain || generateSlug(claw.id)}.
                                    {getBaseDomain()}
                                </a>
                            )}
                        </div>
                    </div>

                    <ClawCardDropdownMenu
                        claw={claw}
                        actions={actions}
                        isLoading={isLoading}
                        copied={copied}
                        passwordCopied={passwordCopied}
                        hasActionItems={hasActionItems}
                        isScheduledForDeletion={isScheduledForDeletion}
                        isAdmin={isAdmin}
                        compact
                    />
                </div>

                <div className='border-border mt-4 border-t pt-4'>
                    <div className='grid grid-cols-2 gap-2'>
                        {claw.ownerEmail && (
                            <CopyableField
                                label={t('dashboard.owner')}
                                value={claw.ownerEmail}
                            />
                        )}

                        {claw.ip && (
                            <CopyableField
                                label={t('dashboard.ipAddress')}
                                value={claw.ip}
                            />
                        )}

                        <CopyableField
                            label={t('dashboard.provider')}
                            value={
                                claw.provider === 'hetzner'
                                    ? t('createClaw.providerHetzner')
                                    : claw.provider === 'vultr'
                                      ? t('createClaw.providerVultr')
                                      : t('createClaw.providerDigitalOcean')
                            }
                            icon={
                                <ProviderIcon
                                    provider={claw.provider}
                                    className='h-3.5 w-3.5 shrink-0'
                                />
                            }
                        />

                        <CopyableField
                            label={t('dashboard.location')}
                            value={`${flag || ''} ${locationName}`.trim()}
                        />

                        <CopyableField
                            label={t('dashboard.plan')}
                            value={
                                plan
                                    ? `${plan.name.replace(/([A-Za-z])(\d)/, '$1 $2')} (${plan.cpu} vCPU, ${plan.memory}GB RAM, ${plan.disk}GB SSD)`
                                    : claw.planId
                            }
                        />

                        {monthlyPrice && (
                            <CopyableField
                                label={t('dashboard.monthlyCost')}
                                value={`$${monthlyPrice.toFixed(0)}/mo`}
                            />
                        )}

                        {claw.providerServerId && (
                            <CopyableField
                                label={t('dashboard.serverId')}
                                value={`#${claw.providerServerId}`}
                            />
                        )}

                        {claw.createdAt && (
                            <CopyableField
                                label={t('dashboard.created')}
                                value={new Date(
                                    claw.createdAt
                                ).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            />
                        )}

                        {attachedSshKey && (
                            <CopyableField
                                label={t('dashboard.sshKey')}
                                value={attachedSshKey.name}
                            />
                        )}

                        {claw.model && (
                            <CopyableField
                                label={t('dashboard.aiModel')}
                                value={
                                    aiModels.find((m) => m.id === claw.model)
                                        ?.name || claw.model
                                }
                            />
                        )}

                        {claw.currentPeriodStart && (
                            <CopyableField
                                label={t('dashboard.lastBilling')}
                                value={new Date(
                                    claw.currentPeriodStart
                                ).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            />
                        )}

                        {claw.currentPeriodEnd && (
                            <CopyableField
                                label={t('dashboard.nextBilling')}
                                value={new Date(
                                    claw.currentPeriodEnd
                                ).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            />
                        )}

                        {claw.volumes && claw.volumes.length > 0 && (
                            <CopyableField
                                label={t('dashboard.storage')}
                                value={`${claw.volumes.reduce((sum: number, v: Volume) => sum + v.size, 0)} GB`}
                            />
                        )}

                        {claw.gatewayToken && (
                            <CopyableField
                                label={t('dashboard.gatewayToken')}
                                value={claw.gatewayToken}
                            />
                        )}
                    </div>

                    {isScheduledForDeletion && (
                        <ScheduledDeletionBanner
                            deletionScheduledAt={claw.deletionScheduledAt!}
                            onCancelDeletion={actions.onCancelDeletion}
                            isLoading={isLoading}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default ClawCardGridView