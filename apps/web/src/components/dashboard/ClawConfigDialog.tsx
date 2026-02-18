import type { FC, ReactNode } from 'react'
import type { ClawFileExplorerDialogProps } from '@/ts/Interfaces'

import { useState, useCallback } from 'react'
import { t } from '@openclaw/i18n'
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    Skeleton
} from '@/components/ui'
import {
    CircleNotchIcon,
    FloppyDiskIcon,
    WarningIcon,
    FileIcon,
    FileJsIcon,
    FolderOpenIcon,
    XIcon
} from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { useClawFiles, useClawFile, useUpdateClawFile } from '@/hooks'
import { useUIStore, usePreferencesStore } from '@/lib/store'
import CodeMirror, { EditorView } from '@uiw/react-codemirror'
import { createTheme } from '@uiw/codemirror-themes'
import { tags } from '@lezer/highlight'
import { json } from '@codemirror/lang-json'

const darkEditorTheme = createTheme({
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

const lightEditorTheme = createTheme({
    theme: 'light',
    settings: {
        background: '#fafafa',
        foreground: '#18181b',
        caret: '#18181b',
        selection: '#c7d2fe',
        selectionMatch: '#c7d2fe66',
        lineHighlight: '#00000008',
        gutterBackground: '#fafafa',
        gutterForeground: '#a1a1aa'
    },
    styles: [
        { tag: tags.propertyName, color: '#2563eb' },
        { tag: tags.string, color: '#16a34a' },
        { tag: tags.number, color: '#d97706' },
        { tag: tags.bool, color: '#db2777' },
        { tag: tags.null, color: '#7c3aed' },
        { tag: tags.punctuation, color: '#71717a' }
    ]
})

const editorStyles = EditorView.theme({
    '&': { fontSize: '12px', height: '100%' },
    '.cm-scroller': { overflow: 'auto' },
    '.cm-gutters': { borderRight: 'none' }
})

const ClawConfigDialog: FC<ClawFileExplorerDialogProps> = ({
    clawId,
    open,
    onOpenChange
}): ReactNode => {
    const queryClient = useQueryClient()
    const storeTheme = usePreferencesStore((s) => s.theme)
    const resolvedTheme = storeTheme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : storeTheme
    const files = useClawFiles(clawId, open)
    const updateFile = useUpdateClawFile()
    const showToast = useUIStore((s) => s.showToast)
    const [selectedPath, setSelectedPath] = useState('')
    const [editedContent, setEditedContent] = useState('')
    const [jsonError, setJsonError] = useState(false)

    const selectedFile = files.data?.files.find((f) => f.path === selectedPath)
    const isJson = selectedFile?.isJson ?? false

    const fileContent = useClawFile(
        clawId,
        selectedPath,
        open && selectedPath.length > 0
    )

    const handleOpen = (isOpen: boolean) => {
        if (!isOpen) {
            setSelectedPath('')
            setEditedContent('')
            setJsonError(false)
            updateFile.reset()
            queryClient.removeQueries({
                queryKey: ['claw-files', clawId]
            })
            queryClient.removeQueries({
                queryKey: ['claw-file', clawId]
            })
        }
        onOpenChange(isOpen)
    }

    const handleSelectFile = (path: string) => {
        if (path === selectedPath) return
        setSelectedPath(path)
        setEditedContent('')
        setJsonError(false)
        updateFile.reset()
        queryClient.removeQueries({
            queryKey: ['claw-file', clawId, selectedPath]
        })
    }

    const handleContentLoaded = useCallback(
        (content: string, fileIsJson: boolean) => {
            if (fileIsJson) {
                try {
                    const parsed = JSON.parse(content)
                    return JSON.stringify(parsed, null, 4)
                } catch {
                    return content
                }
            }
            return content
        },
        []
    )

    const currentContent = fileContent.data?.content
    const displayContent =
        currentContent !== undefined && editedContent === ''
            ? handleContentLoaded(currentContent, isJson)
            : editedContent

    const handleChange = useCallback((value: string) => {
        setEditedContent(value)
        try {
            JSON.parse(value)
            setJsonError(false)
        } catch {
            setJsonError(true)
        }
    }, [])

    const handleSave = () => {
        if (jsonError || !selectedPath) return

        try {
            const minified = JSON.stringify(
                JSON.parse(editedContent || displayContent)
            )
            updateFile.mutate(
                { id: clawId, data: { path: selectedPath, content: minified } },
                {
                    onSuccess: () => {
                        showToast(t('dashboard.fileExplorerSaved'), 'success')
                    },
                    onError: (err) => {
                        showToast(
                            err.message || t('api.failedToUpdateFile'),
                            'error'
                        )
                    }
                }
            )
        } catch {
            setJsonError(true)
        }
    }

    const groupedFiles = files.data?.files.reduce<
        Record<string, typeof files.data.files>
    >((acc, file) => {
        const parts = file.path.split('/')
        const dir = parts.length > 1 ? parts.slice(0, -1).join('/') : ''
        if (!acc[dir]) acc[dir] = []
        acc[dir].push(file)
        return acc
    }, {})

    const folders = groupedFiles
        ? Object.entries(groupedFiles)
              .filter(([dir]) => dir !== '')
              .sort(([a], [b]) => a.localeCompare(b))
        : []
    const rootFiles = groupedFiles?.[''] ?? []

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogContent className='flex max-h-[85vh] max-w-4xl flex-col'>
                <DialogHeader>
                    <DialogTitle>{t('dashboard.fileExplorer')}</DialogTitle>
                    <DialogDescription>
                        {t('dashboard.fileExplorerDescription')}
                    </DialogDescription>
                </DialogHeader>

                <div className='mt-2 flex max-w-lg items-start gap-2 rounded-md bg-yellow-500/10 p-3 text-xs text-yellow-700 dark:text-yellow-400'>
                    <WarningIcon className='mt-0.5 h-3.5 w-3.5 shrink-0' />
                    {t('dashboard.fileExplorerWarning')}
                </div>

                <div className='flex h-[530px] gap-3 overflow-hidden pt-3'>
                    <div className='w-56 shrink-0 overflow-y-auto rounded-md border border-border bg-muted'>
                        {files.isPending && (
                            <div className='p-3'>
                                <div className='flex items-center gap-1.5 py-1.5'>
                                    <Skeleton className='h-3.5 w-3.5 shrink-0 rounded' />
                                    <Skeleton className='h-3 w-16 rounded' />
                                </div>
                                <div className='ml-[19px]'>
                                    <div className="relative py-1.5 pl-5 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border before:content-[''] after:absolute after:left-0 after:top-1/2 after:h-px after:w-3 after:-translate-y-px after:bg-border after:content-['']">
                                        <div className='flex items-center gap-1.5'>
                                            <Skeleton className='h-3.5 w-3.5 shrink-0 rounded' />
                                            <Skeleton className='h-3 w-24 rounded' />
                                        </div>
                                    </div>
                                    <div className='border-l border-border'>
                                        <div className='ml-[19px]'>
                                            <div className="relative py-1.5 pl-5 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border before:content-[''] after:absolute after:left-0 after:top-1/2 after:h-px after:w-3 after:-translate-y-px after:bg-border after:content-['']">
                                                <div className='flex items-center gap-1.5'>
                                                    <Skeleton className='h-3.5 w-3.5 shrink-0 rounded' />
                                                    <Skeleton className='h-3 w-16 rounded' />
                                                </div>
                                            </div>
                                            <div className="relative py-1.5 pl-5 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border before:content-[''] after:absolute after:left-0 after:top-1/2 after:h-px after:w-3 after:-translate-y-px after:bg-border after:content-['']">
                                                <div className='flex items-center gap-1.5'>
                                                    <Skeleton className='h-3.5 w-3.5 shrink-0 rounded' />
                                                    <Skeleton className='h-3 w-20 rounded' />
                                                </div>
                                            </div>
                                            <div className="relative py-1.5 pl-5 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border before:content-[''] after:absolute after:left-0 after:top-1/2 after:h-px after:w-3 after:-translate-y-px after:bg-border after:content-['']">
                                                <div className='flex items-center gap-1.5'>
                                                    <Skeleton className='h-3.5 w-3.5 shrink-0 rounded' />
                                                    <Skeleton className='h-3 w-14 rounded' />
                                                </div>
                                            </div>
                                            <div className="relative py-1.5 pl-5 before:absolute before:left-0 before:top-0 before:h-1/2 before:w-3 before:rounded-bl-[5px] before:border-b before:border-l before:border-border before:content-['']">
                                                <div className='flex items-center gap-1.5'>
                                                    <Skeleton className='h-3.5 w-3.5 shrink-0 rounded' />
                                                    <Skeleton className='h-3 w-24 rounded' />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative py-1.5 pl-5 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border before:content-[''] after:absolute after:left-0 after:top-1/2 after:h-px after:w-3 after:-translate-y-px after:bg-border after:content-['']">
                                        <div className='flex items-center gap-1.5'>
                                            <Skeleton className='h-3.5 w-3.5 shrink-0 rounded' />
                                            <Skeleton className='h-3 w-14 rounded' />
                                        </div>
                                    </div>
                                    <div className='border-l border-border'>
                                        <div className='ml-[19px]'>
                                            <div className="relative py-1.5 pl-5 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border before:content-[''] after:absolute after:left-0 after:top-1/2 after:h-px after:w-3 after:-translate-y-px after:bg-border after:content-['']">
                                                <div className='flex items-center gap-1.5'>
                                                    <Skeleton className='h-3.5 w-3.5 shrink-0 rounded' />
                                                    <Skeleton className='h-3 w-16 rounded' />
                                                </div>
                                            </div>
                                            <div className="relative py-1.5 pl-5 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border before:content-[''] after:absolute after:left-0 after:top-1/2 after:h-px after:w-3 after:-translate-y-px after:bg-border after:content-['']">
                                                <div className='flex items-center gap-1.5'>
                                                    <Skeleton className='h-3.5 w-3.5 shrink-0 rounded' />
                                                    <Skeleton className='h-3 w-20 rounded' />
                                                </div>
                                            </div>
                                            <div className="relative py-1.5 pl-5 before:absolute before:left-0 before:top-0 before:h-1/2 before:w-3 before:rounded-bl-[5px] before:border-b before:border-l before:border-border before:content-['']">
                                                <div className='flex items-center gap-1.5'>
                                                    <Skeleton className='h-3.5 w-3.5 shrink-0 rounded' />
                                                    <Skeleton className='h-3 w-12 rounded' />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative py-1.5 pl-5 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border before:content-[''] after:absolute after:left-0 after:top-1/2 after:h-px after:w-3 after:-translate-y-px after:bg-border after:content-['']">
                                        <div className='flex items-center gap-1.5'>
                                            <Skeleton className='h-3.5 w-3.5 shrink-0 rounded' />
                                            <Skeleton className='h-3 w-20 rounded' />
                                        </div>
                                    </div>
                                    <div className="relative py-1.5 pl-5 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border before:content-[''] after:absolute after:left-0 after:top-1/2 after:h-px after:w-3 after:-translate-y-px after:bg-border after:content-['']">
                                        <div className='flex items-center gap-1.5'>
                                            <Skeleton className='h-3.5 w-3.5 shrink-0 rounded' />
                                            <Skeleton className='h-3 w-16 rounded' />
                                        </div>
                                    </div>
                                    <div className="relative py-1.5 pl-5 before:absolute before:left-0 before:top-0 before:h-1/2 before:w-3 before:rounded-bl-[5px] before:border-b before:border-l before:border-border before:content-['']">
                                        <div className='flex items-center gap-1.5'>
                                            <Skeleton className='h-3.5 w-3.5 shrink-0 rounded' />
                                            <Skeleton className='h-3 w-24 rounded' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {files.isError && (
                            <div className='p-3 text-xs text-red-600 dark:text-red-400'>
                                {files.error?.message ||
                                    t('api.failedToListFiles')}
                            </div>
                        )}
                        {files.data && files.data.files.length === 0 && (
                            <div className='p-3 text-xs text-muted-foreground'>
                                {t('dashboard.fileExplorerNoFiles')}
                            </div>
                        )}
                        {groupedFiles && (
                            <>
                                <div className='flex items-center gap-1.5 px-3 pb-1 pt-2 text-xs font-medium text-muted-foreground'>
                                    <FolderOpenIcon className='h-3.5 w-3.5 shrink-0' />
                                    {t('dashboard.fileExplorerRoot')}
                                </div>
                                <div className='ml-[19px]'>
                                    {folders.map(([dir, dirFiles], index) => {
                                        const isLastRootChild =
                                            index === folders.length - 1 &&
                                            rootFiles.length === 0
                                        return (
                                            <div key={dir}>
                                                <div
                                                    className={`relative flex items-center gap-1.5 py-1.5 pl-5 pr-3 text-xs font-medium text-muted-foreground ${
                                                        isLastRootChild
                                                            ? "before:absolute before:left-0 before:top-0 before:h-1/2 before:w-3 before:rounded-bl-[5px] before:border-b before:border-l before:border-border before:content-['']"
                                                            : "before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border before:content-[''] after:absolute after:left-0 after:top-1/2 after:h-px after:w-3 after:-translate-y-px after:bg-border after:content-['']"
                                                    }`}
                                                >
                                                    <FolderOpenIcon className='h-3.5 w-3.5 shrink-0' />
                                                    {dir}
                                                </div>
                                                <div
                                                    className={
                                                        !isLastRootChild
                                                            ? 'border-l border-border'
                                                            : ''
                                                    }
                                                >
                                                    <div className='ml-[19px]'>
                                                        {dirFiles.map(
                                                            (file, fi) => (
                                                                <button
                                                                    key={
                                                                        file.path
                                                                    }
                                                                    onClick={() =>
                                                                        handleSelectFile(
                                                                            file.path
                                                                        )
                                                                    }
                                                                    className={`relative flex w-full items-center gap-2 py-1.5 pl-5 pr-3 text-left text-xs transition-colors ${
                                                                        fi ===
                                                                        dirFiles.length -
                                                                            1
                                                                            ? "before:absolute before:left-0 before:top-0 before:h-1/2 before:w-3 before:rounded-bl-[5px] before:border-b before:border-l before:border-border before:content-['']"
                                                                            : "before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border before:content-[''] after:absolute after:left-0 after:top-1/2 after:h-px after:w-3 after:-translate-y-px after:bg-border after:content-['']"
                                                                    } ${
                                                                        selectedPath ===
                                                                        file.path
                                                                            ? 'bg-muted text-foreground'
                                                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground/80'
                                                                    }`}
                                                                >
                                                                    {file.isJson ? (
                                                                        <FileJsIcon className='h-3.5 w-3.5 shrink-0 text-yellow-500' />
                                                                    ) : (
                                                                        <FileIcon className='h-3.5 w-3.5 shrink-0' />
                                                                    )}
                                                                    <span className='truncate'>
                                                                        {
                                                                            file.name
                                                                        }
                                                                    </span>
                                                                </button>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {rootFiles.map((file, index) => (
                                        <button
                                            key={file.path}
                                            onClick={() =>
                                                handleSelectFile(file.path)
                                            }
                                            className={`relative flex w-full items-center gap-2 py-1.5 pl-5 pr-3 text-left text-xs transition-colors ${
                                                index === rootFiles.length - 1
                                                    ? "before:absolute before:left-0 before:top-0 before:h-1/2 before:w-3 before:rounded-bl-[5px] before:border-b before:border-l before:border-border before:content-['']"
                                                    : "before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border before:content-[''] after:absolute after:left-0 after:top-1/2 after:h-px after:w-3 after:-translate-y-px after:bg-border after:content-['']"
                                            } ${
                                                selectedPath === file.path
                                                    ? 'bg-muted text-foreground'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground/80'
                                            }`}
                                        >
                                            {file.isJson ? (
                                                <FileJsIcon className='h-3.5 w-3.5 shrink-0 text-yellow-500' />
                                            ) : (
                                                <FileIcon className='h-3.5 w-3.5 shrink-0' />
                                            )}
                                            <span className='truncate'>
                                                {file.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className='flex min-w-0 flex-1 flex-col gap-2'>
                        {!selectedPath && (
                            <div className='flex flex-1 flex-col items-center justify-center gap-2 rounded-md border border-border bg-muted text-sm text-muted-foreground'>
                                <FileIcon className='h-8 w-8 text-muted-foreground' />
                                {t('dashboard.fileExplorerSelectFile')}
                            </div>
                        )}
                        {selectedPath && fileContent.isPending && (
                            <div className='flex flex-col'>
                                <div className='h-7 w-28 rounded-b-none rounded-t-md bg-muted/60' />
                                <Skeleton className='h-[486px] rounded-b-sm rounded-tl-none rounded-tr-sm' />
                            </div>
                        )}
                        {selectedPath && fileContent.isError && (
                            <div className='flex flex-1 items-center justify-center rounded-md border border-border bg-muted text-sm text-red-600 dark:text-red-400'>
                                {fileContent.error?.message ||
                                    t('api.failedToReadFile')}
                            </div>
                        )}
                        {selectedPath && fileContent.data && (
                            <>
                                <div className='flex items-center'>
                                    <div className='flex items-center gap-1.5 rounded-t-md border border-b-0 border-border bg-muted px-3 py-1.5 text-xs text-foreground/80'>
                                        {isJson ? (
                                            <FileJsIcon className='h-3.5 w-3.5 shrink-0 text-yellow-500' />
                                        ) : (
                                            <FileIcon className='h-3.5 w-3.5 shrink-0' />
                                        )}
                                        {selectedFile?.name}
                                        {!isJson && (
                                            <span className='ml-0.5 rounded-full bg-muted px-2 py-px text-[10px] lowercase text-muted-foreground'>
                                                {t(
                                                    'dashboard.fileExplorerReadOnly'
                                                )}
                                            </span>
                                        )}
                                        <button
                                            onClick={() => handleSelectFile('')}
                                            className='ml-0.5 rounded p-0.5 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground/80'
                                        >
                                            <XIcon className='h-3 w-3' />
                                        </button>
                                    </div>
                                </div>
                                <div
                                    className={`-mt-2 h-[500px] overflow-hidden rounded-md rounded-tl-none border bg-muted ${
                                        jsonError
                                            ? 'border-red-500/50'
                                            : 'border-border'
                                    }`}
                                >
                                    <CodeMirror
                                        value={displayContent}
                                        onChange={
                                            isJson ? handleChange : undefined
                                        }
                                        readOnly={!isJson}
                                        extensions={
                                            isJson
                                                ? [json(), editorStyles]
                                                : [editorStyles]
                                        }
                                        theme={resolvedTheme === 'dark' ? darkEditorTheme : lightEditorTheme}
                                        height='500px'
                                        basicSetup={{
                                            lineNumbers: true,
                                            foldGutter: isJson,
                                            bracketMatching: isJson,
                                            closeBrackets: isJson,
                                            highlightActiveLine: isJson,
                                            indentOnInput: isJson
                                        }}
                                    />
                                </div>
                                {jsonError && (
                                    <p className='text-xs text-red-600 dark:text-red-400'>
                                        {t('dashboard.fileExplorerInvalidJson')}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className='mt-6 flex justify-end border-t border-border pt-3'>
                    <Button
                        onClick={handleSave}
                        className='mt-3'
                        disabled={
                            !isJson ||
                            !selectedPath ||
                            !fileContent.data ||
                            jsonError ||
                            updateFile.isPending
                        }
                        size='sm'
                    >
                        {updateFile.isPending ? (
                            <CircleNotchIcon className='mr-2 h-4 w-4 animate-spin' />
                        ) : (
                            <FloppyDiskIcon className='mr-2 h-4 w-4' />
                        )}
                        {t('dashboard.fileExplorerSave')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ClawConfigDialog