import type { PageTitleProps } from '@/ts/Interfaces'
import { useEffect } from 'react'

export function PageTitle({ title }: PageTitleProps) {
  useEffect(() => {
    document.title = `${title} - ClawHost`
  }, [title])

  return null
}
