import type { BlogPostMeta, BlogPostModule } from '@/ts/Interfaces'

import moduleEntries from '@/lib/blog/data'

function estimateReadingTime(content: string): number {
    const words = content.split(/\s+/).length
    return Math.max(1, Math.round(words / 200))
}

function buildPostMeta(mod: BlogPostModule, rawContent: string): BlogPostMeta {
    return {
        ...mod.frontmatter,
        readingTime: estimateReadingTime(rawContent)
    }
}

const allPosts: BlogPostMeta[] = moduleEntries
    .map(([, mod]) => buildPostMeta(mod, ''))
    .sort(
        (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
    )

export default allPosts