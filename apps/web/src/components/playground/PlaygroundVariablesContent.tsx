import type { FC, ReactNode } from 'react'
import type { PlaygroundVariablesContentProps } from '@/ts/Interfaces'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from '@openclaw/i18n'
import {
    CircleNotch,
    Plus,
    Trash,
    Eye,
    EyeSlash,
    Copy,
    Check,
    Key,
    Info
} from '@phosphor-icons/react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    Button,
    Skeleton,
    Checkbox
} from '@/components/ui'
import { api } from '@/lib'
import { useUIStore } from '@/lib/store'
import { PanelPlaceholder } from '@/components'
import { PLAYGROUND_AGENTS_QUERY_KEY } from '@/hooks'

let skipDeleteConfirmation = false

const PlaygroundVariablesContent: FC<PlaygroundVariablesContentProps> = ({
    clawId,
    mockEnvVars
}): ReactNode => {
    const [envVars, setEnvVars] = useState<
        Array<{ key: string; value: string }>
    >([])
    const [hasChanges, setHasChanges] = useState(false)
    const [showValues, setShowValues] = useState<Record<string, boolean>>({})
    const [copiedKey, setCopiedKey] = useState<string | null>(null)
    const [showErrors, setShowErrors] = useState(false)
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
    const [dontAskAgain, setDontAskAgain] = useState(false)
    const { showToast } = useUIStore()
    const queryClient = useQueryClient()

    const ENV_KEY_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/

    const errors = useMemo(() => {
        const result: Array<{ key: string | null; value: string | null }> = []
        const seenKeys = new Set<string>()
        envVars.forEach((envVar) => {
            const keyTrimmed = envVar.key.trim()
            let keyError: string | null = null
            let valueError: string | null = null

            if (!keyTrimmed || !ENV_KEY_REGEX.test(keyTrimmed)) {
                keyError = t('playground.variablesInvalidKey')
            } else if (seenKeys.has(keyTrimmed)) {
                keyError = t('playground.variablesDuplicateKey')
            }

            if (!envVar.value) {
                valueError = t('playground.variablesEmptyValue')
            }

            if (keyTrimmed) seenKeys.add(keyTrimmed)
            result.push({ key: keyError, value: valueError })
        })
        return result
    }, [envVars])

    const hasErrors = useMemo(
        () => errors.some((e) => e.key || e.value),
        [errors]
    )

    const {
        data: queryEnvData,
        isLoading: queryIsLoading,
        isError: queryIsError
    } = useQuery({
        queryKey: ['claw-env', clawId],
        queryFn: () => api.getClawEnvVars(clawId),
        staleTime: 0,
        gcTime: 0,
        retry: 1,
        enabled: !mockEnvVars
    })

    const envData = mockEnvVars ? { envVars: mockEnvVars } : queryEnvData
    const isLoading = mockEnvVars ? false : queryIsLoading
    const isError = mockEnvVars ? false : queryIsError

    useEffect(() => {
        if (envData) {
            const vars = Object.entries(envData.envVars).map(
                ([key, value]) => ({ key, value })
            )
            setEnvVars(vars)
            setHasChanges(false)
            setShowErrors(false)
        }
    }, [envData])

    const invalidateQueries = useCallback(() => {
        queryClient.invalidateQueries({
            queryKey: ['claw-env', clawId]
        })
        queryClient.invalidateQueries({
            queryKey: [PLAYGROUND_AGENTS_QUERY_KEY, clawId]
        })
        queryClient.invalidateQueries({
            queryKey: ['agent-config', clawId]
        })
    }, [queryClient, clawId])

    const saveMutation = useMutation({
        mutationFn: () => {
            const envVarsObj: Record<string, string> = {}
            envVars.forEach(({ key, value }) => {
                if (key.trim()) {
                    envVarsObj[key.trim()] = value
                }
            })
            return api.updateClawEnvVars(clawId, { envVars: envVarsObj })
        },
        onSuccess: () => {
            showToast(t('playground.variablesSaved'), 'success')
            setHasChanges(false)
            invalidateQueries()
        },
        onError: () => {
            showToast(t('playground.variablesSaveFailed'), 'error')
        }
    })

    const deleteMutation = useMutation({
        mutationFn: (remaining: Array<{ key: string; value: string }>) => {
            const envVarsObj: Record<string, string> = {}
            remaining.forEach(({ key, value }) => {
                if (key.trim()) {
                    envVarsObj[key.trim()] = value
                }
            })
            return api.updateClawEnvVars(clawId, { envVars: envVarsObj })
        },
        onSuccess: () => {
            showToast(t('playground.variablesDeleted'), 'success')
            invalidateQueries()
        },
        onError: () => {
            showToast(t('playground.variablesSaveFailed'), 'error')
        }
    })

    const executeDelete = useCallback(
        (index: number) => {
            const remaining = envVars.filter((_, i) => i !== index)
            setEnvVars(remaining)
            deleteMutation.mutate(remaining)
        },
        [envVars, deleteMutation]
    )

    const handleRemoveVar = useCallback(
        (index: number) => {
            if (skipDeleteConfirmation) {
                executeDelete(index)
            } else {
                setDeleteIndex(index)
                setDontAskAgain(false)
            }
        },
        [executeDelete]
    )

    const handleConfirmDelete = useCallback(() => {
        if (dontAskAgain) {
            skipDeleteConfirmation = true
        }
        if (deleteIndex !== null) {
            executeDelete(deleteIndex)
        }
        setDeleteIndex(null)
    }, [dontAskAgain, deleteIndex, executeDelete])

    const handleAddVar = useCallback(() => {
        setEnvVars((prev) => [...prev, { key: '', value: '' }])
        setHasChanges(true)
        setShowErrors(false)
    }, [])

    const handleVarChange = useCallback(
        (index: number, field: 'key' | 'value', val: string) => {
            setEnvVars((prev) =>
                prev.map((v, i) => (i === index ? { ...v, [field]: val } : v))
            )
            setHasChanges(true)
        },
        []
    )

    const handleToggleVisibility = useCallback((key: string) => {
        setShowValues((prev) => ({ ...prev, [key]: !prev[key] }))
    }, [])

    const handleCopyValue = useCallback((key: string, value: string) => {
        navigator.clipboard.writeText(value)
        setCopiedKey(key)
        setTimeout(() => setCopiedKey(null), 2000)
    }, [])

    if (isLoading) {
        return (
            <div className='space-y-2 p-5'>
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className='rounded-lg border border-white/10 bg-white/5 p-3'
                    >
                        <div className='mb-2 flex items-center justify-between'>
                            <Skeleton className='h-4 w-32' />
                            <div className='flex items-center gap-1'>
                                <Skeleton className='h-5 w-5 rounded' />
                                <Skeleton className='h-5 w-5 rounded' />
                                <Skeleton className='h-5 w-5 rounded' />
                            </div>
                        </div>
                        <Skeleton className='h-7 w-full rounded-md' />
                    </div>
                ))}
            </div>
        )
    }

    if (isError) {
        return (
            <PanelPlaceholder
                icon={
                    <Key className='h-6 w-6 text-gray-500' weight='duotone' />
                }
                title={t('playground.variablesLoadFailed')}
                description={t('playground.variablesLoadFailedDescription')}
            />
        )
    }

    return (
        <div className='flex h-full flex-col overflow-y-auto p-5'>
            <div className='flex min-h-0 flex-1 flex-col space-y-3'>
                <div className='space-y-2'>
                    {envVars.map((envVar, index) => {
                        const keyError =
                            showErrors && errors[index]?.key
                                ? errors[index].key
                                : null
                        const valueError =
                            showErrors && errors[index]?.value
                                ? errors[index].value
                                : null

                        return (
                            <div
                                key={index}
                                className={`rounded-lg border bg-white/5 p-3 ${
                                    keyError || valueError
                                        ? 'border-red-500/40'
                                        : 'border-white/10'
                                }`}
                            >
                                <div className='mb-2 flex items-center justify-between'>
                                    <input
                                        type='text'
                                        value={envVar.key}
                                        onChange={(e) =>
                                            handleVarChange(
                                                index,
                                                'key',
                                                e.target.value
                                            )
                                        }
                                        placeholder={t(
                                            'playground.configurationKeyPlaceholder'
                                        )}
                                        className={`bg-transparent font-mono text-xs font-medium outline-none placeholder:text-gray-600 ${
                                            keyError
                                                ? 'text-red-400'
                                                : 'text-gray-200'
                                        }`}
                                    />
                                    <div className='flex items-center gap-1'>
                                        <button
                                            type='button'
                                            onClick={() =>
                                                handleToggleVisibility(
                                                    `${index}-${envVar.key}`
                                                )
                                            }
                                            className='rounded p-1 text-gray-500 transition-colors hover:text-gray-300'
                                        >
                                            {showValues[
                                                `${index}-${envVar.key}`
                                            ] ? (
                                                <EyeSlash className='h-3.5 w-3.5' />
                                            ) : (
                                                <Eye className='h-3.5 w-3.5' />
                                            )}
                                        </button>
                                        {envVar.value && (
                                            <button
                                                type='button'
                                                onClick={() =>
                                                    handleCopyValue(
                                                        `${index}-${envVar.key}`,
                                                        envVar.value
                                                    )
                                                }
                                                className='rounded p-1 text-gray-500 transition-colors hover:text-gray-300'
                                            >
                                                {copiedKey ===
                                                `${index}-${envVar.key}` ? (
                                                    <Check className='h-3.5 w-3.5 text-green-400' />
                                                ) : (
                                                    <Copy className='h-3.5 w-3.5' />
                                                )}
                                            </button>
                                        )}
                                        <button
                                            type='button'
                                            onClick={() =>
                                                handleRemoveVar(index)
                                            }
                                            disabled={saveMutation.isPending}
                                            className='rounded p-1 text-gray-500 transition-colors disabled:cursor-default disabled:opacity-50 [&:not(:disabled)]:hover:text-red-400'
                                        >
                                            <Trash className='h-3.5 w-3.5' />
                                        </button>
                                    </div>
                                </div>
                                <input
                                    type={
                                        showValues[`${index}-${envVar.key}`]
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={envVar.value}
                                    onChange={(e) =>
                                        handleVarChange(
                                            index,
                                            'value',
                                            e.target.value
                                        )
                                    }
                                    placeholder={t(
                                        'playground.configurationValuePlaceholder'
                                    )}
                                    className={`w-full rounded-md border bg-white/5 px-2.5 py-1.5 font-mono text-xs text-white outline-none transition-colors placeholder:text-gray-600 focus:border-[#ef5350]/50 ${
                                        valueError
                                            ? 'border-red-500/40'
                                            : 'border-white/10'
                                    }`}
                                />
                                {(keyError || valueError) && (
                                    <p className='mt-1.5 text-[10px] text-red-400'>
                                        {keyError || valueError}
                                    </p>
                                )}
                            </div>
                        )
                    })}
                </div>

                {envVars.length === 0 ? (
                    <div className='flex flex-1 flex-col items-center justify-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-white/5'>
                            <Key
                                className='h-5 w-5 text-gray-500'
                                weight='duotone'
                            />
                        </div>
                        <p className='text-xs text-gray-500'>
                            {t('playground.variablesEmpty')}
                        </p>
                        <button
                            onClick={handleAddVar}
                            className='rounded-lg border border-dashed border-white/10 px-4 py-2 text-[11px] text-gray-500 transition-colors hover:border-white/20 hover:text-gray-400'
                        >
                            {t('playground.variablesAddVariable')}
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleAddVar}
                        disabled={saveMutation.isPending}
                        className='flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-white/10 py-2 text-[11px] text-gray-500 transition-colors hover:border-white/20 hover:text-gray-400 disabled:cursor-default disabled:opacity-50'
                    >
                        <Plus className='h-3 w-3' />
                        {t('playground.variablesAddVariable')}
                    </button>
                )}

                {hasChanges && envVars.length > 0 && (
                    <button
                        onClick={() => {
                            setShowErrors(true)
                            if (!hasErrors) saveMutation.mutate()
                        }}
                        disabled={
                            saveMutation.isPending || (showErrors && hasErrors)
                        }
                        className='flex w-full items-center justify-center gap-2 rounded-lg bg-[#ef5350] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#e53935] disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        {saveMutation.isPending ? (
                            <>
                                <CircleNotch className='h-4 w-4 animate-spin' />
                                {t('playground.variablesSaving')}
                            </>
                        ) : (
                            t('playground.variablesSave')
                        )}
                    </button>
                )}

                {envVars.length > 0 && (
                    <div className='flex items-start gap-2 pt-1'>
                        <Info className='mt-0.5 h-3 w-3 shrink-0 text-gray-600' />
                        <p className='text-[11px] text-gray-600'>
                            {t('playground.variablesDescription')}
                        </p>
                    </div>
                )}
            </div>

            <Dialog
                open={deleteIndex !== null}
                onOpenChange={(open) => {
                    if (!open) setDeleteIndex(null)
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {t('playground.variablesDeleteTitle')}
                        </DialogTitle>
                        <DialogDescription>
                            {t('playground.variablesDeleteDescription', {
                                key:
                                    deleteIndex !== null
                                        ? envVars[deleteIndex]?.key ||
                                          t(
                                              'playground.configurationKeyPlaceholder'
                                          )
                                        : ''
                            })}
                        </DialogDescription>
                    </DialogHeader>
                    <label className='mt-3 flex cursor-pointer items-center gap-2.5'>
                        <Checkbox
                            checked={dontAskAgain}
                            onCheckedChange={(checked) => setDontAskAgain(!!checked)}
                        />
                        <span className='text-xs text-gray-400'>
                            {t('playground.variablesDontAskAgain')}
                        </span>
                    </label>
                    <div className='mt-4 flex justify-end gap-3'>
                        <Button
                            variant='outline'
                            onClick={() => setDeleteIndex(null)}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant='destructive'
                            onClick={handleConfirmDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {t('playground.variablesDeleteConfirm')}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PlaygroundVariablesContent