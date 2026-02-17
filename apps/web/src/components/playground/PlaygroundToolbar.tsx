import type { FC, ReactNode } from 'react'
import type { PlaygroundToolbarProps } from '@/ts/Interfaces'

import { t } from '@openclaw/i18n'
import { CornersInIcon, ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui'

const PlaygroundToolbar: FC<PlaygroundToolbarProps> = ({
    zoom,
    onFitView,
    isFitView,
    nodesOutOfView,
    clawCount
}): ReactNode => {
    const percent = Math.round(zoom * 100)

    return (
        <div className='absolute bottom-4 left-4 z-10 flex items-center gap-2'>
            <div className='flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#151518]/90 px-3 py-1.5 backdrop-blur-sm'>
                <span className='font-mono text-xs text-gray-400'>
                    {t('playground.zoomLabel', { percent: String(percent) })}
                </span>
            </div>
            {nodesOutOfView ? (
                <button
                    onClick={onFitView}
                    className='playground-reset-enter flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-red-400 backdrop-blur-sm transition-colors hover:bg-red-500/20 hover:text-red-300'
                >
                    <ArrowCounterClockwiseIcon className='h-4 w-4' weight='bold' />
                    <span className='text-xs font-medium'>
                        {clawCount === 1
                            ? t('playground.nodeOutOfView')
                            : t('playground.nodesOutOfView')}
                    </span>
                </button>
            ) : isFitView ? (
                <button
                    disabled
                    className='flex cursor-default items-center gap-1.5 rounded-lg border border-white/10 bg-[#151518]/90 px-2.5 py-1.5 text-gray-600 backdrop-blur-sm'
                >
                    <CornersInIcon className='h-4 w-4' weight='bold' />
                </button>
            ) : (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={onFitView}
                            className='flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#151518]/90 px-2.5 py-1.5 text-gray-400 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white'
                        >
                            <CornersInIcon className='h-4 w-4' weight='bold' />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side='top'>
                        <p>{t('playground.fitView')}</p>
                    </TooltipContent>
                </Tooltip>
            )}
        </div>
    )
}

export default PlaygroundToolbar