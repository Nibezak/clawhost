import type { FC, ReactNode } from 'react'
import type { ClawDiagnosticsDialogProps } from '@/ts/Interfaces'

import { t } from '@openclaw/i18n'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import {
    CircleNotch,
    Wrench,
    CheckCircle,
    Warning
} from '@phosphor-icons/react'
import { Skeleton } from '@/components/ui/skeleton'
import { useClawDiagnostics, useRepairClaw } from '@/hooks'
import useUIStore from '@/lib/store/useUIStore'

const ClawDiagnosticsDialog: FC<ClawDiagnosticsDialogProps> = ({
    clawId,
    open,
    onOpenChange
}): ReactNode => {
    const diagnostics = useClawDiagnostics(clawId, open)
    const repair = useRepairClaw()
    const showToast = useUIStore((s) => s.showToast)

    const handleOpen = (isOpen: boolean) => {
        if (!isOpen) {
            repair.reset()
        }
        onOpenChange(isOpen)
    }

    const handleRepair = () => {
        repair.mutate(clawId, {
            onSuccess: () => {
                showToast(t('dashboard.diagnosticsRepairSuccess'), 'success')
            },
            onError: (err) => {
                showToast(err.message || t('api.failedToRepairClaw'), 'error')
            }
        })
    }

    const hasIssue =
        diagnostics.data &&
        (!diagnostics.data.service.includes('active (running)') ||
            diagnostics.data.port.includes('not listening'))

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogContent className='flex max-h-[80vh] max-w-2xl flex-col'>
                <DialogHeader>
                    <DialogTitle>{t('dashboard.diagnostics')}</DialogTitle>
                    <DialogDescription>
                        {t('dashboard.diagnosticsDescription')}
                    </DialogDescription>
                </DialogHeader>

                <div className='mt-4 h-[600px] overflow-y-auto'>
                    {diagnostics.isError && (
                        <div className='text-sm text-red-400'>
                            {diagnostics.error?.message ||
                                t('api.failedToGetDiagnostics')}
                        </div>
                    )}
                    {(diagnostics.isPending || diagnostics.data) && (
                        <div className='space-y-5'>
                            {diagnostics.isPending && (
                                <Skeleton className='h-[42px] w-full rounded-md' />
                            )}
                            {diagnostics.data && hasIssue && (
                                <div className='flex items-center justify-between rounded-md bg-yellow-950/50 p-3 text-sm text-yellow-400'>
                                    <div className='flex items-center gap-2'>
                                        <Warning className='h-4 w-4 shrink-0' />
                                        {t(
                                            'dashboard.diagnosticsIssueDetected'
                                        )}
                                    </div>
                                    <Button
                                        size='sm'
                                        variant='outline'
                                        className='shrink-0 border-yellow-400/30 text-yellow-400 hover:bg-yellow-950 hover:text-yellow-300'
                                        onClick={handleRepair}
                                        disabled={repair.isPending}
                                    >
                                        {repair.isPending ? (
                                            <>
                                                <CircleNotch className='mr-2 h-3.5 w-3.5 animate-spin' />
                                                {t(
                                                    'dashboard.diagnosticsRepair'
                                                )}
                                                ...
                                            </>
                                        ) : (
                                            <>
                                                <Wrench className='mr-2 h-3.5 w-3.5' />
                                                {t(
                                                    'dashboard.diagnosticsRepair'
                                                )}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                            {diagnostics.data && !hasIssue && (
                                <div className='flex items-center gap-2 rounded-md bg-green-950/50 p-3 text-sm text-green-400'>
                                    <CheckCircle className='h-4 w-4 shrink-0' />
                                    {t('dashboard.diagnosticsHealthy')}
                                </div>
                            )}
                            <div>
                                <p className='text-muted-foreground mb-1 text-sm font-medium'>
                                    {t('dashboard.diagnosticsStatus')}
                                </p>
                                {diagnostics.isPending ? (
                                    <Skeleton className='h-[250px] w-full rounded-md border border-zinc-800' />
                                ) : (
                                    <pre className='h-[250px] overflow-auto rounded-md border border-zinc-800 bg-black p-3 text-xs leading-snug text-zinc-300'>
                                        {diagnostics.data?.service}
                                    </pre>
                                )}
                            </div>
                            <div>
                                <p className='text-muted-foreground mb-1 text-sm font-medium'>
                                    {t('dashboard.diagnosticsPort')}
                                </p>
                                {diagnostics.isPending ? (
                                    <Skeleton className='h-[70px] w-full rounded-md border border-zinc-800' />
                                ) : (
                                    <pre className='h-[70px] overflow-auto rounded-md border border-zinc-800 bg-black p-3 text-xs leading-snug text-zinc-300'>
                                        {diagnostics.data?.port}
                                    </pre>
                                )}
                            </div>
                            <div>
                                <p className='text-muted-foreground mb-1 text-sm font-medium'>
                                    {t('dashboard.diagnosticsMemory')}
                                </p>
                                {diagnostics.isPending ? (
                                    <Skeleton className='h-[80px] w-full rounded-md border border-zinc-800' />
                                ) : (
                                    <pre className='h-[80px] overflow-auto rounded-md border border-zinc-800 bg-black p-3 text-xs leading-snug text-zinc-300'>
                                        {diagnostics.data?.memory}
                                    </pre>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ClawDiagnosticsDialog