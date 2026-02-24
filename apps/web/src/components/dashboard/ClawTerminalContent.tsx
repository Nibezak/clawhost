import type { FC, ReactNode } from 'react'
import type { ClawTerminalContentProps } from '@/ts/Interfaces'

import { useEffect, useRef, useCallback, useState } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { t } from '@openclaw/i18n'
import { getCachedToken } from '@/lib/firebase'
import { CircleNotchIcon, TerminalWindowIcon, ArrowClockwiseIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui'
import { PanelPlaceholder } from '@/components'
import '@xterm/xterm/css/xterm.css'

const ClawTerminalContent: FC<ClawTerminalContentProps> = ({
    clawId,
    enabled
}): ReactNode => {
    const containerRef = useRef<HTMLDivElement>(null)
    const terminalRef = useRef<Terminal | null>(null)
    const fitAddonRef = useRef<FitAddon | null>(null)
    const wsRef = useRef<WebSocket | null>(null)
    const observerRef = useRef<ResizeObserver | null>(null)
    const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error' | 'disconnected'>('idle')

    const cleanup = useCallback(() => {
        if (observerRef.current) {
            observerRef.current.disconnect()
            observerRef.current = null
        }
        if (wsRef.current) {
            wsRef.current.close()
            wsRef.current = null
        }
        if (terminalRef.current) {
            terminalRef.current.dispose()
            terminalRef.current = null
        }
        fitAddonRef.current = null
    }, [])

    const connect = useCallback(async () => {
        cleanup()
        if (!containerRef.current) return

        setStatus('connecting')

        const token = await getCachedToken()
        if (!token) {
            setStatus('error')
            return
        }

        const container = containerRef.current
        if (!container) {
            setStatus('error')
            return
        }

        const terminal = new Terminal({
            cursorBlink: true,
            fontSize: 13,
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
            theme: {
                background: '#18181b',
                foreground: '#e4e4e7',
                cursor: '#ef5350',
                selectionBackground: '#ef535040',
                black: '#09090b',
                red: '#ef5350',
                green: '#4ade80',
                yellow: '#facc15',
                blue: '#60a5fa',
                magenta: '#c084fc',
                cyan: '#22d3ee',
                white: '#e4e4e7',
                brightBlack: '#52525b',
                brightRed: '#f87171',
                brightGreen: '#86efac',
                brightYellow: '#fde047',
                brightBlue: '#93c5fd',
                brightMagenta: '#d8b4fe',
                brightCyan: '#67e8f9',
                brightWhite: '#fafafa'
            }
        })

        const fitAddon = new FitAddon()
        terminal.loadAddon(fitAddon)
        terminal.open(container)

        terminalRef.current = terminal
        fitAddonRef.current = fitAddon

        requestAnimationFrame(() => {
            fitAddon.fit()
        })

        const observer = new ResizeObserver(() => {
            requestAnimationFrame(() => {
                if (fitAddonRef.current) {
                    fitAddonRef.current.fit()
                }
            })
        })
        observer.observe(container)
        observerRef.current = observer

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const wsUrl = `${protocol}//${window.location.host}/ws/claws/${clawId}/terminal?token=${encodeURIComponent(token)}`
        const ws = new WebSocket(wsUrl)
        wsRef.current = ws

        ws.onopen = () => {
            setStatus('connected')
            ws.send(JSON.stringify({
                type: 'resize',
                cols: terminal.cols,
                rows: terminal.rows
            }))
            requestAnimationFrame(() => {
                fitAddon.fit()
                terminal.focus()
            })
        }

        ws.onmessage = (event) => {
            terminal.write(event.data)
        }

        ws.onclose = () => {
            setStatus((prev) => prev === 'error' ? 'error' : 'disconnected')
        }

        ws.onerror = () => {
            setStatus('error')
        }

        terminal.onData((data) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(data)
            }
        })

        terminal.onResize(({ cols, rows }) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'resize', cols, rows }))
            }
        })
    }, [clawId, cleanup])

    useEffect(() => {
        if (enabled) {
            connect()
        } else {
            cleanup()
            setStatus('idle')
        }

        return cleanup
    }, [enabled, connect, cleanup])

    const showOverlay = status === 'connecting' || status === 'error' || status === 'disconnected'

    return (
        <div
            className='relative h-full w-full bg-[#18181b]'
            onKeyDown={(e) => e.stopPropagation()}
        >
            <div
                className={`h-full w-full p-2 ${showOverlay ? 'opacity-0' : ''}`}
                onMouseDown={(e) => {
                    if (terminalRef.current && e.target === e.currentTarget) {
                        e.preventDefault()
                        terminalRef.current.focus()
                    }
                }}
            >
                <div ref={containerRef} className='h-full w-full overflow-hidden' />
            </div>
            {showOverlay && (
                <div className='absolute inset-0 flex items-center justify-center bg-[#18181b]'>
                    {status === 'connecting' && (
                        <div className='flex flex-col items-center gap-3'>
                            <CircleNotchIcon className='text-muted-foreground h-6 w-6 animate-spin' />
                            <span className='text-muted-foreground text-xs'>
                                {t('playground.terminalConnecting')}
                            </span>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className='flex flex-col items-center gap-3'>
                            <PanelPlaceholder
                                icon={
                                    <TerminalWindowIcon
                                        className='text-muted-foreground h-6 w-6'
                                        weight='duotone'
                                    />
                                }
                                title={t('playground.terminalError')}
                                description=''
                            />
                            <Button size='sm' variant='outline' onClick={connect}>
                                <ArrowClockwiseIcon className='mr-2 h-3.5 w-3.5' />
                                {t('playground.terminalReconnect')}
                            </Button>
                        </div>
                    )}
                    {status === 'disconnected' && (
                        <div className='flex flex-col items-center gap-3'>
                            <PanelPlaceholder
                                icon={
                                    <TerminalWindowIcon
                                        className='text-muted-foreground h-6 w-6'
                                        weight='duotone'
                                    />
                                }
                                title={t('playground.terminalDisconnected')}
                                description=''
                            />
                            <Button size='sm' variant='outline' onClick={connect}>
                                <ArrowClockwiseIcon className='mr-2 h-3.5 w-3.5' />
                                {t('playground.terminalReconnect')}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ClawTerminalContent