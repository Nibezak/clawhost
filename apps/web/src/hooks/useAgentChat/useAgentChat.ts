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
import extractText from '@/hooks/useAgentChat/extractText'

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
            setIsLoading(false)
            return
        }

        const client = new GatewayClient(subdomain, gatewayToken, (state) => {
            if (!mountedRef.current) return
            console.error('[chat] state:', state)
            setConnectionState(state)

            if (state === 'error' || state === 'disconnected') {
                setIsLoading(false)
            }

            if (state === 'connected') {
                console.error('[chat] connected, loading sessions...')
                client
                    .send('sessions.list', {})
                    .then((result) => {
                        if (!mountedRef.current) return
                        console.error('[chat] sessions.list raw:', JSON.stringify(result).slice(0, 1000))
                        const raw = result as Record<string, unknown>
                        const sessions = Array.isArray(raw)
                            ? raw
                            : Array.isArray(
                                    (raw as Record<string, unknown>)
                                        ?.sessions
                                )
                              ? ((raw as Record<string, unknown>).sessions as Array<Record<string, unknown>>)
                              : []
                        console.error('[chat] parsed sessions:', sessions.length, 'items')
                        if (sessions.length > 0) {
                            const latest = sessions[
                                sessions.length - 1
                            ] as Record<string, unknown>
                            console.error('[chat] latest session:', JSON.stringify(latest).slice(0, 500))
                            const resolved = (latest.key ||
                                latest.sessionKey) as string | undefined
                            if (resolved) {
                                sessionKeyRef.current = resolved
                            }
                        }
                        console.error('[chat] using sessionKey:', sessionKeyRef.current)
                        return client.send('chat.history', {
                            sessionKey: sessionKeyRef.current,
                            limit: 500
                        })
                    })
                    .then((result) => {
                        if (!mountedRef.current) return
                        console.error('[chat] chat.history raw:', JSON.stringify(result).slice(0, 2000))
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
                        console.error('[chat] parsed history:', history.length, 'messages')
                        if (history.length > 0) {
                            const loaded: ChatMessage[] = []
                            for (let i = 0; i < history.length; i++) {
                                const msg = history[i]
                                if (
                                    msg.role === 'toolResult' ||
                                    msg.role === 'toolCall'
                                )
                                    continue
                                const text = extractText(msg.content)
                                if (!text.trim()) continue
                                loaded.push({
                                    id: `history-${i}`,
                                    role:
                                        msg.role === 'user'
                                            ? 'user'
                                            : 'assistant',
                                    content: text,
                                    status: 'complete' as const
                                })
                            }
                            console.error('[chat] loaded messages:', loaded.length)
                            setMessages(loaded)
                        }
                        setIsLoading(false)
                    })
                    .catch((err) => {
                        console.error('[chat] error loading:', err)
                        if (mountedRef.current) setIsLoading(false)
                    })
            }
        })

        clientRef.current = client

        const handleChatEvent = (payload: unknown) => {
            if (!mountedRef.current) return
            console.error('[chat] event:', JSON.stringify(payload).slice(0, 1000))

            const event = payload as ChatEventPayload
            const text = extractText(
                (event.message as Record<string, unknown>)?.content ??
                    event.message
            )

            if (event.state === 'delta' || event.state === 'final') {
                if (text) {
                    if (!currentRunIdRef.current) {
                        currentRunIdRef.current =
                            event.runId || crypto.randomUUID()
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
    }, [subdomain, gatewayToken, agentId, enabled, flushStreamBuffer])

    const sendMessage = useCallback((text: string) => {
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

        console.error('[chat] sending to session:', sessionKeyRef.current, 'message:', text.trim().slice(0, 100))
        clientRef.current
            .send('chat.send', {
                sessionKey: sessionKeyRef.current,
                message: text.trim(),
                deliver: true,
                timeoutMs: 120000,
                idempotencyKey: crypto.randomUUID()
            })
            .catch((err) => {
                console.error(err)
            })
    }, [])

    const abortResponse = useCallback(() => {
        if (!clientRef.current || !currentRunIdRef.current) return

        clientRef.current
            .send('chat.abort', {
                sessionKey: sessionKeyRef.current,
                runId: currentRunIdRef.current
            })
            .catch((err) => {
                console.error(err)
            })
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