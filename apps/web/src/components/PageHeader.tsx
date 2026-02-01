import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="font-clash text-2xl font-bold">{title}</h2>
        {description && (
          <p className="text-gray-400 text-base mt-1">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
