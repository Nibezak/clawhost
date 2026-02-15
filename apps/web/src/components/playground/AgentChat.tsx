import type { FC, ReactNode, KeyboardEvent } from 'react'
import type { AgentChatProps, ChatMessage } from '@/ts/Interfaces'

import { useState, useRef, useEffect, useCallback } from 'react'
import { t } from '@openclaw/i18n'
import {
    PaperPlaneRight,
    Stop,
    ChatTeardropText,
    CircleNotch,
    Warning,
    WifiSlash,
    GearSix
} from '@phosphor-icons/react'
import { useAgentChat } from '@/hooks/useAgentChat'

const ChatBubble: FC<{ message: ChatMessage }> = ({ message }): ReactNode => {
    const isUser = message.role === 'user'

    if (isUser) {
        return (
            <div className='flex justify-end'>
                <div className='max-w-[85%] rounded-2xl rounded-br-md bg-[#ef5350]/15 px-3.5 py-2.5'>
                    <p className='whitespace-pre-wrap text-sm text-gray-200'>
                        {message.content}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className='flex justify-start'>
            <div className='max-w-[85%] rounded-2xl rounded-bl-md bg-white/5 px-3.5 py-2.5'>
                <p className='whitespace-pre-wrap text-sm text-gray-300'>
                    {message.content}
                    {message.status === 'streaming' && (
                        <span className='ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-gray-400' />
                    )}
                </p>
                {message.status === 'error' && (
                    <div className='mt-2 flex items-center gap-1.5'>
                        <Warning className='h-3 w-3 text-red-400' />
                        <span className='text-[11px] text-red-400'>
                            {t('playground.chatErrorMessage')}
                        </span>
                    </div>
                )}
                {message.status === 'aborted' && (
                    <div className='mt-2 flex items-center gap-1.5'>
                        <Stop className='h-3 w-3 text-yellow-500' />
                        <span className='text-[11px] text-yellow-500'>
                            {t('playground.chatAbortedMessage')}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

const AgentChat: FC<AgentChatProps> = ({
    agentId,
    subdomain,
    gatewayToken,
    agentModel,
    readOnly
}): ReactNode => {
    const [input, setInput] = useState('')
    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const isNearBottomRef = useRef(true)

    const {
        messages,
        connectionState,
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
        isNearBottomRef.current =
            el.scrollHeight - el.scrollTop - el.clientHeight < threshold
    }, [])

    useEffect(() => {
        if (isNearBottomRef.current && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = useCallback(() => {
        if (!input.trim() || isStreaming) return
        sendMessage(input)
        setInput('')
        isNearBottomRef.current = true
        inputRef.current?.focus()
    }, [input, isStreaming, sendMessage])

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
            }
        },
        [handleSend]
    )

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
            </div>
        )
    }

    if (!subdomain || !gatewayToken) {
        return (
            <div className='flex h-full flex-col items-center justify-center gap-3 px-14 pb-16'>
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/5'>
                    <WifiSlash
                        className='h-6 w-6 text-gray-500'
                        weight='duotone'
                    />
                </div>
                <div className='text-center'>
                    <p className='text-sm font-medium text-gray-300'>
                        {t('playground.chatConnectionFailed')}
                    </p>
                    <p className='mt-1 text-xs text-gray-500'>
                        {t('playground.chatConnectionFailedDescription')}
                    </p>
                </div>
            </div>
        )
    }

    const isConnected = connectionState === 'connected'
    const isConnecting =
        connectionState === 'connecting' || connectionState === 'authenticating'
    const isError = connectionState === 'error'

    return (
        <div className='flex h-full flex-col'>
            {!isConnected && (
                <div className='flex items-center gap-2 border-b border-white/10 px-4 py-2'>
                    <div
                        className={`h-2 w-2 rounded-full ${
                            isConnecting
                                ? 'animate-pulse bg-yellow-500'
                                : isError
                                  ? 'bg-red-500'
                                  : 'bg-gray-500'
                        }`}
                    />
                    <span className='text-xs text-gray-400'>
                        {isConnecting && connectionState === 'connecting'
                            ? t('playground.chatConnecting')
                            : isConnecting
                              ? t('playground.chatAuthenticating')
                              : isError
                                ? t('playground.chatError')
                                : t('playground.chatDisconnected')}
                    </span>
                </div>
            )}

            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className='flex-1 overflow-y-auto'
            >
                {messages.length === 0 ? (
                    <div className='flex h-full flex-col items-center justify-center gap-3 px-14 pb-16'>
                        {isConnecting ? (
                            <CircleNotch className='h-6 w-6 animate-spin text-gray-500' />
                        ) : (
                            <>
                                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/5'>
                                    <ChatTeardropText
                                        className='h-6 w-6 text-gray-500'
                                        weight='duotone'
                                    />
                                </div>
                                <div className='text-center'>
                                    <p className='text-sm font-medium text-gray-300'>
                                        {t('playground.chatNoMessages')}
                                    </p>
                                    <p className='mt-1 text-xs text-gray-500'>
                                        {t(
                                            'playground.chatNoMessagesDescription'
                                        )}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className='space-y-3 p-4'>
                        {messages.map((msg) => (
                            <ChatBubble key={msg.id} message={msg} />
                        ))}
                    </div>
                )}
            </div>

            <div className='border-t border-white/10 p-3'>
                <div className='flex items-center gap-2'>
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            isConnected
                                ? t('playground.chatInputPlaceholder')
                                : t('playground.chatInputDisabled')
                        }
                        disabled={!isConnected}
                        className='flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-[#ef5350]/50 disabled:cursor-not-allowed disabled:text-gray-500'
                    />
                    {isStreaming ? (
                        <button
                            onClick={abortResponse}
                            className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-600 text-white transition-colors hover:bg-yellow-700'
                        >
                            <Stop className='h-4 w-4' weight='bold' />
                        </button>
                    ) : (
                        <button
                            onClick={handleSend}
                            disabled={!isConnected || !input.trim()}
                            className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ef5350] text-white transition-colors hover:bg-[#e53935] disabled:cursor-not-allowed disabled:opacity-50'
                        >
                            <PaperPlaneRight
                                className='h-4 w-4'
                                weight='bold'
                            />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AgentChat