import type { FC, ReactNode } from 'react'
import type { PanelPlaceholderProps } from '@/ts/Interfaces'

const PanelPlaceholder: FC<PanelPlaceholderProps> = ({
    icon,
    title,
    description
}): ReactNode => {
    return (
        <div className='flex h-full flex-col items-center justify-center gap-3 px-14 pb-16'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/5'>
                {icon}
            </div>
            <div className='text-center'>
                <p className='text-sm font-medium text-gray-300'>
                    {title}
                </p>
                <p className='mt-1 text-xs text-gray-500'>
                    {description}
                </p>
            </div>
        </div>
    )
}

export default PanelPlaceholder