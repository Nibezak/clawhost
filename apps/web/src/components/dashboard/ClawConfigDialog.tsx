import type { FC, ReactNode } from 'react'
import type { ClawConfigDialogProps } from '@/ts/Interfaces'

import { useState, useEffect, useCallback } from 'react'
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
import CodeMirror, { EditorView } from '@uiw/react-codemirror'
import { createTheme } from '@uiw/codemirror-themes'
import { tags } from '@lezer/highlight'
import { json } from '@codemirror/lang-json'

const editorTheme = createTheme({
    theme: 'dark',
    settings: {
        background: '#000000',
        foreground: '#d4d4d8',
        caret: '#d4d4d8',
        selection: '#264f78',
        selectionMatch: '#264f7844',
        lineHighlight: '#ffffff08',
        gutterBackground: '#000000',
        gutterForeground: '#525252'
    },
    styles: [
        { tag: tags.propertyName, color: '#93c5fd' },
        { tag: tags.string, color: '#86efac' },
        { tag: tags.number, color: '#fde68a' },
        { tag: tags.bool, color: '#f9a8d4' },
        { tag: tags.null, color: '#a78bfa' },
        { tag: tags.punctuation, color: '#a1a1aa' }
    ]
})

const editorStyles = EditorView.theme({
    '&': { fontSize: '12px' },
    '.cm-gutters': { borderRight: 'none' }
})

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

    const handleChange = useCallback((value: string) => {
        setEditedConfig(value)
        try {
            JSON.parse(value)
            setJsonError(false)
        } catch {
            setJsonError(true)
        }
    }, [])

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
                            <div className={`overflow-hidden rounded-md border ${
                                jsonError
                                    ? 'border-red-500/50'
                                    : 'border-zinc-800'
                            }`}>
                                <CodeMirror
                                    value={editedConfig}
                                    onChange={handleChange}
                                    extensions={[json(), editorStyles]}
                                    theme={editorTheme}
                                    height='400px'
                                    basicSetup={{
                                        lineNumbers: true,
                                        foldGutter: true,
                                        bracketMatching: true,
                                        closeBrackets: true,
                                        highlightActiveLine: true,
                                        indentOnInput: true
                                    }}
                                />
                            </div>
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