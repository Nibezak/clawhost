import type { FC, ReactNode, DragEvent } from 'react'
import type {
    AgentChatProps,
    ChatAttachment,
    ChatImageSource,
    ChatInputHandle,
    ChatMessage
} from '@/ts/Interfaces'

import { useRef, useState, useEffect, useCallback } from 'react'
import { t } from '@openclaw/i18n'
import { GearSix, ArrowDown } from '@phosphor-icons/react'
import { useAgentChat } from '@/hooks/useAgentChat'
import ChatBubble from '@/components/playground/AgentChat/ChatBubble'
import ChatInput from '@/components/playground/AgentChat/ChatInput'
import ChatEmptyState from '@/components/playground/AgentChat/ChatEmptyState'
import ChatSkeleton from '@/components/playground/AgentChat/ChatSkeleton'
import ChatStatusBar from '@/components/playground/AgentChat/ChatStatusBar'
import ChatDateSeparator from '@/components/playground/AgentChat/ChatDateSeparator'

const isDifferentDay = (a: ChatMessage, b: ChatMessage): boolean => {
    if (!a.timestamp || !b.timestamp) return false
    const dateA = new Date(a.timestamp)
    const dateB = new Date(b.timestamp)
    return (
        dateA.getFullYear() !== dateB.getFullYear() ||
        dateA.getMonth() !== dateB.getMonth() ||
        dateA.getDate() !== dateB.getDate()
    )
}

const AgentChat: FC<AgentChatProps> = ({
    agentId,
    subdomain,
    gatewayToken,
    agentModel,
    readOnly,
    onConfigure,
    configureDisabled
}): ReactNode => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const chatInputRef = useRef<ChatInputHandle>(null)
    const isNearBottomRef = useRef(true)
    const [isDragging, setIsDragging] = useState(false)
    const [showScrollButton, setShowScrollButton] = useState(false)
    const dragCounterRef = useRef(0)

    const {
        messages,
        connectionState,
        isLoading,
        isStreaming,
        sendMessage,
        abortResponse
    } = useAgentChat({
        subdomain,
        gatewayToken,
        agentId,
        enabled: !readOnly && !!subdomain && !!gatewayToken
    })

    const handleScroll = useCallback(() => {
        const el = scrollRef.current
        if (!el) return
        const threshold = 100
        const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold
        isNearBottomRef.current = nearBottom
        setShowScrollButton(!nearBottom)
    }, [])

    const scrollToBottom = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
        }
    }, [])

    useEffect(() => {
        if (isNearBottomRef.current && scrollRef.current) {
            requestAnimationFrame(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
                }
            })
        }
    }, [messages])

    const handleSend = useCallback(
        (text: string, attachments?: ChatAttachment[], previews?: ChatImageSource[]) => {
            sendMessage(text, attachments, previews)
            isNearBottomRef.current = true
        },
        [sendMessage]
    )

    const handleDragEnter = useCallback((e: DragEvent) => {
        e.preventDefault()
        dragCounterRef.current += 1
        if (dragCounterRef.current === 1) setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault()
        dragCounterRef.current -= 1
        if (dragCounterRef.current === 0) setIsDragging(false)
    }, [])

    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault()
    }, [])

    const handleDrop = useCallback((e: DragEvent) => {
        e.preventDefault()
        dragCounterRef.current = 0
        setIsDragging(false)
        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0 && chatInputRef.current) {
            chatInputRef.current.addFiles(files)
        }
    }, [])

    if (readOnly) {
        return (
            <div className='flex h-full flex-col'>
                <div className='flex-1 space-y-3 overflow-y-auto p-4'>
                    <div className='flex justify-end'>
                        <div className='max-w-[85%] rounded-2xl rounded-br-md bg-[#ef5350]/15 px-3.5 py-2.5'>
                            <p className='text-sm text-gray-200'>
                                {t('playground.chatReadOnlyUser')}
                            </p>
                        </div>
                    </div>
                    <div className='flex justify-start'>
                        <div className='max-w-[85%] rounded-2xl rounded-bl-md bg-white/5 px-3.5 py-2.5'>
                            <p className='text-sm text-gray-300'>
                                {t('playground.chatReadOnlyAssistant')}
                            </p>
                        </div>
                    </div>
                </div>
                <div className='border-t border-white/10 p-3'>
                    <div className='flex items-center gap-2'>
                        <input
                            disabled
                            placeholder={t(
                                'playground.chatReadOnlyPlaceholder'
                            )}
                            className='flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-500 outline-none placeholder:text-gray-600'
                        />
                    </div>
                </div>
            </div>
        )
    }

    if (!agentModel) {
        return (
            <div className='flex h-full flex-col items-center justify-center gap-3 px-14 pb-16'>
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/5'>
                    <GearSix
                        className='h-6 w-6 text-gray-500'
                        weight='duotone'
                    />
                </div>
                <div className='text-center'>
                    <p className='text-sm font-medium text-gray-300'>
                        {t('playground.chatNotConfigured')}
                    </p>
                    <p className='mt-1 text-xs text-gray-500'>
                        {t('playground.chatNotConfiguredDescription')}
                    </p>
                </div>
                {onConfigure && (
                    <button
                        onClick={onConfigure}
                        disabled={configureDisabled}
                        className='mt-2 flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40'
                    >
                        <GearSix className='h-3.5 w-3.5' weight='bold' />
                        {t('playground.chatConfigureButton')}
                    </button>
                )}
            </div>
        )
    }

    if (!subdomain || !gatewayToken) {
        return (
            <div className='flex h-full flex-col'>
                <div className='flex-1 overflow-y-auto'>
                    <ChatEmptyState isError />
                </div>
            </div>
        )
    }

    const isConnected = connectionState === 'connected'
    const isError =
        connectionState === 'error' || connectionState === 'disconnected'

    if (isLoading) {
        return (
            <div className='flex h-full flex-col'>
                <div className='flex-1 overflow-y-auto'>
                    <ChatSkeleton />
                </div>
                <ChatInput
                    isConnected={false}
                    isStreaming={false}
                    onSend={handleSend}
                    onAbort={abortResponse}
                />
            </div>
        )
    }

    return (
        <div
            className='relative flex h-full flex-col'
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {isDragging && (
                <div className='absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#ef5350]/40 bg-black/60'>
                    <p className='text-sm font-medium text-gray-200/80'>
                        {t('playground.chatDropFiles')}
                    </p>
                    <p className='text-xs text-gray-400/70'>
                        {t('playground.chatDropFilesDescription')}
                    </p>
                </div>
            )}

            {!isLoading && !isConnected && (
                <ChatStatusBar connectionState={connectionState} />
            )}

            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className='flex-1 overflow-y-auto'
            >
                {messages.length === 0 ? (
                    <ChatEmptyState isError={isError} />
                ) : (
                    <div className='space-y-3 p-4'>
                        {messages.map((msg, idx) => (
                            <div key={msg.id}>
                                {(idx === 0 ||
                                    isDifferentDay(messages[idx - 1], msg)) &&
                                    msg.timestamp && (
                                        <ChatDateSeparator
                                            date={msg.timestamp}
                                        />
                                    )}
                                <ChatBubble message={msg} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showScrollButton && messages.length > 0 && (
                <div className='flex justify-center pb-0.5'>
                    <button
                        onClick={scrollToBottom}
                        className='absolute bottom-[4.25rem] z-10 flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0a0a0f] px-3 py-1.5 text-xs text-gray-400 shadow-lg transition-colors hover:border-white/20 hover:text-white'
                    >
                        <ArrowDown className='h-3 w-3' weight='bold' />
                        {t('playground.chatScrollToBottom')}
                    </button>
                </div>
            )}

            <ChatInput
                ref={chatInputRef}
                isConnected={isConnected}
                isStreaming={isStreaming}
                onSend={handleSend}
                onAbort={abortResponse}
                allowAttach
            />
        </div>
    )
}

export default AgentChat