import type {
    ChatAttachment,
    ChatEventPayload,
    ChatHistoryEntry,
    ChatImageSource,
    ChatMessage,
    UseAgentChatParams,
    UseAgentChatReturn
} from '@/ts/Interfaces'
import type { GatewayConnectionState } from '@/ts/Types'

import { useState, useEffect, useRef, useCallback } from 'react'
import { SharedGateway } from '@/lib/gateway'
import extractText from '@/hooks/useAgentChat/extractText'
import extractImages from '@/hooks/useAgentChat/extractImages'
import stripMetadata from '@/hooks/useAgentChat/stripMetadata'

const useAgentChat = ({
    subdomain,
    gatewayToken,
    agentId,
    enabled
}: UseAgentChatParams): UseAgentChatReturn => {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [connectionState, setConnectionState] =
        useState<GatewayConnectionState>('disconnected')
    const [isLoading, setIsLoading] = useState(true)
    const [isStreaming, setIsStreaming] = useState(false)
    const clientRef = useRef<ReturnType<typeof SharedGateway.acquire> | null>(
        null
    )
    const currentRunIdRef = useRef<string | null>(null)
    const streamBufferRef = useRef('')
    const streamImagesRef = useRef<ChatMessage['images']>([])
    const rafRef = useRef<number | null>(null)
    const mountedRef = useRef(true)
    const sessionKeyRef = useRef(`agent:${agentId}:main`)

    const flushStreamBuffer = useCallback(() => {
        rafRef.current = null
        const content = streamBufferRef.current

        if (!content) return

        setMessages((prev) => {
            const last = prev[prev.length - 1]
            if (last && last.status === 'streaming') {
                return [...prev.slice(0, -1), { ...last, content }]
            }
            return prev
        })
    }, [])

    useEffect(() => {
        mountedRef.current = true
        sessionKeyRef.current = `agent:${agentId}:main`

        if (!enabled || !subdomain || !gatewayToken) {
            setConnectionState('disconnected')
            setIsLoading(false)
            return
        }

        const client = SharedGateway.acquire(subdomain, gatewayToken)
        clientRef.current = client

        const loadHistory = () => {
            client
                .send('sessions.list', {})
                .then((result) => {
                    if (!mountedRef.current) return
                    const raw = result as Record<string, unknown>
                    const sessions = Array.isArray(raw)
                        ? raw
                        : Array.isArray(
                                (raw as Record<string, unknown>)?.sessions
                            )
                          ? ((raw as Record<string, unknown>).sessions as Array<
                                Record<string, unknown>
                            >)
                          : []
                    const agentPrefix = `agent:${agentId}:`
                    const agentSession = sessions.find((s) => {
                        const key = ((s as Record<string, unknown>).key ||
                            (s as Record<string, unknown>).sessionKey) as string
                        return key?.startsWith(agentPrefix)
                    }) as Record<string, unknown> | undefined
                    if (agentSession) {
                        const resolved = (agentSession.key ||
                            agentSession.sessionKey) as string | undefined
                        if (resolved) {
                            sessionKeyRef.current = resolved
                        }
                    }
                    return client.send('chat.history', {
                        sessionKey: sessionKeyRef.current,
                        limit: 500
                    })
                })
                .then((result) => {
                    if (!mountedRef.current) return
                    const raw = result as Record<string, unknown>
                    const history = (
                        Array.isArray(raw)
                            ? raw
                            : Array.isArray(raw?.messages)
                              ? (raw.messages as ChatHistoryEntry[])
                              : Array.isArray(raw?.history)
                                ? (raw.history as ChatHistoryEntry[])
                                : []
                    ) as ChatHistoryEntry[]
                    if (history.length > 0) {
                        const loaded: ChatMessage[] = []
                        for (let i = 0; i < history.length; i++) {
                            const msg = history[i]
                            if (
                                msg.role === 'toolResult' ||
                                msg.role === 'toolCall'
                            )
                                continue
                            const isUser = msg.role === 'user'
                            const text = extractText(msg.content)
                            if (!text.trim()) continue
                            const images = extractImages(msg.content)
                            loaded.push({
                                id: `history-${i}`,
                                role: isUser ? 'user' : 'assistant',
                                content: isUser ? stripMetadata(text) : text,
                                status: 'complete' as const,
                                timestamp: new Date().toISOString(),
                                images:
                                    images && images.length > 0
                                        ? images
                                        : undefined
                            })
                        }
                        setMessages(loaded)
                    }
                    setIsLoading(false)
                })
                .catch((err: Error) => {
                    console.error(
                        '[useAgentChat] history load failed:',
                        err.message
                    )
                    if (mountedRef.current) setIsLoading(false)
                })
        }

        const handleStateChange = (state: GatewayConnectionState) => {
            if (!mountedRef.current) return
            setConnectionState(state)

            if (state === 'error' || state === 'disconnected') {
                setIsLoading(false)
            }

            if (state === 'connected') {
                loadHistory()
            }
        }

        const handleChatEvent = (payload: unknown) => {
            if (!mountedRef.current) return

            const event = payload as ChatEventPayload
            if (event.sessionKey && event.sessionKey !== sessionKeyRef.current)
                return

            const rawContent =
                (event.message as Record<string, unknown>)?.content ??
                event.message
            const text = extractText(rawContent)
            const images = extractImages(rawContent)

            if (event.state === 'delta' || event.state === 'final') {
                if (text) {
                    if (!currentRunIdRef.current) {
                        currentRunIdRef.current =
                            event.runId || crypto.randomUUID()
                        setIsStreaming(true)
                        streamBufferRef.current = text
                        streamImagesRef.current =
                            images.length > 0 ? images : undefined
                        setMessages((prev) => [
                            ...prev,
                            {
                                id: currentRunIdRef.current!,
                                role: 'assistant',
                                content: text,
                                status: 'streaming',
                                runId: currentRunIdRef.current!,
                                timestamp: new Date().toISOString(),
                                images: images.length > 0 ? images : undefined
                            }
                        ])
                    } else {
                        streamBufferRef.current = text
                        if (images.length > 0) {
                            streamImagesRef.current = images
                        }
                        if (!rafRef.current) {
                            rafRef.current =
                                requestAnimationFrame(flushStreamBuffer)
                        }
                    }
                }

                if (event.state === 'final') {
                    if (rafRef.current) {
                        cancelAnimationFrame(rafRef.current)
                        rafRef.current = null
                    }
                    const finalContent = streamBufferRef.current
                    const finalImages = streamImagesRef.current
                    setMessages((prev) => {
                        const last = prev[prev.length - 1]
                        if (last && last.status === 'streaming') {
                            return [
                                ...prev.slice(0, -1),
                                {
                                    ...last,
                                    content: finalContent || last.content,
                                    status: 'complete' as const,
                                    images:
                                        finalImages && finalImages.length > 0
                                            ? finalImages
                                            : last.images
                                }
                            ]
                        }
                        return prev
                    })
                    currentRunIdRef.current = null
                    streamBufferRef.current = ''
                    streamImagesRef.current = []
                    setIsStreaming(false)
                }
            } else if (event.state === 'error') {
                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current)
                    rafRef.current = null
                }

                setMessages((prev) => {
                    const last = prev[prev.length - 1]
                    if (last && last.status === 'streaming') {
                        return [
                            ...prev.slice(0, -1),
                            { ...last, status: 'error' as const }
                        ]
                    }
                    return prev
                })
                currentRunIdRef.current = null
                streamBufferRef.current = ''
                streamImagesRef.current = []
                setIsStreaming(false)
            } else if (event.state === 'aborted') {
                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current)
                    rafRef.current = null
                }

                const abortedContent = streamBufferRef.current
                setMessages((prev) => {
                    const last = prev[prev.length - 1]
                    if (last && last.runId === event.runId) {
                        return [
                            ...prev.slice(0, -1),
                            {
                                ...last,
                                content: abortedContent || last.content,
                                status: 'aborted' as const
                            }
                        ]
                    }
                    return prev
                })
                currentRunIdRef.current = null
                streamBufferRef.current = ''
                streamImagesRef.current = []
                setIsStreaming(false)
            }
        }

        client.addStateListener(handleStateChange)
        client.on('chat', handleChatEvent)

        if (client.state === 'connected') {
            setConnectionState('connected')
            loadHistory()
        } else if (
            client.state === 'connecting' ||
            client.state === 'authenticating'
        ) {
            setConnectionState(client.state)
        }

        return () => {
            mountedRef.current = false
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
                rafRef.current = null
            }
            client.off('chat', handleChatEvent)
            client.removeStateListener(handleStateChange)
            SharedGateway.release(subdomain)
            clientRef.current = null
        }
    }, [subdomain, gatewayToken, agentId, enabled, flushStreamBuffer])

    const sendMessage = useCallback(
        (
            text: string,
            attachments?: ChatAttachment[],
            previews?: ChatImageSource[]
        ) => {
            if (!clientRef.current || !text.trim()) return

            const userMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'user',
                content: text.trim(),
                status: 'complete',
                timestamp: new Date().toISOString(),
                images: previews && previews.length > 0 ? previews : undefined
            }

            setMessages((prev) => [...prev, userMessage])
            streamBufferRef.current = ''
            currentRunIdRef.current = null

            const params: Record<string, unknown> = {
                sessionKey: sessionKeyRef.current,
                message: text.trim(),
                deliver: true,
                timeoutMs: 120000,
                idempotencyKey: crypto.randomUUID()
            }

            if (attachments && attachments.length > 0) {
                params.attachments = attachments.map((att) => ({
                    type: att.type,
                    mimeType: att.source.mediaType,
                    content: att.source.data
                }))
            }

            clientRef.current.send('chat.send', params).catch((err: Error) => {
                console.error('[useAgentChat] chat.send failed:', err.message)
            })
        },
        []
    )

    const abortResponse = useCallback(() => {
        if (!clientRef.current || !currentRunIdRef.current) return

        clientRef.current
            .send('chat.abort', {
                sessionKey: sessionKeyRef.current,
                runId: currentRunIdRef.current
            })
            .catch(() => {})
    }, [])

    return {
        messages,
        connectionState,
        isLoading,
        isStreaming,
        sendMessage,
        abortResponse
    }
}

export default useAgentChat