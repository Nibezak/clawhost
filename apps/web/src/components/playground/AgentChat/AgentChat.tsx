import type { FC, ReactNode } from 'react'
import type { AgentChatProps } from '@/ts/Interfaces'

import { useRef, useEffect, useCallback } from 'react'
import { t } from '@openclaw/i18n'
import { GearSix } from '@phosphor-icons/react'
import { useAgentChat } from '@/hooks/useAgentChat'
import ChatBubble from '@/components/playground/AgentChat/ChatBubble'
import ChatInput from '@/components/playground/AgentChat/ChatInput'
import ChatEmptyState from '@/components/playground/AgentChat/ChatEmptyState'
import ChatSkeleton from '@/components/playground/AgentChat/ChatSkeleton'
import ChatStatusBar from '@/components/playground/AgentChat/ChatStatusBar'

const AgentChat: FC<AgentChatProps> = ({
    agentId,
    subdomain,
    gatewayToken,
    agentModel,
    readOnly
}): ReactNode => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const isNearBottomRef = useRef(true)

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
        isNearBottomRef.current =
            el.scrollHeight - el.scrollTop - el.clientHeight < threshold
    }, [])

    useEffect(() => {
        if (isNearBottomRef.current && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = useCallback(
        (text: string) => {
            sendMessage(text)
            isNearBottomRef.current = true
        },
        [sendMessage]
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
            <ChatEmptyState isError />
        )
    }

    const isConnected = connectionState === 'connected'
    const isError = connectionState === 'error' || connectionState === 'disconnected'

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
        <div className='flex h-full flex-col'>
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
                        {messages.map((msg) => (
                            <ChatBubble key={msg.id} message={msg} />
                        ))}
                    </div>
                )}
            </div>

            <ChatInput
                isConnected={isConnected}
                isStreaming={isStreaming}
                onSend={handleSend}
                onAbort={abortResponse}
            />
        </div>
    )
}

export default AgentChat