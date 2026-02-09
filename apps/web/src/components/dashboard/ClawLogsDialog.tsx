import type { FC, ReactNode } from 'react'
import type { ClawLogsDialogProps } from '@/ts/Interfaces'

import { useEffect, useRef, useState } from 'react'
import { t } from '@openclaw/i18n'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { ArrowDown } from '@phosphor-icons/react'
import { Skeleton } from '@/components/ui/skeleton'
import { useClawLogs } from '@/hooks'

const ClawLogsDialog: FC<ClawLogsDialogProps> = ({
    clawId,
    open,
    onOpenChange
}): ReactNode => {
    const logs = useClawLogs(clawId, open)
    const scrollRef = useRef<HTMLDivElement>(null)
    const isAtBottomRef = useRef(true)
    const isFirstLoadRef = useRef(true)
    const [showScrollButton, setShowScrollButton] = useState(false)

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
        if (!open) {
            isFirstLoadRef.current = true
            isAtBottomRef.current = true
            setShowScrollButton(false)
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='flex max-h-[80vh] max-w-2xl flex-col'>
                <DialogHeader>
                    <DialogTitle>{t('dashboard.diagnosticsLogs')}</DialogTitle>
                    <DialogDescription>
                        {t('dashboard.logsDescription')}
                    </DialogDescription>
                </DialogHeader>

                <div className='relative mt-4 h-[600px]'>
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className='h-full overflow-y-auto'
                    >
                        {logs.isPending && (
                            <Skeleton className='h-full w-full rounded-md border border-zinc-800' />
                        )}
                        {logs.isError && (
                            <div className='text-sm text-red-400'>
                                {logs.error?.message ||
                                    t('api.failedToGetDiagnostics')}
                            </div>
                        )}
                        {logs.data && (
                            <pre className='overflow-auto rounded-md border border-zinc-800 bg-black p-3 text-xs leading-snug text-zinc-300'>
                                {logs.data.logs ||
                                    t('dashboard.diagnosticsNoLogs')}
                            </pre>
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
            </DialogContent>
        </Dialog>
    )
}

export default ClawLogsDialog