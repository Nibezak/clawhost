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

const setLinkTag = (rel: string, href: string) => {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!link) {
    link = document.createElement('link')
    link.rel = rel
    document.head.appendChild(link)
  }
  link.href = href
}

const PageTitle: FC<PageTitleProps> = ({ title, description, image, url, type }): ReactNode => {
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

  useEffect(() => {
    if (image) {
      setMetaTag('property', 'og:image', image)
      setMetaTag('name', 'twitter:image', image)
    }
  }, [image])

  useEffect(() => {
    if (url) {
      setMetaTag('property', 'og:url', url)
      setLinkTag('canonical', url)
    }
  }, [url])

  useEffect(() => {
    if (type) {
      setMetaTag('property', 'og:type', type)
    }
  }, [type])

  return null
}

export { PageTitle }
