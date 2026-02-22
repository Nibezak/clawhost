import type { FC, ReactNode } from 'react'
import type { ClawCardDropdownMenuProps } from '@/ts/Interfaces'

import { t } from '@openclaw/i18n'
import { clawProvider, clawStatus } from '@openclaw/shared'
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui'
import {
    PlayIcon,
    SquareIcon,
    ArrowClockwiseIcon,
    TrashIcon,
    DotsThreeOutlineIcon,
    TerminalIcon,
    CheckIcon,
    CircleNotchIcon,
    CopyIcon,
    ClockCountdownIcon,
    FolderSimpleIcon,
    ArrowsClockwiseIcon,
    ArrowCounterClockwiseIcon,
    ExportIcon
} from '@phosphor-icons/react'

const ClawCardDropdownMenu: FC<ClawCardDropdownMenuProps> = ({
    claw,
    actions,
    isLoading,
    copied,
    passwordCopied,
    hasActionItems,
    isScheduledForDeletion,
    isAdmin,
    compact
}): ReactNode => {
    if (isLoading) {
        return compact ? (
            <button
                className='text-muted-foreground shrink-0 rounded-md p-1'
                disabled
            >
                <CircleNotchIcon className='h-3.5 w-3.5 animate-spin' />
            </button>
        ) : (
            <Button variant='ghost' size='icon' disabled>
                <CircleNotchIcon className='h-5 w-5 animate-spin' />
            </Button>
        )
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                {compact ? (
                    <button className='text-muted-foreground hover:bg-foreground/10 hover:text-foreground shrink-0 rounded-md p-1 transition-colors'>
                        <DotsThreeOutlineIcon
                            className='h-3.5 w-3.5'
                            weight='bold'
                        />
                    </button>
                ) : (
                    <Button variant='ghost' size='icon'>
                        <DotsThreeOutlineIcon className='h-5 w-5' />
                    </Button>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' collisionPadding={8}>
                {(claw.status === clawStatus.stopped ||
                    claw.status === clawStatus.off) && (
                    <DropdownMenuItem
                        onClick={actions.onStart}
                        disabled={isLoading}
                    >
                        <PlayIcon className='mr-2 h-4 w-4' />
                        {t('dashboard.start')}
                    </DropdownMenuItem>
                )}
                {claw.status === clawStatus.running && (
                    <>
                        <DropdownMenuItem
                            onClick={actions.onShowStopModal}
                            disabled={isLoading}
                        >
                            <SquareIcon className='mr-2 h-4 w-4' />
                            {t('dashboard.stop')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={actions.onShowRestartModal}
                            disabled={isLoading}
                        >
                            <ArrowClockwiseIcon className='mr-2 h-4 w-4' />
                            {t('dashboard.restart')}
                        </DropdownMenuItem>
                    </>
                )}
                {claw.provider !== clawProvider.local &&
                    (claw.ip || claw.rootPassword) && (
                        <>
                            {hasActionItems && <DropdownMenuSeparator />}
                            {claw.ip && (
                                <DropdownMenuItem onClick={actions.onCopySSH}>
                                    {copied ? (
                                        <>
                                            <CheckIcon className='mr-2 h-4 w-4' />
                                            {t('common.copied')}
                                        </>
                                    ) : (
                                        <>
                                            <TerminalIcon className='mr-2 h-4 w-4' />
                                            {t('dashboard.connect')}
                                        </>
                                    )}
                                </DropdownMenuItem>
                            )}
                            {claw.rootPassword && (
                                <DropdownMenuItem
                                    onClick={actions.onCopyPassword}
                                >
                                    {passwordCopied ? (
                                        <>
                                            <CheckIcon className='mr-2 h-4 w-4' />
                                            {t('common.copied')}
                                        </>
                                    ) : (
                                        <>
                                            <CopyIcon className='mr-2 h-4 w-4' />
                                            {t('dashboard.copyPassword')}
                                        </>
                                    )}
                                </DropdownMenuItem>
                            )}
                        </>
                    )}
                {claw.ip && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={actions.onShowConfig}>
                            <FolderSimpleIcon className='mr-2 h-4 w-4' />
                            {t('dashboard.fileExplorer')}
                        </DropdownMenuItem>
                        {claw.provider !== clawProvider.local && (
                            <DropdownMenuItem onClick={actions.onExport}>
                                <ExportIcon className='mr-2 h-4 w-4' />
                                {t('dashboard.exportData')}
                            </DropdownMenuItem>
                        )}
                        {claw.provider !== clawProvider.local && isAdmin && (
                            <>
                                <DropdownMenuItem
                                    onClick={actions.onUpdateInstance}
                                    disabled={isLoading}
                                >
                                    <ArrowsClockwiseIcon className='mr-2 h-4 w-4' />
                                    {t('dashboard.updateInstance')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={actions.onShowReinstallModal}
                                    disabled={isLoading}
                                >
                                    <ArrowCounterClockwiseIcon className='mr-2 h-4 w-4' />
                                    {t('dashboard.reinstallInstance')}
                                </DropdownMenuItem>
                            </>
                        )}
                    </>
                )}
                {(hasActionItems || claw.ip) && <DropdownMenuSeparator />}
                {claw.provider === clawProvider.local ? (
                    <DropdownMenuItem
                        onClick={actions.onShowDeleteModal}
                        disabled={isLoading}
                        className='text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400'
                    >
                        <TrashIcon className='mr-2 h-4 w-4' />
                        {t('common.delete')}
                    </DropdownMenuItem>
                ) : isScheduledForDeletion ? (
                    <>
                        <DropdownMenuItem
                            onClick={actions.onCancelDeletion}
                            className='text-orange-600 focus:text-orange-600 dark:text-orange-400 dark:focus:text-orange-400'
                        >
                            <ClockCountdownIcon className='mr-2 h-4 w-4' />
                            {t('dashboard.cancelDeletion')}
                        </DropdownMenuItem>
                        {isAdmin && (
                            <DropdownMenuItem
                                onClick={actions.onShowHardDeleteModal}
                                disabled={isLoading}
                                className='text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400'
                            >
                                <TrashIcon className='mr-2 h-4 w-4' />
                                {t('dashboard.hardDelete')}
                            </DropdownMenuItem>
                        )}
                    </>
                ) : (
                    <DropdownMenuItem
                        onClick={actions.onShowDeleteModal}
                        disabled={isLoading}
                        className='text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400'
                    >
                        <TrashIcon className='mr-2 h-4 w-4' />
                        {t('dashboard.scheduleDeletion')}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ClawCardDropdownMenu