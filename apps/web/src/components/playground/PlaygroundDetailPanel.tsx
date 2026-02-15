import type { FC, ReactNode } from 'react'
import type {
    PlaygroundDetailPanelProps,
    PlaygroundTabConfig
} from '@/ts/Interfaces'
import type { PlaygroundDetailTab } from '@/ts/Types'
import type { TranslationKey } from '@openclaw/i18n'

import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { t } from '@openclaw/i18n'
import { clawStatus } from '@openclaw/shared'
import { X, Info, Scroll, Pulse, Key } from '@phosphor-icons/react'
import { ClawAvatar, ProviderIcon } from '@/components'
import { getBaseDomain } from '@/lib'
import {
    CopyableField,
    ClawLogsContent,
    ClawDiagnosticsContent
} from '@/components/dashboard'
import { PlaygroundVariablesContent } from '@/components/playground'
import {
    locationFlags,
    locationNames,
    generateSlug,
    aiModels
} from '@/lib/claw-utils'

const tabStateMap: Record<string, PlaygroundDetailTab> = {}

const tabs: PlaygroundTabConfig<PlaygroundDetailTab>[] = [
    { id: 'info', label: 'playground.tabInfo', icon: Info },
    { id: 'variables', label: 'playground.tabVariables', icon: Key },
    { id: 'logs', label: 'playground.tabLogs', icon: Scroll },
    { id: 'diagnostics', label: 'playground.tabDiagnostics', icon: Pulse }
]

const PlaygroundDetailPanel: FC<PlaygroundDetailPanelProps> = ({
    claw,
    plans,
    sshKeys,
    onClose,
    readOnly
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
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            className='h-full w-[90vw] shrink-0 overflow-hidden md:w-[380px]'
        >
            <div className='flex h-full w-full flex-col border-l border-white/10 bg-[#0a0a0f] md:bg-[#0a0a0f]/95 md:backdrop-blur-xl'>
                <div className='flex items-center justify-between border-b border-white/10 px-5 py-2.5'>
                    <div className='flex items-center gap-2.5'>
                        <ClawAvatar />
                        <div className='space-y-0'>
                            <h3 className='text-sm font-semibold leading-tight text-white'>
                                {claw.name}
                            </h3>
                            {claw.status !== clawStatus.configuring && (
                                <a
                                    href={`https://${claw.subdomain || generateSlug(claw.id)}.${getBaseDomain()}${claw.gatewayToken ? `/?token=${claw.gatewayToken}` : ''}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='block text-xs leading-tight text-gray-500 transition-colors hover:text-gray-300'
                                >
                                    {claw.subdomain || generateSlug(claw.id)}.
                                    {getBaseDomain()}
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
                            className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 px-3 py-2 text-xs font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'border-[#ef5350] text-white'
                                    : 'border-transparent text-gray-500 hover:text-gray-300'
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
                        <ClawLogsContent
                            clawId={claw.id}
                            enabled
                            embedded
                            mockLogs={
                                readOnly
                                    ? '2026-02-14T10:23:41Z Starting OpenClaw agent...\n2026-02-14T10:23:42Z Loading model: claude-sonnet-4-5\n2026-02-14T10:23:43Z Agent ready on port 3000\n2026-02-14T10:23:44Z Connected to gateway\n2026-02-14T10:24:01Z Request received: /chat\n2026-02-14T10:24:03Z Response sent (1.2s)\n2026-02-14T10:25:12Z Request received: /chat\n2026-02-14T10:25:14Z Response sent (1.8s)\n2026-02-14T10:26:30Z Health check passed'
                                    : undefined
                            }
                        />
                    )}

                    {activeTab === 'diagnostics' && (
                        <div className='h-full overflow-y-auto p-5'>
                            <ClawDiagnosticsContent
                                clawId={claw.id}
                                enabled
                                mockData={
                                    readOnly
                                        ? {
                                              service:
                                                  '● openclaw.service - OpenClaw Agent\n   Loaded: loaded (/etc/systemd/system/openclaw.service; enabled)\n   Active: active (running) since Fri 2026-02-14 10:23:41 UTC\n Main PID: 1847 (node)\n    Tasks: 11 (limit: 4915)\n   Memory: 128.4M\n      CPU: 2.341s\n   CGroup: /system.slice/openclaw.service\n           └─1847 node /opt/openclaw/server.js',
                                              port: 'tcp  0  0 0.0.0.0:3000  0.0.0.0:*  LISTEN  1847/node',
                                              memory: 'Mem: 1987Mi total, 128Mi used, 1640Mi free, 219Mi buff/cache\nSwap: 0B total, 0B used, 0B free'
                                          }
                                        : undefined
                                }
                            />
                        </div>
                    )}

                    {activeTab === 'variables' && (
                        <PlaygroundVariablesContent
                            clawId={claw.id}
                            mockEnvVars={
                                readOnly
                                    ? {
                                          ANTHROPIC_API_KEY:
                                              'sk-ant-api03-••••••••',
                                          OPENAI_API_KEY: 'sk-proj-••••••••'
                                      }
                                    : undefined
                            }
                        />
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default PlaygroundDetailPanel