import type { FC, ReactNode } from 'react'
import type { PageTitleProps } from '@/ts/Interfaces'
import { useEffect } from 'react'

const PageTitle: FC<PageTitleProps> = ({ title }): ReactNode => {
  useEffect(() => {
    document.title = `${title} - ClawHost`
  }, [title])

  return null
}

export { PageTitle }
