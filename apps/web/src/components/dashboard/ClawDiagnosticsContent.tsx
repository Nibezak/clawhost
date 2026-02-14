import type { FC, ReactNode } from 'react'
import type { ClawDiagnosticsContentProps } from '@/ts/Interfaces'

import { t } from '@openclaw/i18n'
import { Button } from '@/components/ui/button'
import {
    CircleNotch,
    Wrench,
    CheckCircle,
    Warning,
    Pulse
} from '@phosphor-icons/react'
import { Skeleton } from '@/components/ui/skeleton'
import { useClawDiagnostics, useRepairClaw } from '@/hooks'
import PanelPlaceholder from '@/components/PanelPlaceholder'
import useUIStore from '@/lib/store/useUIStore'

const ClawDiagnosticsContent: FC<ClawDiagnosticsContentProps> = ({
    clawId,
    enabled,
    mockData
}): ReactNode => {
    const query = useClawDiagnostics(clawId, enabled && !mockData)
    const diagnostics = mockData
        ? { data: mockData, isPending: false, isError: false }
        : query
    const repair = useRepairClaw()
    const showToast = useUIStore((s) => s.showToast)

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
        <div className='h-full overflow-y-auto'>
            {diagnostics.isError && (
                <PanelPlaceholder
                    icon={<Pulse className='h-6 w-6 text-gray-500' weight='duotone' />}
                    title={t('api.failedToGetDiagnostics')}
                    description={t('api.failedToGetDiagnosticsDescription')}
                />
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
                                {t('dashboard.diagnosticsIssueDetected')}
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
                                        {t('dashboard.diagnosticsRepair')}
                                        ...
                                    </>
                                ) : (
                                    <>
                                        <Wrench className='mr-2 h-3.5 w-3.5' />
                                        {t('dashboard.diagnosticsRepair')}
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
    )
}

export default ClawDiagnosticsContent