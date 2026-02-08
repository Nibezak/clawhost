import type { FC, ReactNode } from 'react'
import type { ClawCardDialogsProps } from '@/ts/Interfaces'
import { t } from '@openclaw/i18n'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { CircleNotch } from '@phosphor-icons/react'

const ClawCardDialogs: FC<ClawCardDialogsProps> = ({
    clawName,
    showDeleteModal,
    setShowDeleteModal,
    showStopModal,
    setShowStopModal,
    showRestartModal,
    setShowRestartModal,
    onDelete,
    onStop,
    onRestart,
    isDeletePending,
    isStopPending,
    isRestartPending
}): ReactNode => {
    return (
        <>
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('dashboard.deleteClaw')}</DialogTitle>
                        <DialogDescription>
                            {t('dashboard.deleteClawConfirmation')}{' '}
                            <strong>{clawName}</strong>?{' '}
                            {t('dashboard.deleteClawWarning')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className='mt-4 flex justify-end gap-3'>
                        <Button
                            variant='outline'
                            onClick={() => setShowDeleteModal(false)}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant='destructive'
                            onClick={() => {
                                onDelete()
                                setShowDeleteModal(false)
                            }}
                            disabled={isDeletePending}
                        >
                            {isDeletePending ? (
                                <>
                                    <CircleNotch className='mr-2 h-4 w-4 animate-spin' />
                                    {t('dashboard.deleting')}
                                </>
                            ) : (
                                t('dashboard.scheduleDeletion')
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showStopModal} onOpenChange={setShowStopModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('dashboard.stopClaw')}</DialogTitle>
                        <DialogDescription>
                            {t('dashboard.stopClawConfirmation')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className='mt-4 flex justify-end gap-3'>
                        <Button
                            variant='outline'
                            onClick={() => setShowStopModal(false)}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant='destructive'
                            onClick={() => {
                                onStop()
                                setShowStopModal(false)
                            }}
                            disabled={isStopPending}
                        >
                            {isStopPending ? (
                                <>
                                    <CircleNotch className='mr-2 h-4 w-4 animate-spin' />
                                    {t('dashboard.stopping')}
                                </>
                            ) : (
                                t('dashboard.stop')
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showRestartModal} onOpenChange={setShowRestartModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('dashboard.restartClaw')}</DialogTitle>
                        <DialogDescription>
                            {t('dashboard.restartClawConfirmation')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className='mt-4 flex justify-end gap-3'>
                        <Button
                            variant='outline'
                            onClick={() => setShowRestartModal(false)}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant='destructive'
                            onClick={() => {
                                onRestart()
                                setShowRestartModal(false)
                            }}
                            disabled={isRestartPending}
                        >
                            {isRestartPending ? (
                                <>
                                    <CircleNotch className='mr-2 h-4 w-4 animate-spin' />
                                    {t('dashboard.restarting')}
                                </>
                            ) : (
                                t('dashboard.restart')
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export { ClawCardDialogs }