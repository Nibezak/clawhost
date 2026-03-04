import type { FC, ReactNode } from 'react'
import type {
    ChannelConfig,
    ChannelDefinition,
    ClawChannelsResponse,
    PlaygroundChannelsContentProps,
    WhatsAppPairStatusResponse
} from '@/ts/Interfaces'

import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from '@openclaw/i18n'
import {
    CircleNotchIcon,
    CopyIcon,
    EyeIcon,
    EyeSlashIcon,
    WhatsappLogoIcon,
    TelegramLogoIcon,
    DiscordLogoIcon,
    SlackLogoIcon,
    ChatCircleIcon,
    CheckIcon,
    LinkSimpleIcon
} from '@phosphor-icons/react'
import { PanelPlaceholder } from '@/components'
import {
    Skeleton,
    Tooltip,
    TooltipTrigger,
    TooltipContent
} from '@/components/ui'
import { api, copyToClipboard } from '@/lib'
import { useUIStore } from '@/lib/store'

const CHANNEL_DEFINITIONS: ChannelDefinition[] = [
    {
        key: 'whatsapp',
        label: 'playground.channelsWhatsApp',
        icon: WhatsappLogoIcon,
        fields: [
            {
                key: 'dmPolicy',
                label: 'playground.channelsDmPolicy',
                placeholder: 'playground.channelsDmPolicyPairing',
                type: 'select',
                options: [
                    {
                        value: 'pairing',
                        label: 'playground.channelsDmPolicyPairing'
                    },
                    { value: 'open', label: 'playground.channelsDmPolicyOpen' },
                    {
                        value: 'allowlist',
                        label: 'playground.channelsDmPolicyAllowlist'
                    },
                    {
                        value: 'disabled',
                        label: 'playground.channelsDmPolicyDisabled'
                    }
                ]
            },
            {
                key: 'allowFrom',
                label: 'playground.channelsAllowFrom',
                placeholder: 'playground.channelsAllowFromPlaceholder'
            }
        ]
    },
    {
        key: 'telegram',
        label: 'playground.channelsTelegram',
        icon: TelegramLogoIcon,
        fields: [
            {
                key: 'botToken',
                label: 'playground.channelsBotToken',
                placeholder: 'playground.channelsBotTokenPlaceholder',
                required: true,
                secret: true
            }
        ]
    },
    {
        key: 'discord',
        label: 'playground.channelsDiscord',
        icon: DiscordLogoIcon,
        fields: [
            {
                key: 'token',
                label: 'playground.channelsToken',
                placeholder: 'playground.channelsTokenPlaceholder',
                required: true,
                secret: true
            }
        ]
    },
    {
        key: 'slack',
        label: 'playground.channelsSlack',
        icon: SlackLogoIcon,
        fields: [
            {
                key: 'botToken',
                label: 'playground.channelsBotToken',
                placeholder: 'playground.channelsBotTokenPlaceholder',
                required: true,
                secret: true
            },
            {
                key: 'appToken',
                label: 'playground.channelsAppToken',
                placeholder: 'playground.channelsAppTokenPlaceholder',
                required: true,
                secret: true
            },
            {
                key: 'signingSecret',
                label: 'playground.channelsSigningSecret',
                placeholder: 'playground.channelsSigningSecretPlaceholder',
                secret: true
            }
        ]
    },
    {
        key: 'signal',
        label: 'playground.channelsSignal',
        icon: ChatCircleIcon,
        fields: [
            {
                key: 'account',
                label: 'playground.channelsAccount',
                placeholder: 'playground.channelsAccountPlaceholder',
                required: true
            }
        ]
    }
]

const PlaygroundChannelsContent: FC<PlaygroundChannelsContentProps> = ({
    clawId
}): ReactNode => {
    const [channels, setChannels] = useState<Record<string, ChannelConfig>>({})
    const [hasChanges, setHasChanges] = useState(false)
    const [visibleSecrets, setVisibleSecrets] = useState<
        Record<string, boolean>
    >({})
    const [isPairing, setIsPairing] = useState(false)
    const [pollEnabled, setPollEnabled] = useState(false)
    const [pairUnsupported, setPairUnsupported] = useState(false)
    const { showToast } = useUIStore()
    const queryClient = useQueryClient()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['claw-channels', clawId],
        queryFn: () => api.getClawChannels(clawId),
        staleTime: 0,
        gcTime: 0,
        retry: 1
    })

    const { data: pairStatus } = useQuery<WhatsAppPairStatusResponse>({
        queryKey: ['whatsapp-pair-status', clawId],
        queryFn: () => api.pairWhatsAppStatus(clawId),
        enabled: pollEnabled,
        refetchInterval: 3000
    })

    useEffect(() => {
        if (!pairStatus || !isPairing) return
        if (pairStatus.status === 'paired') {
            setIsPairing(false)
            setPollEnabled(false)
            showToast(t('playground.channelsWhatsAppPaired'), 'success')
        }
        if (pairStatus.status === 'failed') {
            setIsPairing(false)
            setPollEnabled(false)
        }
    }, [pairStatus, isPairing, showToast])

    useEffect(() => {
        if (data) {
            const cleaned: Record<string, ChannelConfig> = {}
            for (const [key, config] of Object.entries(data.channels || {})) {
                const { applicationId: _, ...rest } =
                    config as ChannelConfig & { applicationId?: string }
                cleaned[key] = rest
            }
            setChannels(cleaned)
            setHasChanges(false)
        }
    }, [data])

    const toggleChannel = useCallback((key: string) => {
        setChannels((prev) => {
            const current = prev[key] || { enabled: false }
            return {
                ...prev,
                [key]: { ...current, enabled: !current.enabled }
            }
        })
        setHasChanges(true)
    }, [])

    const updateField = useCallback(
        (channelKey: string, fieldKey: string, value: string) => {
            setChannels((prev) => {
                const current = prev[channelKey] || { enabled: false }
                return {
                    ...prev,
                    [channelKey]: { ...current, [fieldKey]: value }
                }
            })
            setHasChanges(true)
        },
        []
    )

    const toggleSecret = useCallback((fieldId: string) => {
        setVisibleSecrets((prev) => ({ ...prev, [fieldId]: !prev[fieldId] }))
    }, [])

    const copyField = useCallback(
        async (value: string) => {
            await copyToClipboard(value)
            showToast(t('common.copied'), 'success')
        },
        [showToast]
    )

    const prepareChannels = useCallback((): Record<string, ChannelConfig> => {
        const prepared: Record<string, ChannelConfig> = {}
        for (const [key, config] of Object.entries(channels)) {
            const copy = { ...config }
            if (typeof copy.allowFrom === 'string') {
                const raw = copy.allowFrom as unknown as string
                copy.allowFrom = raw
                    ? raw
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                    : []
            }
            prepared[key] = copy
        }
        return prepared
    }, [channels])

    const saveMutation = useMutation({
        mutationFn: () =>
            api.updateClawChannels(clawId, { channels: prepareChannels() }),
        onSuccess: () => {
            showToast(t('playground.channelsSaved'), 'success')
            setHasChanges(false)
            queryClient.setQueryData<ClawChannelsResponse>(
                ['claw-channels', clawId],
                { channels }
            )
        },
        onError: () => {
            showToast(t('playground.channelsSaveFailed'), 'error')
        }
    })

    const pairMutation = useMutation({
        mutationFn: () => api.pairWhatsApp(clawId),
        onSuccess: (res) => {
            if (res.status === 'already_paired') {
                showToast(
                    t('playground.channelsWhatsAppAlreadyPaired'),
                    'success'
                )
                return
            }
            if (res.status === 'unsupported') {
                setPairUnsupported(true)
                return
            }
            setIsPairing(true)
            setTimeout(() => setPollEnabled(true), 3000)
        },
        onError: () => {
            showToast(t('playground.channelsWhatsAppPairFailed'), 'error')
        }
    })

    if (isLoading) {
        return (
            <div className='space-y-4 p-5'>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i}>
                        <Skeleton className='mb-2 h-5 w-32' />
                        <Skeleton className='h-10 w-full rounded-md' />
                    </div>
                ))}
            </div>
        )
    }

    if (isError) {
        return (
            <div className='flex h-full items-center justify-center p-5'>
                <PanelPlaceholder
                    icon={
                        <ChatCircleIcon
                            className='text-muted-foreground h-6 w-6'
                            weight='duotone'
                        />
                    }
                    title={t('playground.channelsLoadFailed')}
                    description={t('playground.channelsLoadFailedDescription')}
                />
            </div>
        )
    }

    return (
        <div className='flex h-full flex-col'>
            <div className='flex-1 overflow-y-auto p-5'>
                <p className='text-muted-foreground mb-4 text-[11px]'>
                    {t('playground.channelsDescription')}
                </p>

                <div className='space-y-3'>
                    {CHANNEL_DEFINITIONS.map((def) => {
                        const config = channels[def.key] || { enabled: false }
                        const Icon = def.icon

                        return (
                            <div
                                key={def.key}
                                className={`rounded-lg border transition-colors ${
                                    config.enabled
                                        ? 'border-[#ef5350]/30 bg-[#ef5350]/5'
                                        : 'border-border bg-foreground/[0.02]'
                                }`}
                            >
                                <button
                                    type='button'
                                    onClick={() => toggleChannel(def.key)}
                                    className='flex w-full items-center gap-2 px-3.5 py-3'
                                >
                                    <div
                                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                            config.enabled
                                                ? 'border-[#ef5350] bg-[#ef5350]'
                                                : 'border-border bg-foreground/5'
                                        }`}
                                    >
                                        {config.enabled && (
                                            <CheckIcon
                                                className='h-3 w-3 text-white'
                                                weight='bold'
                                            />
                                        )}
                                    </div>
                                    <Icon className='text-muted-foreground h-4 w-4' />
                                    <span className='text-foreground text-sm font-medium'>
                                        {t(def.label)}
                                    </span>
                                </button>

                                {config.enabled && def.key === 'whatsapp' && (
                                    <div className='border-border space-y-3 border-t px-3.5 pb-3.5 pt-3'>
                                        {isPairing &&
                                        pairStatus?.status === 'qr_ready' &&
                                        pairStatus.qr ? (
                                            <div className='space-y-2'>
                                                <p className='text-muted-foreground text-[11px]'>
                                                    {t(
                                                        'playground.channelsWhatsAppScanQr'
                                                    )}
                                                </p>
                                                <pre className='bg-background overflow-x-auto rounded-md border p-2 text-center font-mono text-[6px] leading-[6px]'>
                                                    {pairStatus.qr}
                                                </pre>
                                                <p className='text-muted-foreground text-center text-[10px]'>
                                                    {t(
                                                        'playground.channelsWhatsAppScanInstructions'
                                                    )}
                                                </p>
                                            </div>
                                        ) : isPairing ? (
                                            <div className='flex items-center gap-2 py-2'>
                                                <CircleNotchIcon className='text-muted-foreground h-3.5 w-3.5 animate-spin' />
                                                <span className='text-muted-foreground text-[11px]'>
                                                    {t(
                                                        'playground.channelsWhatsAppPairing'
                                                    )}
                                                </span>
                                            </div>
                                        ) : pairStatus?.status === 'failed' ? (
                                            <div className='space-y-2'>
                                                <p className='text-[11px] text-red-400'>
                                                    {t(
                                                        'playground.channelsWhatsAppPairFailed'
                                                    )}
                                                </p>
                                                {pairStatus.log && (
                                                    <pre className='bg-background max-h-24 overflow-auto rounded-md border p-2 font-mono text-[10px] text-red-400/70'>
                                                        {pairStatus.log}
                                                    </pre>
                                                )}
                                                <button
                                                    type='button'
                                                    onClick={() =>
                                                        pairMutation.mutate()
                                                    }
                                                    disabled={
                                                        pairMutation.isPending
                                                    }
                                                    className='flex w-full items-center justify-center gap-2 rounded-md border border-[#25D366]/30 bg-[#25D366]/10 px-3 py-2 text-[11px] font-medium text-[#25D366] transition-colors hover:bg-[#25D366]/20 disabled:cursor-not-allowed disabled:opacity-50'
                                                >
                                                    {pairMutation.isPending ? (
                                                        <CircleNotchIcon className='h-3.5 w-3.5 animate-spin' />
                                                    ) : (
                                                        <LinkSimpleIcon className='h-3.5 w-3.5' />
                                                    )}
                                                    {t(
                                                        'playground.channelsWhatsAppPairDevice'
                                                    )}
                                                </button>
                                            </div>
                                        ) : pairUnsupported ? (
                                            <p className='text-muted-foreground text-[11px]'>
                                                {t(
                                                    'playground.channelsWhatsAppUnsupported'
                                                )}
                                            </p>
                                        ) : (
                                            <button
                                                type='button'
                                                onClick={() =>
                                                    pairMutation.mutate()
                                                }
                                                disabled={
                                                    pairMutation.isPending
                                                }
                                                className='flex w-full items-center justify-center gap-2 rounded-md border border-[#25D366]/30 bg-[#25D366]/10 px-3 py-2 text-[11px] font-medium text-[#25D366] transition-colors hover:bg-[#25D366]/20 disabled:cursor-not-allowed disabled:opacity-50'
                                            >
                                                {pairMutation.isPending ? (
                                                    <CircleNotchIcon className='h-3.5 w-3.5 animate-spin' />
                                                ) : (
                                                    <LinkSimpleIcon className='h-3.5 w-3.5' />
                                                )}
                                                {t(
                                                    'playground.channelsWhatsAppPairDevice'
                                                )}
                                            </button>
                                        )}
                                        {def.fields.map((field) => {
                                            const fieldId = `${def.key}-${String(field.key)}`
                                            const rawValue = config[field.key]
                                            const value = Array.isArray(
                                                rawValue
                                            )
                                                ? rawValue.join(', ')
                                                : (rawValue as string) || ''

                                            return (
                                                <div key={fieldId}>
                                                    <div className='mb-1.5 flex items-center justify-between'>
                                                        <label className='text-muted-foreground text-[11px] font-medium'>
                                                            {t(field.label)}
                                                        </label>
                                                    </div>
                                                    {field.type === 'select' &&
                                                    field.options ? (
                                                        <select
                                                            value={
                                                                value ||
                                                                field.options[0]
                                                                    ?.value ||
                                                                ''
                                                            }
                                                            onChange={(e) =>
                                                                updateField(
                                                                    def.key,
                                                                    String(
                                                                        field.key
                                                                    ),
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className='border-border bg-foreground/5 text-foreground w-full rounded-md border px-2.5 py-1.5 text-[11px] outline-none transition-colors focus:border-[#ef5350]/50'
                                                        >
                                                            {field.options.map(
                                                                (opt) => (
                                                                    <option
                                                                        key={
                                                                            opt.value
                                                                        }
                                                                        value={
                                                                            opt.value
                                                                        }
                                                                    >
                                                                        {t(
                                                                            opt.label
                                                                        )}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    ) : (
                                                        <input
                                                            type='text'
                                                            value={value}
                                                            onChange={(e) =>
                                                                updateField(
                                                                    def.key,
                                                                    String(
                                                                        field.key
                                                                    ),
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder={t(
                                                                field.placeholder
                                                            )}
                                                            className='border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground w-full rounded-md border px-2.5 py-1.5 font-mono text-[11px] outline-none transition-colors focus:border-[#ef5350]/50'
                                                        />
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                {config.enabled &&
                                    def.key !== 'whatsapp' &&
                                    def.fields.length > 0 && (
                                        <div className='border-border space-y-3 border-t px-3.5 pb-3.5 pt-3'>
                                            {def.fields.map((field) => {
                                                const fieldId = `${def.key}-${String(field.key)}`
                                                const isVisible =
                                                    visibleSecrets[fieldId]
                                                const value =
                                                    (config[
                                                        field.key
                                                    ] as string) || ''

                                                return (
                                                    <div key={fieldId}>
                                                        <div className='mb-1.5 flex items-center justify-between'>
                                                            <label className='text-muted-foreground text-[11px] font-medium'>
                                                                {t(field.label)}
                                                                {field.required && (
                                                                    <span className='ml-0.5 text-red-600 dark:text-red-400'>
                                                                        *
                                                                    </span>
                                                                )}
                                                            </label>
                                                            <div className='flex items-center gap-1'>
                                                                <Tooltip>
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <button
                                                                            type='button'
                                                                            disabled={
                                                                                !value
                                                                            }
                                                                            onClick={() =>
                                                                                copyField(
                                                                                    value
                                                                                )
                                                                            }
                                                                            className='text-muted-foreground hover:text-foreground/80 disabled:hover:text-muted-foreground rounded p-0.5 transition-colors disabled:cursor-not-allowed disabled:opacity-30'
                                                                        >
                                                                            <CopyIcon className='h-3 w-3' />
                                                                        </button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        {t(
                                                                            'common.copy'
                                                                        )}
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                                {field.secret && (
                                                                    <Tooltip>
                                                                        <TooltipTrigger
                                                                            asChild
                                                                        >
                                                                            <button
                                                                                type='button'
                                                                                onClick={() =>
                                                                                    toggleSecret(
                                                                                        fieldId
                                                                                    )
                                                                                }
                                                                                className='text-muted-foreground hover:text-foreground/80 rounded p-0.5 transition-colors'
                                                                            >
                                                                                {isVisible ? (
                                                                                    <EyeSlashIcon className='h-3 w-3' />
                                                                                ) : (
                                                                                    <EyeIcon className='h-3 w-3' />
                                                                                )}
                                                                            </button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            {isVisible
                                                                                ? t(
                                                                                      'common.hide'
                                                                                  )
                                                                                : t(
                                                                                      'common.show'
                                                                                  )}
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <input
                                                            type={
                                                                field.secret &&
                                                                !isVisible
                                                                    ? 'password'
                                                                    : 'text'
                                                            }
                                                            value={value}
                                                            onChange={(e) =>
                                                                updateField(
                                                                    def.key,
                                                                    String(
                                                                        field.key
                                                                    ),
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder={t(
                                                                field.placeholder
                                                            )}
                                                            className='border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground w-full rounded-md border px-2.5 py-1.5 font-mono text-[11px] outline-none transition-colors focus:border-[#ef5350]/50'
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className='border-border border-t p-4'>
                <button
                    onClick={() => saveMutation.mutate()}
                    disabled={saveMutation.isPending || !hasChanges}
                    className='flex w-full items-center justify-center gap-2 rounded-lg bg-[#ef5350] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#e53935] disabled:cursor-not-allowed disabled:opacity-50'
                >
                    {saveMutation.isPending && (
                        <CircleNotchIcon className='h-4 w-4 animate-spin' />
                    )}
                    {t('playground.channelsSave')}
                </button>
            </div>
        </div>
    )
}

export default PlaygroundChannelsContent