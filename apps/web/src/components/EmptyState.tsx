import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle } from '@phosphor-icons/react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="lg" onClick={onAction}>
          <PlusCircle className="w-5 h-5" weight="bold" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
