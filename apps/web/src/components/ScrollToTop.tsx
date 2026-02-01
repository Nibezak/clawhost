import type { FC, ReactNode } from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop: FC = (): ReactNode => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export { ScrollToTop }
