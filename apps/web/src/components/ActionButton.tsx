import type { FC, ReactNode } from 'react'
import type { ActionButtonProps } from '@/ts/Interfaces'
import { Button } from '@/components/ui/button'

const ActionButton: FC<ActionButtonProps> = ({
    onClick,
    label,
    icon,
    size = 'default'
}): ReactNode => {
    return (
        <Button
            onClick={onClick}
            size={size}
            className='gap-2 border border-white/20 bg-white text-black hover:bg-white/90'
        >
            {icon}
            {label}
        </Button>
    )
}

export { ActionButton }