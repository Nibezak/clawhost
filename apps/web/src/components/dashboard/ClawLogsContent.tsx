import type { FC, ReactNode } from 'react'
import type { ClawLogsContentProps } from '@/ts/Interfaces'

import { useEffect, useMemo, useRef, useState } from 'react'
import { t } from '@openclaw/i18n'
import { Button, Skeleton } from '@/components/ui'
import { ArrowDown, Scroll } from '@phosphor-icons/react'
import { useClawLogs } from '@/hooks'
import { PanelPlaceholder } from '@/components'

const ClawLogsContent: FC<ClawLogsContentProps> = ({
    clawId,
    enabled,
    embedded,
    mockLogs
}): ReactNode => {
    const query = useClawLogs(clawId, enabled && !mockLogs)
    const logs = mockLogs
        ? { data: { logs: mockLogs }, isPending: false, isError: false }
        : query
    const scrollRef = useRef<HTMLDivElement>(null)
    const isAtBottomRef = useRef(true)
    const isFirstLoadRef = useRef(true)
    const [showScrollButton, setShowScrollButton] = useState(false)
    const timestampRegex =
        /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?)\s*/

    const parsedLines = useMemo(() => {
        if (!embedded || !logs.data?.logs) return []
        return logs.data.logs
            .split('\n')
            .filter((line) => line.trim())
            .map((line) => {
                const match = line.match(timestampRegex)
                if (match) {
                    const raw = match[1]
                    const date = new Date(raw)
                    const time = date.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    })
                    return { time, text: line.slice(match[0].length) }
                }
                return { time: null, text: line }
            })
    }, [embedded, logs.data])

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
            setShowScrollButton(false)
            isAtBottomRef.current = true
        }
    }

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
            const atBottom = scrollHeight - scrollTop - clientHeight < 50
            isAtBottomRef.current = atBottom
            if (atBottom) {
                setShowScrollButton(false)
            }
        }
    }

    useEffect(() => {
        if (logs.data) {
            if (isFirstLoadRef.current) {
                setTimeout(scrollToBottom, 0)
                isFirstLoadRef.current = false
            } else if (isAtBottomRef.current) {
                setTimeout(scrollToBottom, 0)
            } else {
                setShowScrollButton(true)
            }
        }
    }, [logs.data])

    useEffect(() => {
        if (!enabled) {
            isFirstLoadRef.current = true
            isAtBottomRef.current = true
            setShowScrollButton(false)
        }
    }, [enabled])

    return (
        <div
            className={`relative ${embedded ? 'flex min-h-0 flex-1 flex-col' : 'h-full'}`}
        >
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className={`overflow-y-auto ${embedded ? 'min-h-0 flex-1' : 'h-full'}`}
            >
                {logs.isPending && embedded && (
                    <div className='h-full w-full animate-pulse bg-white/5' />
                )}
                {logs.isPending && !embedded && (
                    <Skeleton className='h-full w-full rounded-md border border-zinc-800' />
                )}
                {logs.isError && (
                    <PanelPlaceholder
                        icon={
                            <Scroll
                                className='h-6 w-6 text-gray-500'
                                weight='duotone'
                            />
                        }
                        title={t('api.failedToGetLogs')}
                        description={t('api.failedToGetLogsDescription')}
                    />
                )}
                {logs.data && !embedded && (
                    <pre className='overflow-auto whitespace-pre-wrap break-words rounded-md border border-zinc-800 bg-black p-3 text-xs leading-snug text-zinc-300'>
                        {logs.data.logs || t('dashboard.diagnosticsNoLogs')}
                    </pre>
                )}
                {logs.data && embedded && (
                    <div className='flex flex-col gap-1 bg-black/50 p-4'>
                        {parsedLines.length === 0 && (
                            <span className='text-xs text-zinc-500'>
                                {t('dashboard.diagnosticsNoLogs')}
                            </span>
                        )}
                        {parsedLines.map((line, i) => (
                            <div key={i} className='flex gap-2'>
                                {line.time && (
                                    <span className='shrink-0 font-mono text-[10px] leading-4 text-zinc-600'>
                                        {line.time}
                                    </span>
                                )}
                                <span className='min-w-0 whitespace-pre-wrap break-words font-mono text-xs text-zinc-300'>
                                    {line.text}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showScrollButton && (
                <div className='absolute bottom-3 left-1/2 -translate-x-1/2'>
                    <Button
                        size='sm'
                        variant='outline'
                        className='shadow-lg'
                        onClick={scrollToBottom}
                    >
                        <ArrowDown className='mr-2 h-3.5 w-3.5' />
                        {t('dashboard.scrollToBottom')}
                    </Button>
                </div>
            )}
        </div>
    )
}

export default ClawLogsContent