import type { FC, ReactNode } from 'react'
import type { PlaygroundAgentDetailPanelProps } from '@/ts/Interfaces'
import type { PlaygroundAgentDetailTab } from '@/ts/Types'

import type { TranslationKey } from '@openclaw/i18n'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from '@openclaw/i18n'
import {
    X,
    ChatCircle,
    GearSix,
    CircleNotch,
    ChatTeardropText,
    Eye,
    EyeSlash,
    Copy,
    Check
} from '@phosphor-icons/react'
import { ClawMascotOutline } from '@/components/ClawMascotOutline'
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectGroup
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { useUIStore } from '@/lib/store'
import { aiModels } from '@/lib/claw-utils'
import PLAYGROUND_AGENTS_QUERY_KEY from '@/hooks/usePlayground/PLAYGROUND_AGENTS_QUERY_KEY'

const agentTabStateMap: Record<string, PlaygroundAgentDetailTab> = {}

const tabs: {
    id: PlaygroundAgentDetailTab
    label: string
    icon: typeof ChatCircle
}[] = [
    { id: 'chat', label: 'playground.tabChat', icon: ChatCircle },
    { id: 'configuration', label: 'playground.tabConfiguration', icon: GearSix }
]

const PlaygroundAgentDetailPanel: FC<PlaygroundAgentDetailPanelProps> = ({
    agent,
    clawId,
    clawName,
    onClose
}): ReactNode => {
    const activeTab = agentTabStateMap[agent.id] || 'chat'
    const setActiveTab = useCallback(
        (tab: PlaygroundAgentDetailTab) => {
            agentTabStateMap[agent.id] = tab
            setRenderKey((k) => k + 1)
        },
        [agent.id]
    )
    const [, setRenderKey] = useState(0)
    const [selectedModel, setSelectedModel] = useState<string>('')
    const [apiKeyValue, setApiKeyValue] = useState('')
    const [hasChanges, setHasChanges] = useState(false)
    const [showApiKey, setShowApiKey] = useState(false)
    const [copied, setCopied] = useState(false)
    const { showToast } = useUIStore()
    const queryClient = useQueryClient()

    const modelsByProvider = useMemo(() => {
        const grouped: Record<string, typeof aiModels> = {}
        aiModels.forEach((model) => {
            if (!grouped[model.provider]) {
                grouped[model.provider] = []
            }
            grouped[model.provider].push(model)
        })
        return grouped
    }, [])

    const providerKeys = useMemo(
        () => Object.keys(modelsByProvider),
        [modelsByProvider]
    )

    const selectedModelOption = useMemo(
        () => aiModels.find((m) => m.id === selectedModel),
        [selectedModel]
    )

    const {
        data: configData,
        isLoading: isConfigLoading,
        isError: isConfigError
    } = useQuery({
        queryKey: ['agent-config', clawId, agent.id],
        queryFn: () => api.getClawAgentConfig(clawId, agent.id),
        enabled: activeTab === 'configuration',
        staleTime: 0,
        gcTime: 0,
        retry: 1
    })

    useEffect(() => {
        if (activeTab !== 'configuration') {
            queryClient.removeQueries({
                queryKey: ['agent-config', clawId, agent.id]
            })
        }
    }, [activeTab, queryClient, clawId, agent.id])

    useEffect(() => {
        if (configData) {
            const model =
                configData.agent.model || configData.defaultModel || ''
            setSelectedModel(model)

            const modelOption = aiModels.find((m) => m.id === model)
            if (modelOption) {
                setApiKeyValue(configData.envVars[modelOption.envVar] || '')
            } else {
                setApiKeyValue('')
            }

            setHasChanges(false)
        }
    }, [configData])

    const saveMutation = useMutation({
        mutationFn: () => {
            const envVarsObj: Record<string, string> = {}
            if (selectedModelOption && apiKeyValue) {
                envVarsObj[selectedModelOption.envVar] = apiKeyValue
            }

            return api.updateClawAgentConfig(clawId, {
                agentId: agent.id,
                model: selectedModel || null,
                envVars: envVarsObj
            })
        },
        onSuccess: () => {
            showToast(t('playground.configurationSaved'), 'success')
            setHasChanges(false)
            queryClient.invalidateQueries({
                queryKey: ['agent-config', clawId, agent.id]
            })
            queryClient.invalidateQueries({
                queryKey: [PLAYGROUND_AGENTS_QUERY_KEY, clawId]
            })
            queryClient.invalidateQueries({
                queryKey: ['claw-env', clawId]
            })
        },
        onError: () => {
            showToast(t('playground.configurationSaveFailed'), 'error')
        }
    })

    const handleModelChange = useCallback(
        (model: string) => {
            setSelectedModel(model)
            setHasChanges(true)

            const modelOption = aiModels.find((m) => m.id === model)
            if (modelOption && configData) {
                setApiKeyValue(configData.envVars[modelOption.envVar] || '')
            } else {
                setApiKeyValue('')
            }
            setShowApiKey(false)
        },
        [configData]
    )

    const handleCopyApiKey = useCallback(() => {
        if (apiKeyValue) {
            navigator.clipboard.writeText(apiKeyValue)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }, [apiKeyValue])

    return (
        <motion.div
            initial={false}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            className='h-full w-[380px] shrink-0 overflow-hidden'
        >
            <div className='flex h-full w-[380px] flex-col border-l border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl'>
                <div className='flex items-center justify-between border-b border-white/10 px-5 py-4'>
                    <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5'>
                            <ClawMascotOutline className='h-4 w-4 text-gray-400' />
                        </div>
                        <div>
                            <h3 className='text-sm font-semibold text-white'>
                                {agent.name}
                            </h3>
                            <span className='text-xs text-gray-500'>
                                {t('playground.agentOnClaw', { clawName })}
                            </span>
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
                            className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-medium transition-colors ${
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
                    {activeTab === 'chat' && (
                        <div className='flex h-full flex-col items-center justify-center gap-3 p-5'>
                            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/5'>
                                <ChatTeardropText
                                    className='h-6 w-6 text-gray-500'
                                    weight='duotone'
                                />
                            </div>
                            <div className='text-center'>
                                <p className='text-sm font-medium text-gray-300'>
                                    {t('playground.chatComingSoon')}
                                </p>
                                <p className='mt-1 text-xs text-gray-500'>
                                    {t('playground.chatComingSoonDescription')}
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'configuration' && (
                        <div className='h-full overflow-y-auto p-5'>
                            {isConfigLoading ? (
                                <div className='space-y-5'>
                                    <div>
                                        <Skeleton className='mb-2 h-4 w-16' />
                                        <Skeleton className='h-9 w-full rounded-md' />
                                        <Skeleton className='mt-1.5 h-3 w-48' />
                                    </div>
                                    <div>
                                        <Skeleton className='mb-2 h-4 w-14' />
                                        <Skeleton className='h-9 w-full rounded-md' />
                                        <Skeleton className='mt-1.5 h-3 w-56' />
                                    </div>
                                    <Skeleton className='h-10 w-full rounded-lg' />
                                </div>
                            ) : isConfigError ? (
                                <div className='py-12 text-center'>
                                    <p className='text-xs text-gray-500'>
                                        {t(
                                            'playground.configurationLoadFailed'
                                        )}
                                    </p>
                                </div>
                            ) : (
                                <div className='space-y-5'>
                                    <div>
                                        <label className='mb-2 block text-xs font-medium text-gray-400'>
                                            {t('playground.configurationModel')}
                                        </label>
                                        <Select
                                            value={selectedModel}
                                            onValueChange={handleModelChange}
                                            displayValue={
                                                selectedModelOption?.name
                                            }
                                        >
                                            <SelectTrigger
                                                placeholder={t(
                                                    'playground.configurationModelPlaceholder'
                                                )}
                                                className='h-9 border-white/10 bg-white/5 text-sm text-white'
                                            />
                                            <SelectContent className='max-h-[300px] overflow-y-auto'>
                                                {providerKeys.map(
                                                    (provider, index) => (
                                                        <SelectGroup
                                                            key={provider}
                                                            label={provider}
                                                            isLast={
                                                                index ===
                                                                providerKeys.length -
                                                                    1
                                                            }
                                                        >
                                                            {modelsByProvider[
                                                                provider
                                                            ].map((model) => (
                                                                <SelectItem
                                                                    key={
                                                                        model.id
                                                                    }
                                                                    value={
                                                                        model.id
                                                                    }
                                                                >
                                                                    {model.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <p className='mt-1.5 text-[11px] text-gray-600'>
                                            {t(
                                                'playground.configurationModelDescription'
                                            )}
                                        </p>
                                    </div>

                                    {selectedModelOption && (
                                        <div>
                                            <div className='mb-2 flex items-center justify-between'>
                                                <label className='text-xs font-medium text-gray-400'>
                                                    {t(
                                                        'playground.configurationApiKey'
                                                    )}
                                                </label>
                                                <div className='flex items-center gap-1'>
                                                    <button
                                                        type='button'
                                                        onClick={() =>
                                                            setShowApiKey(
                                                                !showApiKey
                                                            )
                                                        }
                                                        className='rounded p-1 text-gray-500 transition-colors hover:text-gray-300'
                                                    >
                                                        {showApiKey ? (
                                                            <EyeSlash className='h-3.5 w-3.5' />
                                                        ) : (
                                                            <Eye className='h-3.5 w-3.5' />
                                                        )}
                                                    </button>
                                                    {apiKeyValue && (
                                                        <button
                                                            type='button'
                                                            onClick={handleCopyApiKey}
                                                            className='rounded p-1 text-gray-500 transition-colors hover:text-gray-300'
                                                        >
                                                            {copied ? (
                                                                <Check className='h-3.5 w-3.5 text-green-400' />
                                                            ) : (
                                                                <Copy className='h-3.5 w-3.5' />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <input
                                                type={
                                                    showApiKey
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                value={apiKeyValue}
                                                onChange={(e) => {
                                                    setApiKeyValue(
                                                        e.target.value
                                                    )
                                                    setHasChanges(true)
                                                }}
                                                placeholder={t(
                                                    'playground.configurationApiKeyPlaceholder'
                                                )}
                                                className='w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 font-mono text-[11px] text-white outline-none transition-colors placeholder:text-gray-600 focus:border-[#ef5350]/50'
                                            />
                                            <p className='mt-1.5 text-[11px] text-gray-600'>
                                                <span className='font-mono text-gray-500'>
                                                    {selectedModelOption.envVar}
                                                </span>
                                                {' — '}
                                                {t(
                                                    'playground.configurationApiKeyDescription',
                                                    {
                                                        modelName:
                                                            selectedModelOption.name
                                                    }
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => saveMutation.mutate()}
                                        disabled={
                                            saveMutation.isPending ||
                                            !hasChanges
                                        }
                                        className='flex w-full items-center justify-center gap-2 rounded-lg bg-[#ef5350] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#e53935] disabled:cursor-not-allowed disabled:opacity-50'
                                    >
                                        {saveMutation.isPending ? (
                                            <>
                                                <CircleNotch className='h-4 w-4 animate-spin' />
                                                {t(
                                                    'playground.configurationSaving'
                                                )}
                                            </>
                                        ) : (
                                            t(
                                                'playground.configurationSave'
                                            )
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default PlaygroundAgentDetailPanel