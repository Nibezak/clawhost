import type {
    ChatEventPayload,
    ChatHistoryEntry,
    ChatMessage,
    UseAgentChatParams,
    UseAgentChatReturn
} from '@/ts/Interfaces'
import type { GatewayConnectionState } from '@/ts/Types'

import { useState, useEffect, useRef, useCallback } from 'react'
import GatewayClient from '@/lib/gateway/GatewayClient'

const extractText = (content: unknown): string => {
    if (typeof content === 'string') return content
    if (Array.isArray(content)) {
        return content
            .filter((c) => c.type === 'text')
            .map((c) => c.text)
            .join('\n')
    }
    return ''
}

const useAgentChat = ({
    subdomain,
    gatewayToken,
    agentId,
    enabled
}: UseAgentChatParams): UseAgentChatReturn => {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [connectionState, setConnectionState] =
        useState<GatewayConnectionState>('disconnected')
    const [isStreaming, setIsStreaming] = useState(false)
    const clientRef = useRef<GatewayClient | null>(null)
    const currentRunIdRef = useRef<string | null>(null)
    const streamBufferRef = useRef('')
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
            return
        }

        const client = new GatewayClient(subdomain, gatewayToken, (state) => {
            if (!mountedRef.current) return
            setConnectionState(state)

            if (state === 'connected') {
                client
                    .send('sessions.list', {})
                    .then((result) => {
                        if (!mountedRef.current) return
                        const sessions = result as Array<Record<string, unknown>>
                        if (Array.isArray(sessions) && sessions.length > 0) {
                            const latest = sessions[sessions.length - 1]
                            sessionKeyRef.current = (latest.key || latest.sessionKey || `agent:${agentId}:main`) as string
                        }
                        return client.send('chat.history', {
                            sessionKey: sessionKeyRef.current,
                            limit: 500
                        })
                    })
                    .then((result) => {
                        if (!mountedRef.current) return
                        const data = result as Record<string, unknown>
                        const history = (data?.messages || []) as ChatHistoryEntry[]
                        if (Array.isArray(history) && history.length > 0) {
                            const loaded: ChatMessage[] = []
                            for (let i = 0; i < history.length; i++) {
                                const msg = history[i]
                                if (msg.role === 'toolResult' || msg.role === 'toolCall') continue
                                const text = extractText(msg.content)
                                if (!text.trim()) continue
                                loaded.push({
                                    id: `history-${i}`,
                                    role: msg.role === 'user' ? 'user' : 'assistant',
                                    content: text,
                                    status: 'complete' as const
                                })
                            }
                            setMessages(loaded)
                        }
                    })
                    .catch(() => {})
            }
        })

        clientRef.current = client

        const handleChatEvent = (payload: unknown) => {
            if (!mountedRef.current) return

            const event = payload as ChatEventPayload
            const text = extractText(
                (event.message as Record<string, unknown>)?.content ?? event.message
            )

            if (event.state === 'delta' || event.state === 'final') {
                if (text) {
                    if (!currentRunIdRef.current) {
                        currentRunIdRef.current = event.runId || crypto.randomUUID()
                        setIsStreaming(true)
                        streamBufferRef.current = text
                        setMessages((prev) => [
                            ...prev,
                            {
                                id: currentRunIdRef.current!,
                                role: 'assistant',
                                content: text,
                                status: 'streaming',
                                runId: currentRunIdRef.current!
                            }
                        ])
                    } else {
                        streamBufferRef.current = text
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
                    setMessages((prev) => {
                        const last = prev[prev.length - 1]
                        if (last && last.status === 'streaming') {
                            return [
                                ...prev.slice(0, -1),
                                {
                                    ...last,
                                    content: finalContent || last.content,
                                    status: 'complete' as const
                                }
                            ]
                        }
                        return prev
                    })
                    currentRunIdRef.current = null
                    streamBufferRef.current = ''
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
                setIsStreaming(false)
            }
        }

        client.on('chat', handleChatEvent)
        client.connect()

        return () => {
            mountedRef.current = false
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
                rafRef.current = null
            }
            client.disconnect()
            clientRef.current = null
        }
    }, [
        subdomain,
        gatewayToken,
        agentId,
        enabled,
        flushStreamBuffer
    ])

    const sendMessage = useCallback(
        (text: string) => {
            if (!clientRef.current || !text.trim()) return

            const userMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'user',
                content: text.trim(),
                status: 'complete'
            }

            setMessages((prev) => [...prev, userMessage])
            streamBufferRef.current = ''
            currentRunIdRef.current = null

            clientRef.current
                .send('chat.send', {
                    sessionKey: sessionKeyRef.current,
                    message: text.trim(),
                    deliver: false,
                    timeoutMs: 120000,
                    idempotencyKey: crypto.randomUUID()
                })
                .catch(() => {})
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
        isStreaming,
        sendMessage,
        abortResponse
    }
}

export default useAgentChat