import type { FC, ReactNode } from 'react'
import type { PlaygroundDetailPanelProps } from '@/ts/Interfaces'
import type { PlaygroundDetailTab } from '@/ts/Types'
import type { TranslationKey } from '@openclaw/i18n'

import { useCallback, useState } from 'react'
import { t } from '@openclaw/i18n'
import { X, Info, Scroll, Pulse } from '@phosphor-icons/react'
import ClawAvatar from '@/components/ClawAvatar'
import ProviderIcon from '@/components/ProviderIcon'
import { CopyableField } from '@/components/dashboard/CopyableField'
import ClawLogsContent from '@/components/dashboard/ClawLogsContent'
import ClawDiagnosticsContent from '@/components/dashboard/ClawDiagnosticsContent'
import {
    locationFlags,
    locationNames,
    generateSlug,
    aiModels
} from '@/lib/claw-utils'

const tabStateMap: Record<string, PlaygroundDetailTab> = {}

const tabs: { id: PlaygroundDetailTab; label: string; icon: typeof Info }[] = [
    { id: 'info', label: 'playground.tabInfo', icon: Info },
    { id: 'logs', label: 'playground.tabLogs', icon: Scroll },
    { id: 'diagnostics', label: 'playground.tabDiagnostics', icon: Pulse }
]

const PlaygroundDetailPanel: FC<PlaygroundDetailPanelProps> = ({
    claw,
    plans,
    sshKeys,
    onClose
}): ReactNode => {
    const activeTab = tabStateMap[claw.id] || 'info'
    const setActiveTab = useCallback(
        (tab: PlaygroundDetailTab) => {
            tabStateMap[claw.id] = tab
            setRenderKey((k) => k + 1)
        },
        [claw.id]
    )
    const [, setRenderKey] = useState(0)

    const plan = plans.find((p) => p.id === claw.planId)
    const monthlyPrice = plan ? plan.priceMonthly : null
    const locationName = claw.location
        ? locationNames[claw.location] || claw.location
        : 'Unknown'
    const flag = claw.location ? locationFlags[claw.location] : null
    const attachedSshKey = claw.sshKeyId
        ? sshKeys.find((k) => k.id === claw.sshKeyId)
        : null

    return (
        <div className='animate-in slide-in-from-right h-full w-[380px] shrink-0 overflow-hidden duration-200'>
            <div className='flex h-full w-[380px] flex-col border-l border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl'>
                <div className='flex items-center justify-between border-b border-white/10 px-5 py-4'>
                    <div className='flex items-center gap-3'>
                        <ClawAvatar />
                        <div>
                            <h3 className='text-sm font-semibold text-white'>
                                {claw.name}
                            </h3>
                            {claw.status !== 'configuring' && (
                                <a
                                    href={`https://${claw.subdomain || generateSlug(claw.id)}.clawhost.cloud${claw.gatewayToken ? `/?token=${claw.gatewayToken}` : ''}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-xs text-gray-500 transition-colors hover:text-gray-300'
                                >
                                    {claw.subdomain || generateSlug(claw.id)}
                                    .clawhost.cloud
                                </a>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className='rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white'
                    >
                        <X className='h-4 w-4' weight='bold' />
                    </button>
                </div>

                <div className='flex border-b border-white/10'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'border-b-2 border-[#ef5350] text-white'
                                    : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            <tab.icon
                                className='h-3.5 w-3.5'
                                weight={
                                    activeTab === tab.id ? 'fill' : 'regular'
                                }
                            />
                            {t(tab.label as TranslationKey)}
                        </button>
                    ))}
                </div>

                <div className='flex min-h-0 flex-1 flex-col overflow-hidden'>
                    {activeTab === 'info' && (
                        <div className='h-full overflow-y-auto p-5'>
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
                                              : t(
                                                    'createClaw.providerDigitalOcean'
                                                )
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
                                            aiModels.find(
                                                (m) => m.id === claw.model
                                            )?.name || claw.model
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
                                        value={`${claw.volumes.reduce((sum, v) => sum + v.size, 0)} GB`}
                                    />
                                )}

                                {claw.gatewayToken && (
                                    <CopyableField
                                        label={t('dashboard.gatewayToken')}
                                        value={claw.gatewayToken}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'logs' && (
                        <ClawLogsContent clawId={claw.id} enabled embedded />
                    )}

                    {activeTab === 'diagnostics' && (
                        <div className='h-full overflow-y-auto p-5'>
                            <ClawDiagnosticsContent clawId={claw.id} enabled />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PlaygroundDetailPanel