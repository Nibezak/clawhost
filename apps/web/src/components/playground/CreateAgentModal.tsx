import type { FC, ReactNode } from 'react'
import type { ClawAgentsResponse, CreateAgentModalProps } from '@/ts/Interfaces'
import type { TranslationKey } from '@openclaw/i18n'

import { useState, useMemo, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from '@openclaw/i18n'
import { CircleNotch, Eye, EyeSlash } from '@phosphor-icons/react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectGroup
} from '@/components/ui/select'
import api from '@/lib/api'
import { useUIStore } from '@/lib/store'
import { aiModels, validateAgentName } from '@/lib/claw-utils'
import PLAYGROUND_AGENTS_QUERY_KEY from '@/hooks/usePlayground/PLAYGROUND_AGENTS_QUERY_KEY'

const CreateAgentModal: FC<CreateAgentModalProps> = ({
    clawId,
    clawName,
    open,
    onOpenChange
}): ReactNode => {
    const [name, setName] = useState('')
    const [nameError, setNameError] = useState<TranslationKey | null>(null)
    const [selectedModel, setSelectedModel] = useState('')
    const [apiKeyValue, setApiKeyValue] = useState('')
    const [showApiKey, setShowApiKey] = useState(false)
    const { showToast } = useUIStore()
    const queryClient = useQueryClient()

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

    const resetForm = useCallback(() => {
        setName('')
        setNameError(null)
        setSelectedModel('')
        setApiKeyValue('')
        setShowApiKey(false)
    }, [])

    const createMutation = useMutation({
        mutationFn: () => {
            const envVarsObj: Record<string, string> = {}
            if (selectedModelOption && apiKeyValue) {
                envVarsObj[selectedModelOption.envVar] = apiKeyValue
            }
            return api.createClawAgent(clawId, {
                name,
                model: selectedModel || null,
                envVars:
                    Object.keys(envVarsObj).length > 0 ? envVarsObj : undefined
            })
        },
        onSuccess: (response) => {
            showToast(t('playground.addAgentSuccess'), 'success')
            queryClient.setQueryData<ClawAgentsResponse>(
                [PLAYGROUND_AGENTS_QUERY_KEY, clawId],
                (old) => {
                    if (!old)
                        return { agents: [response.agent], reachable: true }
                    return {
                        ...old,
                        agents: [...old.agents, response.agent]
                    }
                }
            )
            queryClient.invalidateQueries({
                queryKey: ['claw-env', clawId]
            })
            resetForm()
            onOpenChange(false)
        },
        onError: () => {
            showToast(t('playground.addAgentFailed'), 'error')
        }
    })

    const handleNameChange = useCallback(
        (value: string) => {
            setName(value)
            const error = validateAgentName(value, existingAgentNames)
            setNameError(error)
        },
        [existingAgentNames]
    )

    const handleSubmit = useCallback(() => {
        const error = validateAgentName(name, existingAgentNames)
        if (error) {
            setNameError(error)
            return
        }
        createMutation.mutate()
    }, [name, existingAgentNames, createMutation])

    const handleModelChange = useCallback((model: string) => {
        setSelectedModel(model)
        setApiKeyValue('')
        setShowApiKey(false)
    }, [])

    const handleOpenChange = useCallback(
        (isOpen: boolean) => {
            if (!isOpen) {
                resetForm()
            }
            onOpenChange(isOpen)
        },
        [onOpenChange, resetForm]
    )

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className='flex max-h-[85vh] max-w-lg flex-col gap-0 p-0'>
                <DialogHeader className='p-6 pb-4'>
                    <DialogTitle>{t('playground.addAgentTitle')}</DialogTitle>
                    <DialogDescription>
                        {t('playground.addAgentDescription', { clawName })}
                    </DialogDescription>
                </DialogHeader>

                <div className='flex-1 space-y-5 overflow-y-auto px-6 pb-6'>
                    <div>
                        <label className='mb-2 block text-xs font-medium text-gray-400'>
                            {t('playground.addAgentName')}
                        </label>
                        <input
                            type='text'
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder={t(
                                'playground.addAgentNamePlaceholder'
                            )}
                            className={`w-full rounded-md border bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-[#ef5350]/50 ${
                                nameError
                                    ? 'border-red-500/50'
                                    : 'border-white/10'
                            }`}
                            autoFocus
                        />
                        {nameError && (
                            <p className='mt-1.5 text-[11px] text-red-400'>
                                {t(nameError)}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className='mb-2 block text-xs font-medium text-gray-400'>
                            {t('playground.addAgentModel')}
                        </label>
                        <Select
                            value={selectedModel}
                            onValueChange={handleModelChange}
                            displayValue={selectedModelOption?.name}
                        >
                            <SelectTrigger
                                placeholder={t(
                                    'playground.addAgentModelPlaceholder'
                                )}
                                className='h-9 border-white/10 bg-white/5 text-sm text-white'
                            />
                            <SelectContent className='max-h-[300px] overflow-y-auto'>
                                {providerKeys.map((provider, index) => (
                                    <SelectGroup
                                        key={provider}
                                        label={provider}
                                        isLast={
                                            index === providerKeys.length - 1
                                        }
                                    >
                                        {modelsByProvider[provider].map(
                                            (model) => (
                                                <SelectItem
                                                    key={model.id}
                                                    value={model.id}
                                                >
                                                    {model.name}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectGroup>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedModelOption && (
                        <div>
                            <div className='mb-2 flex items-center justify-between'>
                                <label className='text-xs font-medium text-gray-400'>
                                    {t('playground.addAgentApiKey')}
                                </label>
                                <button
                                    type='button'
                                    onClick={() => setShowApiKey(!showApiKey)}
                                    className='rounded p-1 text-gray-500 transition-colors hover:text-gray-300'
                                >
                                    {showApiKey ? (
                                        <EyeSlash className='h-3.5 w-3.5' />
                                    ) : (
                                        <Eye className='h-3.5 w-3.5' />
                                    )}
                                </button>
                            </div>
                            <input
                                type={showApiKey ? 'text' : 'password'}
                                value={apiKeyValue}
                                onChange={(e) => setApiKeyValue(e.target.value)}
                                placeholder={t(
                                    'playground.addAgentApiKeyPlaceholder'
                                )}
                                className='w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 font-mono text-[11px] text-white outline-none transition-colors placeholder:text-gray-600 focus:border-[#ef5350]/50'
                            />
                            <p className='mt-1.5 text-[11px] text-gray-600'>
                                <span className='font-mono text-gray-500'>
                                    {selectedModelOption.envVar}
                                </span>
                            </p>
                        </div>
                    )}
                </div>

                <div className='flex justify-end gap-3 border-t border-white/10 px-6 py-4'>
                    <button
                        onClick={() => handleOpenChange(false)}
                        className='rounded-lg px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-white'
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={
                            !name.trim() ||
                            !!nameError ||
                            createMutation.isPending
                        }
                        className='flex items-center gap-2 rounded-lg bg-[#ef5350] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#e53935] disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        {createMutation.isPending ? (
                            <>
                                <CircleNotch className='h-4 w-4 animate-spin' />
                                {t('playground.addAgentSubmitting')}
                            </>
                        ) : (
                            t('playground.addAgentSubmit')
                        )}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateAgentModal