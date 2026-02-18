import type { FC, ReactNode } from 'react'
import type { ClawLogsContentProps } from '@/ts/Interfaces'

import { useEffect, useMemo, useRef, useState } from 'react'
import { t } from '@openclaw/i18n'
import { Button, Skeleton } from '@/components/ui'
import { ArrowDownIcon, ScrollIcon } from '@phosphor-icons/react'
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
                    <div className='bg-foreground/5 h-full w-full animate-pulse' />
                )}
                {logs.isPending && !embedded && (
                    <Skeleton className='h-full w-full rounded-md border border-border' />
                )}
                {logs.isError && (
                    <PanelPlaceholder
                        icon={
                            <ScrollIcon
                                className='text-muted-foreground h-6 w-6'
                                weight='duotone'
                            />
                        }
                        title={t('api.failedToGetLogs')}
                        description={t('api.failedToGetLogsDescription')}
                    />
                )}
                {logs.data && !embedded && (
                    <pre className='overflow-auto whitespace-pre-wrap break-words rounded-md border border-border bg-muted p-3 text-xs leading-snug text-muted-foreground'>
                        {logs.data.logs || t('dashboard.diagnosticsNoLogs')}
                    </pre>
                )}
                {logs.data && embedded && (
                    <div
                        className={`flex flex-col gap-1 bg-muted/50 p-4 ${parsedLines.length === 0 ? 'h-full items-center justify-center' : ''}`}
                    >
                        {parsedLines.length === 0 && (
                            <PanelPlaceholder
                                icon={
                                    <ScrollIcon
                                        className='text-muted-foreground h-6 w-6'
                                        weight='duotone'
                                    />
                                }
                                title={t('dashboard.diagnosticsNoLogs')}
                                description=''
                            />
                        )}
                        {parsedLines.map((line, i) => (
                            <div key={i} className='flex gap-2'>
                                {line.time && (
                                    <span className='shrink-0 font-mono text-[10px] leading-4 text-muted-foreground/60'>
                                        {line.time}
                                    </span>
                                )}
                                <span className='min-w-0 whitespace-pre-wrap break-words font-mono text-xs text-foreground/80'>
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
                        <ArrowDownIcon className='mr-2 h-3.5 w-3.5' />
                        {t('dashboard.scrollToBottom')}
                    </Button>
                </div>
            )}
        </div>
    )
}

export default ClawLogsContent