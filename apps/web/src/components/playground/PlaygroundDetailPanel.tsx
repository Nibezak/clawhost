import type { FC, ReactNode } from 'react'
import type {
    PlaygroundDetailPanelProps,
    PlaygroundTabConfig
} from '@/ts/Interfaces'
import type { PlaygroundDetailTab } from '@/ts/Types'
import type { TranslationKey } from '@openclaw/i18n'

import { useCallback, useState, useMemo, useEffect } from 'react'
import CLAW_DETAIL_TABS from '@/lib/clawDetailTabs'
import { motion } from 'framer-motion'
import { t } from '@openclaw/i18n'
import { clawStatus } from '@openclaw/shared'
import {
    XIcon,
    InfoIcon,
    ScrollIcon,
    PulseIcon,
    KeyIcon,
    LightningIcon
} from '@phosphor-icons/react'
import { ClawAvatar, ProviderIcon } from '@/components'
import { Skeleton } from '@/components/ui'
import { getBaseDomain } from '@/lib'
import {
    CopyableField,
    ClawLogsContent,
    ClawDiagnosticsContent
} from '@/components/dashboard'
import {
    PlaygroundVariablesContent,
    PlaygroundSkillsContent
} from '@/components/playground'
import { useClawVersion } from '@/hooks'
import { locationFlags, locationNames, generateSlug } from '@/lib/claw-utils'

const tabStateMap: Record<string, PlaygroundDetailTab> = {}

const tabs: PlaygroundTabConfig<PlaygroundDetailTab>[] = [
    { id: CLAW_DETAIL_TABS.INFO, label: 'playground.tabInfo', icon: InfoIcon },
    {
        id: CLAW_DETAIL_TABS.VARIABLES,
        label: 'playground.tabEnvs',
        icon: KeyIcon
    },
    {
        id: CLAW_DETAIL_TABS.SKILLS,
        label: 'playground.tabSkills',
        icon: LightningIcon
    },
    {
        id: CLAW_DETAIL_TABS.LOGS,
        label: 'playground.tabLogs',
        icon: ScrollIcon
    },
    {
        id: CLAW_DETAIL_TABS.DIAGNOSTICS,
        label: 'playground.tabDiagnostics',
        icon: PulseIcon
    }
]

const PlaygroundDetailPanel: FC<PlaygroundDetailPanelProps> = ({
    claw,
    plans,
    sshKeys,
    onClose,
    readOnly,
    initialTab,
    onTabChange,
    fullScreen
}): ReactNode => {
    const activeTab = tabStateMap[claw.id] || CLAW_DETAIL_TABS.INFO
    const setActiveTab = useCallback(
        (tab: PlaygroundDetailTab) => {
            tabStateMap[claw.id] = tab
            setRenderKey((k) => k + 1)
            if (onTabChange) onTabChange(tab)
        },
        [claw.id, onTabChange]
    )
    useEffect(() => {
        if (initialTab && initialTab !== tabStateMap[claw.id]) {
            tabStateMap[claw.id] = initialTab
            setRenderKey((k) => k + 1)
        }
    }, [initialTab, claw.id])
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

    const isInfoTab = activeTab === 'info'
    const versionQuery = useClawVersion(
        claw.id,
        isInfoTab && !readOnly && !!claw.ip
    )
    const showVersion = readOnly || !!claw.ip
    const versionLoading = !readOnly && versionQuery.isPending
    const versionDisplay = useMemo(() => {
        if (readOnly) return '2026.2.13'
        if (versionQuery.isPending) return null
        if (versionQuery.isError || !versionQuery.data) return null
        return versionQuery.data.version
    }, [
        readOnly,
        versionQuery.isPending,
        versionQuery.isError,
        versionQuery.data
    ])

    const Wrapper = fullScreen ? 'div' : motion.div
    const wrapperProps = fullScreen
        ? { className: 'flex h-full w-full flex-col overflow-hidden' }
        : {
              initial: { x: '100%' },
              animate: { x: 0 },
              exit: { x: '100%' },
              transition: { type: 'tween', duration: 0.2 },
              className:
                  'fixed inset-0 z-40 overflow-hidden md:relative md:inset-auto md:z-auto md:h-full md:w-[380px] md:shrink-0'
          }

    return (
        <Wrapper {...(wrapperProps as Record<string, unknown>)}>
            <div
                className={`flex h-full w-full flex-col ${fullScreen ? 'bg-background' : 'bg-background md:border-border md:bg-background/95 md:border-l md:backdrop-blur-xl'}`}
            >
                <div className='border-border flex items-center justify-between border-b px-5 py-2.5'>
                    <div className='flex items-center gap-2.5'>
                        <ClawAvatar />
                        <div className='space-y-0'>
                            <h3 className='text-foreground text-sm font-semibold leading-tight'>
                                {claw.name}
                            </h3>
                            {claw.status !== clawStatus.configuring && (
                                <a
                                    href={`https://${claw.subdomain || generateSlug(claw.id)}.${getBaseDomain()}${claw.gatewayToken ? `/?token=${claw.gatewayToken}` : ''}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-muted-foreground hover:text-foreground/80 block text-xs leading-tight transition-colors'
                                >
                                    {claw.subdomain || generateSlug(claw.id)}.
                                    {getBaseDomain()}
                                </a>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={`text-muted-foreground hover:bg-foreground/10 hover:text-foreground rounded-lg p-1.5 transition-colors ${fullScreen ? 'md:hidden' : ''}`}
                    >
                        <XIcon className='h-4 w-4' weight='bold' />
                    </button>
                </div>

                <div className='border-border flex border-b'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 px-3 py-2 text-xs font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'text-foreground border-[#ef5350]'
                                    : 'text-muted-foreground hover:text-foreground/80 border-transparent'
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
                            <div
                                className={`grid gap-2 ${fullScreen ? 'grid-cols-3' : 'grid-cols-2'}`}
                            >
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

                                {showVersion && versionLoading && (
                                    <div className='bg-foreground/5 rounded-lg px-3 py-2'>
                                        <span className='text-muted-foreground block text-xs'>
                                            {t('dashboard.version')}
                                        </span>
                                        <Skeleton className='mt-1 h-5 w-24' />
                                    </div>
                                )}

                                {showVersion && versionDisplay && (
                                    <CopyableField
                                        label={t('dashboard.version')}
                                        value={versionDisplay}
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

                    {activeTab === 'skills' && (
                        <PlaygroundSkillsContent clawId={claw.id} />
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
        </Wrapper>
    )
}

export default PlaygroundDetailPanel