import type { EmptyStateProps } from '@/ts/Interfaces'
import { Button } from '@/components/ui/button'
import { PlusCircle } from '@phosphor-icons/react'

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      <div className="from-primary/20 to-primary/5 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground mx-auto mb-6 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button size="lg" onClick={onAction}>
          <PlusCircle className="h-5 w-5" weight="bold" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
