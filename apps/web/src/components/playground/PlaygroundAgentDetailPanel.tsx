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
import AGENT_DETAIL_TABS from '@/lib/agentDetailTabs'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from '@openclaw/i18n'
import {
    XIcon,
    ChatCircleIcon,
    GearSixIcon,
    CircleNotchIcon,
    EyeIcon,
    EyeSlashIcon,
    CopyIcon,
    CheckIcon,
    TrashIcon,
    ChatsCircleIcon,
    LightningIcon,
    ArrowsOutIcon,
    ArrowsInIcon
} from '@phosphor-icons/react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui'
import {
    AgentChat,
    PlaygroundChannelsContent,
    PlaygroundSkillsContent
} from '@/components/playground'
import { ClawAvatar, PanelPlaceholder } from '@/components'
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectGroup,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    Skeleton,
    Checkbox
} from '@/components/ui'
import { api } from '@/lib'
import { useUIStore } from '@/lib/store'
import { aiModels, validateAgentName } from '@/lib/claw-utils'
import { PLAYGROUND_AGENTS_QUERY_KEY } from '@/hooks'

const agentTabStateMap: Record<string, PlaygroundAgentDetailTab> = {}
const deletingAgentIds = new Set<string>()
let skipAgentDeleteConfirmation = false

const tabs: PlaygroundTabConfig<PlaygroundAgentDetailTab>[] = [
    {
        id: AGENT_DETAIL_TABS.CHAT,
        label: 'playground.tabChat',
        icon: ChatCircleIcon
    },
    {
        id: AGENT_DETAIL_TABS.CHANNELS,
        label: 'playground.tabChannels',
        icon: ChatsCircleIcon
    },
    {
        id: AGENT_DETAIL_TABS.SKILLS,
        label: 'playground.tabSkills',
        icon: LightningIcon
    },
    {
        id: AGENT_DETAIL_TABS.CONFIGURATION,
        label: 'playground.tabSettings',
        icon: GearSixIcon
    }
]

const PlaygroundAgentDetailPanel: FC<PlaygroundAgentDetailPanelProps> = ({
    agent,
    clawId,
    clawName,
    isOnlyAgent,
    onClose,
    readOnly,
    gatewayToken,
    subdomain,
    initialTab,
    onTabChange,
    hideChatTab
}): ReactNode => {
    const visibleTabs = useMemo(
        () =>
            hideChatTab
                ? tabs.filter((tab) => tab.id !== AGENT_DETAIL_TABS.CHAT)
                : tabs,
        [hideChatTab]
    )
    const defaultTab = hideChatTab
        ? AGENT_DETAIL_TABS.CHANNELS
        : AGENT_DETAIL_TABS.CHAT
    const rawActiveTab = agentTabStateMap[agent.id] || defaultTab
    const activeTab =
        hideChatTab && rawActiveTab === AGENT_DETAIL_TABS.CHAT
            ? AGENT_DETAIL_TABS.CHANNELS
            : rawActiveTab
    const setActiveTab = useCallback(
        (tab: PlaygroundAgentDetailTab) => {
            agentTabStateMap[agent.id] = tab
            setRenderKey((k) => k + 1)
            if (onTabChange) onTabChange(tab)
        },
        [agent.id, onTabChange]
    )

    useEffect(() => {
        if (initialTab && initialTab !== agentTabStateMap[agent.id]) {
            agentTabStateMap[agent.id] = initialTab
            setRenderKey((k) => k + 1)
        }
    }, [initialTab, agent.id])
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
    const [isExpanded, setIsExpanded] = useState(false)
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
        enabled: activeTab === AGENT_DETAIL_TABS.CONFIGURATION && !readOnly,
        staleTime: 0,
        gcTime: 0,
        retry: 1
    })

    const configData = readOnly ? mockConfigData : queryConfigData

    useEffect(() => {
        if (activeTab !== AGENT_DETAIL_TABS.CONFIGURATION) {
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
            className={
                isExpanded
                    ? 'fixed inset-0 z-50 overflow-hidden'
                    : 'fixed inset-0 z-40 overflow-hidden md:relative md:inset-auto md:z-auto md:h-full md:w-[380px] md:shrink-0'
            }
        >
            <div className='bg-background md:border-border md:bg-background/95 flex h-full w-full flex-col md:border-l md:backdrop-blur-xl'>
                <div className='border-border flex items-center justify-between border-b px-5 py-2.5'>
                    <div className='flex items-center gap-2.5'>
                        <ClawAvatar />
                        <div className='space-y-0'>
                            <h3 className='text-foreground text-sm font-semibold leading-tight'>
                                {agent.name}
                            </h3>
                            <span className='text-muted-foreground block text-xs leading-tight'>
                                {t('playground.agentOnClaw', { clawName })}
                            </span>
                        </div>
                    </div>
                    <div className='flex items-center gap-1'>
                        {!hideChatTab &&
                            (activeTab === AGENT_DETAIL_TABS.CHAT ||
                                isExpanded) && (
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className='text-muted-foreground hover:bg-foreground/10 hover:text-foreground rounded-lg p-1.5 transition-colors'
                                >
                                    {isExpanded ? (
                                        <ArrowsInIcon
                                            className='h-4 w-4'
                                            weight='bold'
                                        />
                                    ) : (
                                        <ArrowsOutIcon
                                            className='h-4 w-4'
                                            weight='bold'
                                        />
                                    )}
                                </button>
                            )}
                        {!readOnly &&
                            (agent.id === 'main' || isOnlyAgent ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className='inline-flex'>
                                            <button
                                                disabled
                                                className='text-muted-foreground cursor-not-allowed rounded-lg p-1.5 opacity-50 transition-colors'
                                            >
                                                <TrashIcon
                                                    className='h-4 w-4'
                                                    weight='bold'
                                                />
                                            </button>
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent side='bottom'>
                                        <p>
                                            {t(
                                                'playground.cannotDeleteDefaultAgent'
                                            )}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <button
                                    onClick={() =>
                                        !isDeleting && handleDeleteClick()
                                    }
                                    disabled={isDeleting}
                                    className='text-muted-foreground hover:bg-foreground/10 hover:text-foreground rounded-lg p-1.5 transition-colors disabled:cursor-not-allowed'
                                >
                                    {isDeleting ? (
                                        <CircleNotchIcon className='text-foreground h-4 w-4 animate-spin' />
                                    ) : (
                                        <TrashIcon
                                            className='h-4 w-4'
                                            weight='bold'
                                        />
                                    )}
                                </button>
                            ))}
                        <button
                            onClick={onClose}
                            className='text-muted-foreground hover:bg-foreground/10 hover:text-foreground rounded-lg p-1.5 transition-colors'
                        >
                            <XIcon className='h-4 w-4' weight='bold' />
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {!isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className='overflow-hidden'
                        >
                            <div className='border-border flex border-b'>
                                {visibleTabs.map((tab) => (
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
                                                activeTab === tab.id
                                                    ? 'fill'
                                                    : 'regular'
                                            }
                                        />
                                        {t(tab.label as TranslationKey)}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className='flex min-h-0 flex-1 flex-col overflow-hidden'>
                    {(isExpanded || activeTab === AGENT_DETAIL_TABS.CHAT) && (
                        <AgentChat
                            agentId={agent.id}
                            agentName={agent.name}
                            clawId={clawId}
                            subdomain={subdomain}
                            gatewayToken={gatewayToken}
                            agentModel={agent.model}
                            readOnly={readOnly}
                        />
                    )}

                    {!isExpanded &&
                        activeTab === AGENT_DETAIL_TABS.CHANNELS && (
                            <PlaygroundChannelsContent clawId={clawId} />
                        )}

                    {!isExpanded && activeTab === AGENT_DETAIL_TABS.SKILLS && (
                        <PlaygroundSkillsContent
                            clawId={clawId}
                            agentId={agent.id}
                        />
                    )}

                    {!isExpanded &&
                        activeTab === AGENT_DETAIL_TABS.CONFIGURATION && (
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
                                            <GearSixIcon
                                                className='text-muted-foreground h-6 w-6'
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
                                            <label className='text-muted-foreground mb-2 block text-xs font-medium'>
                                                {t(
                                                    'playground.configurationName'
                                                )}
                                            </label>
                                            <input
                                                type='text'
                                                value={agentName}
                                                onChange={(e) =>
                                                    handleNameChange(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder={t(
                                                    'playground.configurationNamePlaceholder'
                                                )}
                                                className={`bg-foreground/5 text-foreground placeholder:text-muted-foreground w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors focus:border-[#ef5350]/50 ${
                                                    nameError
                                                        ? 'border-red-500/50'
                                                        : 'border-border'
                                                }`}
                                            />
                                            {nameError ? (
                                                <p className='mt-1.5 text-[11px] text-red-600 dark:text-red-400'>
                                                    {t(nameError)}
                                                </p>
                                            ) : (
                                                <p className='text-muted-foreground mt-1.5 text-[11px]'>
                                                    {t(
                                                        'playground.configurationNameDescription'
                                                    )}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className='text-muted-foreground mb-2 block text-xs font-medium'>
                                                {t(
                                                    'playground.configurationModel'
                                                )}
                                            </label>
                                            <Select
                                                value={selectedModel}
                                                onValueChange={
                                                    handleModelChange
                                                }
                                                displayValue={
                                                    selectedModelOption?.name
                                                }
                                            >
                                                <SelectTrigger
                                                    placeholder={t(
                                                        'playground.configurationModelPlaceholder'
                                                    )}
                                                    className='border-border bg-foreground/5 text-foreground h-9 text-sm'
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
                                                                ].map(
                                                                    (model) => (
                                                                        <SelectItem
                                                                            key={
                                                                                model.id
                                                                            }
                                                                            value={
                                                                                model.id
                                                                            }
                                                                        >
                                                                            {
                                                                                model.name
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectGroup>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <p className='text-muted-foreground mt-1.5 text-[11px]'>
                                                {t(
                                                    'playground.configurationModelDescription'
                                                )}
                                            </p>
                                        </div>

                                        {selectedModelOption && (
                                            <div>
                                                <div className='mb-2 flex items-center justify-between'>
                                                    <label className='text-muted-foreground text-xs font-medium'>
                                                        {t(
                                                            'playground.configurationApiKey'
                                                        )}
                                                    </label>
                                                    <div className='flex items-center gap-1'>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <button
                                                                    type='button'
                                                                    onClick={() =>
                                                                        setShowApiKey(
                                                                            !showApiKey
                                                                        )
                                                                    }
                                                                    className='text-muted-foreground hover:text-foreground/80 rounded p-1 transition-colors'
                                                                >
                                                                    {showApiKey ? (
                                                                        <EyeSlashIcon className='h-3.5 w-3.5' />
                                                                    ) : (
                                                                        <EyeIcon className='h-3.5 w-3.5' />
                                                                    )}
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                {showApiKey
                                                                    ? t(
                                                                          'common.hide'
                                                                      )
                                                                    : t(
                                                                          'common.show'
                                                                      )}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        {apiKeyValue && (
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <button
                                                                        type='button'
                                                                        onClick={
                                                                            handleCopyApiKey
                                                                        }
                                                                        className='text-muted-foreground hover:text-foreground/80 rounded p-1 transition-colors'
                                                                    >
                                                                        {copied ? (
                                                                            <CheckIcon className='h-3.5 w-3.5 text-green-600 dark:text-green-400' />
                                                                        ) : (
                                                                            <CopyIcon className='h-3.5 w-3.5' />
                                                                        )}
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    {t(
                                                                        'common.copy'
                                                                    )}
                                                                </TooltipContent>
                                                            </Tooltip>
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
                                                    className='border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground w-full rounded-md border px-3 py-2 font-mono text-[11px] outline-none transition-colors focus:border-[#ef5350]/50'
                                                />
                                                <p className='text-muted-foreground mt-1.5 text-[11px]'>
                                                    <span className='text-muted-foreground font-mono'>
                                                        {
                                                            selectedModelOption.envVar
                                                        }
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
                                                    <CircleNotchIcon className='h-4 w-4 animate-spin' />
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
                        <Checkbox
                            checked={dontAskAgain}
                            onCheckedChange={(checked) =>
                                setDontAskAgain(!!checked)
                            }
                        />
                        <span className='text-muted-foreground text-xs'>
                            {t('playground.variablesDontAskAgain')}
                        </span>
                    </label>
                    <div className='mt-4 flex justify-end gap-3'>
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className='text-muted-foreground hover:text-foreground rounded-lg px-4 py-2 text-sm font-medium transition-colors'
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