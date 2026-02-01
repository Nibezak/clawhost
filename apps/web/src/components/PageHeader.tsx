import type { PageHeaderProps } from '@/ts/Interfaces'

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="font-clash text-2xl font-bold">{title}</h2>
        {description && <p className="mt-1 text-base text-gray-400">{description}</p>}
      </div>
      {action}
    </div>
  )
}
