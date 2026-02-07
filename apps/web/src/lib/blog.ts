import type { ComponentType } from 'react'
import type { BlogPostMeta, BlogPostModule } from '@/ts/Interfaces'

const postModules = import.meta.glob<BlogPostModule>('../../content/posts/*.mdx', {
  eager: true,
})

function estimateReadingTime(content: string): number {
  const words = content.split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

function buildPostMeta(mod: BlogPostModule, rawContent: string): BlogPostMeta {
  return {
    ...mod.frontmatter,
    readingTime: estimateReadingTime(rawContent),
  }
}

const moduleEntries = Object.entries(postModules)

export const allPosts: BlogPostMeta[] = moduleEntries
  .map(([, mod]) => buildPostMeta(mod, ''))
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

export function getPostComponent(slug: string): ComponentType | null {
  const entry = moduleEntries.find(([, mod]) => mod.frontmatter.slug === slug)
  return entry?.[1].default ?? null
}

export function getPostMeta(slug: string): BlogPostMeta | null {
  return allPosts.find((p) => p.slug === slug) ?? null
}
