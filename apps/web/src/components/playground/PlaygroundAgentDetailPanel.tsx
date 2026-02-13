import type { FC, ReactNode } from 'react'
import type {
    PlaygroundAgentDetailPanelProps,
    AgentModelOption
} from '@/ts/Interfaces'
import type { PlaygroundAgentDetailTab } from '@/ts/Types'

import type { TranslationKey } from '@openclaw/i18n'

import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from '@openclaw/i18n'
import {
    X,
    ChatCircle,
    GearSix,
    CircleNotch,
    Plus,
    Trash,
    FloppyDisk,
    ChatTeardropText
} from '@phosphor-icons/react'
import { ClawMascotOutline } from '@/components/ClawMascotOutline'
import { api } from '@/lib/api'
import { useUIStore } from '@/lib/store'
import PLAYGROUND_AGENTS_QUERY_KEY from '@/hooks/usePlayground/PLAYGROUND_AGENTS_QUERY_KEY'

const AGENT_MODELS: AgentModelOption[] = [
    {
        id: 'anthropic/claude-opus-4-6',
        name: 'Claude Opus 4.6',
        provider: 'Anthropic',
        envVar: 'ANTHROPIC_API_KEY'
    },
    {
        id: 'anthropic/claude-sonnet-4-5',
        name: 'Claude Sonnet 4.5',
        provider: 'Anthropic',
        envVar: 'ANTHROPIC_API_KEY'
    },
    {
        id: 'openai/gpt-5.1-codex',
        name: 'GPT-5.1 Codex',
        provider: 'OpenAI',
        envVar: 'OPENAI_API_KEY'
    },
    {
        id: 'google/gemini-3-pro-preview',
        name: 'Gemini 3 Pro',
        provider: 'Google',
        envVar: 'GEMINI_API_KEY'
    },
    {
        id: 'openrouter/anthropic/claude-sonnet-4-5',
        name: 'Claude Sonnet 4.5 (OpenRouter)',
        provider: 'OpenRouter',
        envVar: 'OPENROUTER_API_KEY'
    },
    {
        id: 'openrouter/anthropic/claude-opus-4-6',
        name: 'Claude Opus 4.6 (OpenRouter)',
        provider: 'OpenRouter',
        envVar: 'OPENROUTER_API_KEY'
    },
    {
        id: 'xai/grok-3',
        name: 'Grok 3',
        provider: 'xAI',
        envVar: 'XAI_API_KEY'
    },
    {
        id: 'groq/llama-4-maverick-17b-128e-instruct',
        name: 'Llama 4 Maverick (Groq)',
        provider: 'Groq',
        envVar: 'GROQ_API_KEY'
    },
    {
        id: 'mistral/mistral-large-latest',
        name: 'Mistral Large',
        provider: 'Mistral',
        envVar: 'MISTRAL_API_KEY'
    },
    {
        id: 'cerebras/llama-4-scout-17b-16e-instruct',
        name: 'Llama 4 Scout (Cerebras)',
        provider: 'Cerebras',
        envVar: 'CEREBRAS_API_KEY'
    }
]

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
    const [activeTab, setActiveTab] =
        useState<PlaygroundAgentDetailTab>('configuration')
    const [selectedModel, setSelectedModel] = useState<string>('')
    const [envVars, setEnvVars] = useState<
        Array<{ key: string; value: string }>
    >([])
    const [hasChanges, setHasChanges] = useState(false)
    const { showToast } = useUIStore()
    const queryClient = useQueryClient()

    const {
        data: configData,
        isLoading: isConfigLoading,
        isError: isConfigError
    } = useQuery({
        queryKey: ['agent-config', clawId, agent.id],
        queryFn: () => api.getClawAgentConfig(clawId, agent.id),
        staleTime: 30000,
        gcTime: 60000,
        retry: 1
    })

    useEffect(() => {
        if (configData) {
            const model =
                configData.agent.model || configData.defaultModel || ''
            setSelectedModel(model)

            const vars = Object.entries(configData.envVars)
                .filter(
                    ([key]) => key.includes('API_KEY') || key.includes('TOKEN')
                )
                .map(([key, value]) => ({ key, value }))

            if (vars.length === 0) {
                const modelOption = AGENT_MODELS.find((m) => m.id === model)
                if (modelOption) {
                    vars.push({
                        key: modelOption.envVar,
                        value: configData.envVars[modelOption.envVar] || ''
                    })
                }
            }

            setEnvVars(vars)
            setHasChanges(false)
        }
    }, [configData])

    const saveMutation = useMutation({
        mutationFn: () => {
            const envVarsObj: Record<string, string> = {}
            envVars.forEach(({ key, value }) => {
                if (key.trim()) {
                    envVarsObj[key.trim()] = value
                }
            })

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
        },
        onError: () => {
            showToast(t('playground.configurationSaveFailed'), 'error')
        }
    })

    const handleModelChange = useCallback(
        (model: string) => {
            setSelectedModel(model)
            setHasChanges(true)

            const modelOption = AGENT_MODELS.find((m) => m.id === model)
            if (modelOption) {
                const hasEnvVar = envVars.some(
                    (v) => v.key === modelOption.envVar
                )
                if (!hasEnvVar) {
                    setEnvVars((prev) => [
                        ...prev,
                        { key: modelOption.envVar, value: '' }
                    ])
                }
            }
        },
        [envVars]
    )

    const handleAddEnvVar = useCallback(() => {
        setEnvVars((prev) => [...prev, { key: '', value: '' }])
        setHasChanges(true)
    }, [])

    const handleRemoveEnvVar = useCallback((index: number) => {
        setEnvVars((prev) => prev.filter((_, i) => i !== index))
        setHasChanges(true)
    }, [])

    const handleEnvVarChange = useCallback(
        (index: number, field: 'key' | 'value', val: string) => {
            setEnvVars((prev) =>
                prev.map((v, i) => (i === index ? { ...v, [field]: val } : v))
            )
            setHasChanges(true)
        },
        []
    )

    return (
        <div className='animate-in slide-in-from-right h-full w-[380px] shrink-0 overflow-hidden duration-200'>
            <div className='flex h-full w-[380px] flex-col border-l border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl'>
                <div className='flex items-center justify-between border-b border-white/10 px-5 py-4'>
                    <div className='flex items-center gap-3'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-white/5'>
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
                                <div className='flex items-center justify-center gap-2 py-12'>
                                    <CircleNotch className='h-4 w-4 animate-spin text-gray-400' />
                                    <span className='text-xs text-gray-500'>
                                        {t('playground.configurationLoading')}
                                    </span>
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
                                        <select
                                            value={selectedModel}
                                            onChange={(e) =>
                                                handleModelChange(
                                                    e.target.value
                                                )
                                            }
                                            className='w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#ef5350]/50'
                                        >
                                            <option value=''>
                                                {t(
                                                    'playground.configurationModelPlaceholder'
                                                )}
                                            </option>
                                            {AGENT_MODELS.map((model) => (
                                                <option
                                                    key={model.id}
                                                    value={model.id}
                                                >
                                                    {model.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className='mt-1.5 text-[11px] text-gray-600'>
                                            {t(
                                                'playground.configurationModelDescription'
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <div className='mb-2 flex items-center justify-between'>
                                            <label className='text-xs font-medium text-gray-400'>
                                                {t(
                                                    'playground.configurationEnvVars'
                                                )}
                                            </label>
                                            <button
                                                onClick={handleAddEnvVar}
                                                className='flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-gray-400 transition-colors hover:bg-white/5 hover:text-white'
                                            >
                                                <Plus
                                                    className='h-3 w-3'
                                                    weight='bold'
                                                />
                                                {t(
                                                    'playground.configurationAddEnvVar'
                                                )}
                                            </button>
                                        </div>
                                        <p className='mb-3 text-[11px] text-gray-600'>
                                            {t(
                                                'playground.configurationEnvVarsDescription'
                                            )}
                                        </p>

                                        <div className='space-y-2'>
                                            {envVars.map((envVar, index) => (
                                                <div
                                                    key={index}
                                                    className='flex items-center gap-1.5'
                                                >
                                                    <input
                                                        type='text'
                                                        value={envVar.key}
                                                        onChange={(e) =>
                                                            handleEnvVarChange(
                                                                index,
                                                                'key',
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder={t(
                                                            'playground.configurationKeyPlaceholder'
                                                        )}
                                                        className='w-[140px] shrink-0 rounded-md border border-white/10 bg-white/5 px-2 py-1.5 font-mono text-[11px] text-white outline-none transition-colors placeholder:text-gray-600 focus:border-[#ef5350]/50'
                                                    />
                                                    <input
                                                        type='password'
                                                        value={envVar.value}
                                                        onChange={(e) =>
                                                            handleEnvVarChange(
                                                                index,
                                                                'value',
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder={t(
                                                            'playground.configurationValuePlaceholder'
                                                        )}
                                                        className='min-w-0 flex-1 rounded-md border border-white/10 bg-white/5 px-2 py-1.5 font-mono text-[11px] text-white outline-none transition-colors placeholder:text-gray-600 focus:border-[#ef5350]/50'
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveEnvVar(
                                                                index
                                                            )
                                                        }
                                                        className='shrink-0 rounded-md p-1.5 text-gray-500 transition-colors hover:bg-white/5 hover:text-red-400'
                                                    >
                                                        <Trash className='h-3 w-3' />
                                                    </button>
                                                </div>
                                            ))}

                                            {envVars.length === 0 && (
                                                <button
                                                    onClick={handleAddEnvVar}
                                                    className='flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/10 py-3 text-[11px] text-gray-500 transition-colors hover:border-white/20 hover:text-gray-400'
                                                >
                                                    <Plus className='h-3 w-3' />
                                                    {t(
                                                        'playground.configurationAddEnvVar'
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>

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
                                            <>
                                                <FloppyDisk
                                                    className='h-4 w-4'
                                                    weight='bold'
                                                />
                                                {t(
                                                    'playground.configurationSave'
                                                )}
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PlaygroundAgentDetailPanel