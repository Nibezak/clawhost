import type { FC, ReactNode } from 'react'
import type { ActionButtonProps } from '@/ts/Interfaces'
import { Button } from '@/components/ui/button'

const ActionButton: FC<ActionButtonProps> = ({ onClick, label, icon, size = 'default' }): ReactNode => {
  return (
    <Button
      onClick={onClick}
      size={size}
      className="gap-2 border-0 bg-gradient-to-r from-[#ef5350] to-[#c62828] text-white hover:opacity-90"
    >
      {icon}
      {label}
    </Button>
  )
}

export { ActionButton }
