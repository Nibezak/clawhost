import type { FC, ReactNode } from 'react'
import type {
    AgentConfigResponse,
    ClawAgentsResponse,
    PlaygroundAgentDetailPanelProps,
    PlaygroundTabConfig
} from '@/ts/Interfaces'
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
    Eye,
    EyeSlash,
    Copy,
    Check,
    Trash
} from '@phosphor-icons/react'
import AgentChat from '@/components/playground/AgentChat'
import ClawAvatar from '@/components/ClawAvatar'
import PanelPlaceholder from '@/components/PanelPlaceholder'
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectGroup
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { useUIStore } from '@/lib/store'
import { aiModels, validateAgentName } from '@/lib/claw-utils'
import PLAYGROUND_AGENTS_QUERY_KEY from '@/hooks/usePlayground/PLAYGROUND_AGENTS_QUERY_KEY'

const agentTabStateMap: Record<string, PlaygroundAgentDetailTab> = {}
const deletingAgentIds = new Set<string>()
let skipAgentDeleteConfirmation = false

const tabs: PlaygroundTabConfig<PlaygroundAgentDetailTab>[] = [
    { id: 'chat', label: 'playground.tabChat', icon: ChatCircle },
    { id: 'configuration', label: 'playground.tabConfiguration', icon: GearSix }
]

const PlaygroundAgentDetailPanel: FC<PlaygroundAgentDetailPanelProps> = ({
    agent,
    clawId,
    clawName,
    isOnlyAgent,
    onClose,
    readOnly,
    gatewayToken,
    subdomain
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
    const [agentName, setAgentName] = useState('')
    const [nameError, setNameError] = useState<TranslationKey | null>(null)
    const [selectedModel, setSelectedModel] = useState<string>('')
    const [apiKeyValue, setApiKeyValue] = useState('')
    const [hasChanges, setHasChanges] = useState(false)
    const [showApiKey, setShowApiKey] = useState(false)
    const [copied, setCopied] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [dontAskAgain, setDontAskAgain] = useState(false)
    const [, setDeleteRenderKey] = useState(0)
    const { showToast } = useUIStore()
    const queryClient = useQueryClient()
    const isDeleting = deletingAgentIds.has(agent.id)

    const existingAgentNames = useMemo(() => {
        const cached = queryClient.getQueryData<ClawAgentsResponse>([
            PLAYGROUND_AGENTS_QUERY_KEY,
            clawId
        ])
        return cached?.agents.map((a) => a.name) || []
    }, [queryClient, clawId])

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

    const mockConfigData: AgentConfigResponse | undefined = readOnly
        ? {
              agent: {
                  id: agent.id,
                  name: agent.name,
                  model: agent.model
              },
              envVars: agent.model
                  ? {
                        [aiModels.find((m) => m.id === agent.model)?.envVar ||
                        '']: 'sk-••••••••'
                    }
                  : {},
              defaultModel: agent.model
          }
        : undefined

    const {
        data: queryConfigData,
        isLoading: isConfigLoading,
        isError: isConfigError
    } = useQuery({
        queryKey: ['agent-config', clawId, agent.id],
        queryFn: () => api.getClawAgentConfig(clawId, agent.id),
        enabled: activeTab === 'configuration' && !readOnly,
        staleTime: 0,
        gcTime: 0,
        retry: 1
    })

    const configData = readOnly ? mockConfigData : queryConfigData

    useEffect(() => {
        if (activeTab !== 'configuration') {
            queryClient.removeQueries({
                queryKey: ['agent-config', clawId, agent.id]
            })
        }
    }, [activeTab, queryClient, clawId, agent.id])

    useEffect(() => {
        if (configData) {
            setAgentName(configData.agent.name || agent.name)
            setNameError(null)

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
    }, [configData, agent.name])

    const saveMutation = useMutation({
        mutationFn: () => {
            const envVarsObj: Record<string, string> = {}
            if (selectedModelOption && apiKeyValue) {
                envVarsObj[selectedModelOption.envVar] = apiKeyValue
            }

            const nameChanged = agentName !== agent.name

            return api.updateClawAgentConfig(clawId, {
                agentId: agent.id,
                name: nameChanged ? agentName : undefined,
                model: selectedModel || null,
                envVars: envVarsObj
            })
        },
        onSuccess: () => {
            showToast(t('playground.configurationSaved'), 'success')
            setHasChanges(false)

            const newName = agentName
            queryClient.setQueryData<ClawAgentsResponse>(
                [PLAYGROUND_AGENTS_QUERY_KEY, clawId],
                (old) => {
                    if (!old) return old
                    return {
                        ...old,
                        agents: old.agents.map((a) =>
                            a.id === agent.id
                                ? {
                                      ...a,
                                      name: newName,
                                      model: selectedModel || null
                                  }
                                : a
                        )
                    }
                }
            )

            queryClient.setQueryData<AgentConfigResponse>(
                ['agent-config', clawId, agent.id],
                (old) => {
                    if (!old) return old
                    return {
                        ...old,
                        agent: {
                            ...old.agent,
                            name: newName,
                            model: selectedModel || null
                        }
                    }
                }
            )
            queryClient.invalidateQueries({
                queryKey: ['claw-env', clawId]
            })
        },
        onError: () => {
            showToast(t('playground.configurationSaveFailed'), 'error')
        }
    })

    const executeDelete = useCallback(() => {
        const agentId = agent.id
        deletingAgentIds.add(agentId)
        setShowDeleteConfirm(false)
        setDeleteRenderKey((k) => k + 1)

        api.deleteClawAgent(clawId, { agentId })
            .then(() => {
                showToast(t('playground.deleteAgentSuccess'), 'success')
                queryClient.setQueryData<ClawAgentsResponse>(
                    [PLAYGROUND_AGENTS_QUERY_KEY, clawId],
                    (old) => {
                        if (!old) return old
                        return {
                            ...old,
                            agents: old.agents.filter((a) => a.id !== agentId)
                        }
                    }
                )
                onClose()
            })
            .catch(() => {
                showToast(t('playground.deleteAgentFailed'), 'error')
            })
            .finally(() => {
                deletingAgentIds.delete(agentId)
            })
    }, [agent.id, clawId, showToast, queryClient, onClose])

    const handleDeleteClick = useCallback(() => {
        if (skipAgentDeleteConfirmation) {
            executeDelete()
        } else {
            setShowDeleteConfirm(true)
            setDontAskAgain(false)
        }
    }, [executeDelete])

    const handleConfirmDelete = useCallback(() => {
        if (dontAskAgain) {
            skipAgentDeleteConfirmation = true
        }
        executeDelete()
    }, [dontAskAgain, executeDelete])

    const handleNameChange = useCallback(
        (value: string) => {
            setAgentName(value)
            setHasChanges(true)
            const error = validateAgentName(
                value,
                existingAgentNames,
                agent.name
            )
            setNameError(error)
        },
        [existingAgentNames, agent.name]
    )

    const handleSave = useCallback(() => {
        const error = validateAgentName(
            agentName,
            existingAgentNames,
            agent.name
        )
        if (error) {
            setNameError(error)
            return
        }
        saveMutation.mutate()
    }, [agentName, existingAgentNames, agent.name, saveMutation])

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
                                {agent.name}
                            </h3>
                            <span className='block text-xs leading-tight text-gray-500'>
                                {t('playground.agentOnClaw', { clawName })}
                            </span>
                        </div>
                    </div>
                    <div className='flex items-center gap-1'>
                        {!readOnly && !isOnlyAgent && agent.id !== 'main' && (
                            <button
                                onClick={() =>
                                    !isDeleting && handleDeleteClick()
                                }
                                disabled={isDeleting}
                                className='rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed'
                            >
                                {isDeleting ? (
                                    <CircleNotch className='h-4 w-4 animate-spin text-red-400' />
                                ) : (
                                    <Trash className='h-4 w-4' weight='bold' />
                                )}
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className='rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white'
                        >
                            <X className='h-4 w-4' weight='bold' />
                        </button>
                    </div>
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
                            {tab.id === 'chat' && (
                                <span className='rounded bg-white/10 px-1 py-0.5 text-[9px] font-medium uppercase leading-none text-gray-400'>
                                    {t('common.beta')}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className='flex min-h-0 flex-1 flex-col overflow-hidden'>
                    {activeTab === 'chat' && (
                        <AgentChat
                            agentId={agent.id}
                            clawId={clawId}
                            subdomain={subdomain}
                            gatewayToken={gatewayToken}
                            agentModel={agent.model}
                            readOnly={readOnly}
                        />
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
                                <PanelPlaceholder
                                    icon={
                                        <GearSix
                                            className='h-6 w-6 text-gray-500'
                                            weight='duotone'
                                        />
                                    }
                                    title={t(
                                        'playground.configurationLoadFailed'
                                    )}
                                    description={t(
                                        'playground.configurationLoadFailedDescription'
                                    )}
                                />
                            ) : (
                                <div className='space-y-5'>
                                    <div>
                                        <label className='mb-2 block text-xs font-medium text-gray-400'>
                                            {t('playground.configurationName')}
                                        </label>
                                        <input
                                            type='text'
                                            value={agentName}
                                            onChange={(e) =>
                                                handleNameChange(e.target.value)
                                            }
                                            placeholder={t(
                                                'playground.configurationNamePlaceholder'
                                            )}
                                            className={`w-full rounded-md border bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-[#ef5350]/50 ${
                                                nameError
                                                    ? 'border-red-500/50'
                                                    : 'border-white/10'
                                            }`}
                                        />
                                        {nameError ? (
                                            <p className='mt-1.5 text-[11px] text-red-400'>
                                                {t(nameError)}
                                            </p>
                                        ) : (
                                            <p className='mt-1.5 text-[11px] text-gray-600'>
                                                {t(
                                                    'playground.configurationNameDescription'
                                                )}
                                            </p>
                                        )}
                                    </div>

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
                                                            onClick={
                                                                handleCopyApiKey
                                                            }
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
                                        onClick={handleSave}
                                        disabled={
                                            readOnly ||
                                            saveMutation.isPending ||
                                            !hasChanges ||
                                            !!nameError
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
                                            t('playground.configurationSave')
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Dialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
            >
                <DialogContent className='max-w-sm'>
                    <DialogHeader>
                        <DialogTitle>
                            {t('playground.deleteAgentTitle')}
                        </DialogTitle>
                        <DialogDescription>
                            {t('playground.deleteAgentDescription', {
                                agentName: agent.name
                            })}
                        </DialogDescription>
                    </DialogHeader>
                    <label className='mt-3 flex cursor-pointer items-center gap-2.5'>
                        <button
                            type='button'
                            role='checkbox'
                            aria-checked={dontAskAgain}
                            onClick={() => setDontAskAgain(!dontAskAgain)}
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                dontAskAgain
                                    ? 'border-[#ef5350] bg-[#ef5350]'
                                    : 'border-white/20 bg-white/5 hover:border-white/30'
                            }`}
                        >
                            {dontAskAgain && (
                                <Check
                                    className='h-3 w-3 text-white'
                                    weight='bold'
                                />
                            )}
                        </button>
                        <span className='text-xs text-gray-400'>
                            {t('playground.variablesDontAskAgain')}
                        </span>
                    </label>
                    <div className='mt-4 flex justify-end gap-3'>
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className='rounded-lg px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-white'
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            className='rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700'
                        >
                            {t('playground.deleteAgentConfirm')}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}

export default PlaygroundAgentDetailPanel