import type { FC, ReactNode } from 'react'
import type { ClawConfigDialogProps } from '@/ts/Interfaces'

import { useState, useEffect } from 'react'
import { t } from '@openclaw/i18n'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { CircleNotch, FloppyDisk, Warning } from '@phosphor-icons/react'
import { Skeleton } from '@/components/ui/skeleton'
import { useQueryClient } from '@tanstack/react-query'
import { useClawConfig, useUpdateClawConfig } from '@/hooks'
import useUIStore from '@/lib/store/useUIStore'

const ClawConfigDialog: FC<ClawConfigDialogProps> = ({
    clawId,
    open,
    onOpenChange
}): ReactNode => {
    const queryClient = useQueryClient()
    const config = useClawConfig(clawId, open)
    const updateConfig = useUpdateClawConfig()
    const showToast = useUIStore((s) => s.showToast)
    const [editedConfig, setEditedConfig] = useState('')
    const [jsonError, setJsonError] = useState(false)

    useEffect(() => {
        if (config.data?.config) {
            try {
                const parsed = JSON.parse(config.data.config)
                setEditedConfig(JSON.stringify(parsed, null, 4))
            } catch {
                setEditedConfig(config.data.config)
            }
            setJsonError(false)
        }
    }, [config.data])

    const handleOpen = (isOpen: boolean) => {
        if (!isOpen) {
            setEditedConfig('')
            setJsonError(false)
            updateConfig.reset()
            queryClient.removeQueries({
                queryKey: ['claw-config', clawId]
            })
        }
        onOpenChange(isOpen)
    }

    const handleChange = (value: string) => {
        setEditedConfig(value)
        try {
            JSON.parse(value)
            setJsonError(false)
        } catch {
            setJsonError(true)
        }
    }

    const handleSave = () => {
        if (jsonError) return

        try {
            const minified = JSON.stringify(JSON.parse(editedConfig))
            updateConfig.mutate(
                { id: clawId, data: { config: minified } },
                {
                    onSuccess: () => {
                        showToast(
                            t('dashboard.configSaveSuccess'),
                            'success'
                        )
                    },
                    onError: (err) => {
                        showToast(
                            err.message || t('api.failedToUpdateConfig'),
                            'error'
                        )
                    }
                }
            )
        } catch {
            setJsonError(true)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogContent className='flex max-h-[80vh] max-w-2xl flex-col'>
                <DialogHeader>
                    <DialogTitle>
                        {t('dashboard.configuration')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('dashboard.configurationDescription')}
                    </DialogDescription>
                </DialogHeader>

                <div className='mt-4 flex flex-1 flex-col gap-3 overflow-hidden'>
                    <div className='flex items-start gap-2 rounded-md bg-yellow-950/50 p-3 text-sm text-yellow-400'>
                        <Warning className='mt-0.5 h-4 w-4 shrink-0' />
                        {t('dashboard.configWarning')}
                    </div>
                    {config.isPending && (
                        <Skeleton className='h-[400px] w-full rounded-md border border-zinc-800' />
                    )}
                    {config.isError && (
                        <div className='text-sm text-red-400'>
                            {config.error?.message ||
                                t('api.failedToGetConfig')}
                        </div>
                    )}
                    {config.data && (
                        <>
                            <textarea
                                value={editedConfig}
                                onChange={(e) => handleChange(e.target.value)}
                                spellCheck={false}
                                className={`h-[400px] w-full resize-none rounded-md border bg-black p-3 font-mono text-xs leading-snug text-zinc-300 focus:outline-none ${
                                    jsonError
                                        ? 'border-red-500/50 focus:border-red-500'
                                        : 'border-zinc-800 focus:border-zinc-600'
                                }`}
                            />
                            {jsonError && (
                                <p className='text-xs text-red-400'>
                                    {t('dashboard.configInvalidJson')}
                                </p>
                            )}
                            <div className='flex justify-end'>
                                <Button
                                    onClick={handleSave}
                                    disabled={
                                        jsonError || updateConfig.isPending
                                    }
                                    size='sm'
                                >
                                    {updateConfig.isPending ? (
                                        <>
                                            <CircleNotch className='mr-2 h-3.5 w-3.5 animate-spin' />
                                            {t('dashboard.configSaving')}
                                        </>
                                    ) : (
                                        <>
                                            <FloppyDisk className='mr-2 h-3.5 w-3.5' />
                                            {t('dashboard.configSave')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ClawConfigDialog