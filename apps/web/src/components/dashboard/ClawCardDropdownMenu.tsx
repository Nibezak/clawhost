import type { FC, ReactNode } from 'react'
import type { ClawCardDropdownMenuProps } from '@/ts/Interfaces'

import { t } from '@openclaw/i18n'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
    Play,
    Square,
    ArrowClockwise,
    Trash,
    DotsThreeOutline,
    Terminal,
    Check,
    CircleNotch,
    Copy,
    ClockCountdown,
    Pulse,
    Scroll,
    FolderSimple,
    ArrowsClockwise,
    ArrowCounterClockwise,
    Export
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
    const iconSize = compact ? 'h-4 w-4' : 'h-5 w-5'
    const buttonClassName = compact ? 'h-8 w-8' : undefined

    if (isLoading) {
        return (
            <Button
                variant='ghost'
                size='icon'
                className={buttonClassName}
                disabled
            >
                <CircleNotch className={`${iconSize} animate-spin`} />
            </Button>
        )
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className={buttonClassName}>
                    <DotsThreeOutline className={iconSize} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' collisionPadding={8}>
                {(claw.status === 'stopped' || claw.status === 'off') && (
                    <DropdownMenuItem
                        onClick={actions.onStart}
                        disabled={isLoading}
                    >
                        <Play className='mr-2 h-4 w-4' />
                        {t('dashboard.start')}
                    </DropdownMenuItem>
                )}
                {claw.status === 'running' && (
                    <>
                        <DropdownMenuItem
                            onClick={actions.onShowStopModal}
                            disabled={isLoading}
                        >
                            <Square className='mr-2 h-4 w-4' />
                            {t('dashboard.stop')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={actions.onShowRestartModal}
                            disabled={isLoading}
                        >
                            <ArrowClockwise className='mr-2 h-4 w-4' />
                            {t('dashboard.restart')}
                        </DropdownMenuItem>
                    </>
                )}
                {(claw.ip || claw.rootPassword) && (
                    <>
                        {hasActionItems && <DropdownMenuSeparator />}
                        {claw.ip && (
                            <DropdownMenuItem onClick={actions.onCopySSH}>
                                {copied ? (
                                    <>
                                        <Check className='mr-2 h-4 w-4' />
                                        {t('common.copied')}
                                    </>
                                ) : (
                                    <>
                                        <Terminal className='mr-2 h-4 w-4' />
                                        {t('dashboard.connect')}
                                    </>
                                )}
                            </DropdownMenuItem>
                        )}
                        {claw.rootPassword && (
                            <DropdownMenuItem onClick={actions.onCopyPassword}>
                                {passwordCopied ? (
                                    <>
                                        <Check className='mr-2 h-4 w-4' />
                                        {t('common.copied')}
                                    </>
                                ) : (
                                    <>
                                        <Copy className='mr-2 h-4 w-4' />
                                        {t('dashboard.copyPassword')}
                                    </>
                                )}
                            </DropdownMenuItem>
                        )}
                    </>
                )}
                {claw.ip && claw.rootPassword && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={actions.onShowDiagnostics}>
                            <Pulse className='mr-2 h-4 w-4' />
                            {t('dashboard.diagnostics')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={actions.onShowLogs}>
                            <Scroll className='mr-2 h-4 w-4' />
                            {t('dashboard.diagnosticsLogs')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={actions.onShowConfig}>
                            <FolderSimple className='mr-2 h-4 w-4' />
                            {t('dashboard.fileExplorer')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={actions.onExport}>
                            <Export className='mr-2 h-4 w-4' />
                            {t('dashboard.exportData')}
                        </DropdownMenuItem>
                        {isAdmin && (
                            <>
                                <DropdownMenuItem
                                    onClick={actions.onUpdateInstance}
                                    disabled={isLoading}
                                >
                                    <ArrowsClockwise className='mr-2 h-4 w-4' />
                                    {t('dashboard.updateInstance')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={actions.onShowReinstallModal}
                                    disabled={isLoading}
                                >
                                    <ArrowCounterClockwise className='mr-2 h-4 w-4' />
                                    {t('dashboard.reinstallInstance')}
                                </DropdownMenuItem>
                            </>
                        )}
                    </>
                )}
                {(hasActionItems || claw.rootPassword) && (
                    <DropdownMenuSeparator />
                )}
                {isScheduledForDeletion ? (
                    <>
                        <DropdownMenuItem
                            onClick={actions.onCancelDeletion}
                            className='text-orange-400 focus:text-orange-400'
                        >
                            <ClockCountdown className='mr-2 h-4 w-4' />
                            {t('dashboard.cancelDeletion')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={actions.onShowHardDeleteModal}
                            disabled={isLoading}
                            className='text-red-400 focus:text-red-400'
                        >
                            <Trash className='mr-2 h-4 w-4' />
                            {t('dashboard.hardDelete')}
                        </DropdownMenuItem>
                    </>
                ) : (
                    <DropdownMenuItem
                        onClick={actions.onShowDeleteModal}
                        disabled={isLoading}
                        className='text-red-400 focus:text-red-400'
                    >
                        <Trash className='mr-2 h-4 w-4' />
                        {t('dashboard.scheduleDeletion')}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export { ClawCardDropdownMenu }