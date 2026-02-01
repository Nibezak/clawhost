import { Button } from '@/components/ui/button'
import { WarningCircle, ArrowClockwise } from '@phosphor-icons/react'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We couldn\'t load the data. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="py-12 text-center">
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <WarningCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        {description}
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <ArrowClockwise className="w-4 h-4" />
          Try again
        </Button>
      )}
    </div>
  )
}
