import type { FC, ReactNode } from 'react'
import type { PageTitleProps } from '@/ts/Interfaces'
import { useEffect } from 'react'

const setMetaTag = (attr: string, key: string, content: string) => {
  let meta = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attr, key)
    document.head.appendChild(meta)
  }
  meta.content = content
}

const PageTitle: FC<PageTitleProps> = ({ title, description }): ReactNode => {
  useEffect(() => {
    const fullTitle = `${title} - ClawHost`
    document.title = fullTitle
    setMetaTag('property', 'og:title', fullTitle)
    setMetaTag('name', 'twitter:title', fullTitle)
  }, [title])

  useEffect(() => {
    if (description) {
      setMetaTag('name', 'description', description)
      setMetaTag('property', 'og:description', description)
      setMetaTag('name', 'twitter:description', description)
    }
  }, [description])

  return null
}

export { PageTitle }
