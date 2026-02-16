import type { ReactNode, KeyboardEvent, ChangeEvent, ForwardRefRenderFunction } from 'react'
import type { ChatAttachment, ChatImageSource, ChatInputAttachment, ChatInputHandle, ChatInputProps } from '@/ts/Interfaces'

import { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react'
import { t } from '@openclaw/i18n'
import { PaperPlaneRight, Stop, Paperclip, X, Microphone } from '@phosphor-icons/react'
import { useSpeechRecognition } from '@/hooks'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const DOCUMENT_TYPES = ['application/pdf', 'text/plain']
const SUPPORTED_TYPES = [...IMAGE_TYPES, ...DOCUMENT_TYPES]

const ChatInputInner: ForwardRefRenderFunction<ChatInputHandle, ChatInputProps> = ({
    isConnected,
    isStreaming,
    onSend,
    onAbort,
    allowAttach
}, ref): ReactNode => {
    const [input, setInput] = useState('')
    const [attachments, setAttachments] = useState<ChatInputAttachment[]>([])
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { isRecording, isTranscribing, toggle: toggleVoice } = useSpeechRecognition(setInput)

    const resizeTextarea = useCallback(() => {
        const el = textareaRef.current
        if (!el) return
        el.style.height = 'auto'
        const maxHeight = 4 * 24
        const newHeight = Math.min(el.scrollHeight, maxHeight)
        el.style.height = `${newHeight}px`
        el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden'
    }, [])

    useEffect(() => {
        resizeTextarea()
    }, [input, resizeTextarea])

    const addFiles = useCallback((files: File[]) => {
        const valid = files.filter((f) => SUPPORTED_TYPES.includes(f.type))
        if (valid.length === 0) return

        const newAttachments: ChatInputAttachment[] = valid.map((file) => {
            const isImage = IMAGE_TYPES.includes(file.type)
            return {
                file,
                preview: isImage ? URL.createObjectURL(file) : ''
            }
        })

        setAttachments((prev) => [...prev, ...newAttachments])
    }, [])

    useImperativeHandle(ref, () => ({ addFiles }), [addFiles])

    const handleSend = useCallback(() => {
        if ((!input.trim() && attachments.length === 0) || isStreaming) return

        const chatAttachments: ChatAttachment[] = []
        const previews: ChatImageSource[] = []

        const pending = attachments.map((att) =>
            new Promise<void>((resolve) => {
                const isImage = IMAGE_TYPES.includes(att.file.type)
                const reader = new FileReader()
                reader.onload = () => {
                    const base64 = (reader.result as string).split(',')[1]
                    if (base64) {
                        chatAttachments.push({
                            type: isImage ? 'image' : 'document',
                            source: {
                                type: 'base64',
                                mediaType: att.file.type,
                                data: base64,
                                filename: att.file.name
                            }
                        })
                        previews.push({
                            type: 'base64',
                            mediaType: att.file.type,
                            data: isImage ? base64 : '',
                            filename: att.file.name
                        })
                    }
                    resolve()
                }
                reader.onerror = () => resolve()
                reader.readAsDataURL(att.file)
            })
        )

        Promise.all(pending).then(() => {
            onSend(
                input.trim() || (attachments.length > 0 ? attachments.map((a) => a.file.name).join(', ') : ''),
                chatAttachments.length > 0 ? chatAttachments : undefined,
                previews.length > 0 ? previews : undefined
            )
            setInput('')
            setAttachments([])
            textareaRef.current?.focus()
        })
    }, [input, isStreaming, onSend, attachments])

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
            }
        },
        [handleSend]
    )

    const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value)
    }, [])

    const handleAttachClick = useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        fileInputRef.current?.click()
    }, [])

    const handleFileChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files
            if (!files || files.length === 0) return

            addFiles(Array.from(files))

            if (e.target) {
                e.target.value = ''
            }
        },
        [addFiles]
    )

    const handleRemoveAttachment = useCallback((index: number) => {
        setAttachments((prev) => {
            const removed = prev[index]
            if (removed?.preview) {
                URL.revokeObjectURL(removed.preview)
            }
            return prev.filter((_, i) => i !== index)
        })
    }, [])

    return (
        <div className='border-t border-white/10 p-3'>
            {attachments.length > 0 && (
                <div className='mb-2 flex flex-wrap gap-2'>
                    {attachments.map((att, idx) => (
                        <div key={idx} className='group relative'>
                            {att.preview ? (
                                <img
                                    src={att.preview}
                                    alt={att.file.name}
                                    className='h-10 w-10 rounded object-cover'
                                />
                            ) : (
                                <div className='flex h-10 w-10 items-center justify-center rounded bg-white/10'>
                                    <span className='text-[9px] text-gray-400'>
                                        {att.file.name.split('.').pop()?.toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <button
                                onClick={() => handleRemoveAttachment(idx)}
                                className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0a0a0f] text-gray-400 ring-1 ring-white/20 transition-colors hover:text-white'
                            >
                                <X className='h-2.5 w-2.5' weight='bold' />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className='flex items-end gap-2'>
                <button
                    onClick={handleAttachClick}
                    disabled={!isConnected || !allowAttach}
                    className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
                >
                    <Paperclip className='h-4 w-4' weight='bold' />
                </button>
                <input
                    ref={fileInputRef}
                    type='file'
                    multiple
                    accept='image/jpeg,image/png,image/gif,image/webp,application/pdf,text/plain'
                    onChange={handleFileChange}
                    className='hidden'
                />
                <button
                    onClick={toggleVoice}
                    disabled={!isConnected || !allowAttach || isTranscribing}
                    title={t('playground.chatVoiceInput')}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        isRecording
                            ? 'animate-pulse bg-[#ef5350] text-white'
                            : isTranscribing
                                ? 'bg-white/10 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    {isTranscribing ? (
                        <div className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white' />
                    ) : (
                        <Microphone className='h-4 w-4' weight='bold' />
                    )}
                </button>
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder={t('playground.chatInputPlaceholder')}
                    disabled={!isConnected || !allowAttach}
                    className='flex-1 resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-[#ef5350]/50 disabled:cursor-not-allowed disabled:opacity-50'
                />
                {isStreaming ? (
                    <button
                        onClick={onAbort}
                        className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-600 text-white transition-colors hover:bg-yellow-700'
                    >
                        <Stop className='h-4 w-4' weight='bold' />
                    </button>
                ) : (
                    <button
                        onClick={handleSend}
                        disabled={!isConnected || !allowAttach || (!input.trim() && attachments.length === 0)}
                        className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ef5350] text-white transition-colors hover:bg-[#e53935] disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        <PaperPlaneRight className='h-4 w-4' weight='bold' />
                    </button>
                )}
            </div>
        </div>
    )
}

const ChatInput = forwardRef(ChatInputInner)

export default ChatInput