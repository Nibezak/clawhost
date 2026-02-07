import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const DIST = path.resolve(import.meta.dirname, '../dist')
const CONTENT = path.resolve(import.meta.dirname, '../content/posts')
const SITE_URL = 'https://clawhost.cloud'

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8')

const mdxFiles = fs.readdirSync(CONTENT).filter((f) => f.endsWith('.mdx'))

interface PostFrontmatter {
  title: string
  slug: string
  description: string
  author: string
  publishedAt: string
  updatedAt?: string
  tags: string[]
  coverImage?: string
}

const posts: PostFrontmatter[] = mdxFiles.map((file) => {
  const raw = fs.readFileSync(path.join(CONTENT, file), 'utf-8')
  const { data } = matter(raw)
  return data as PostFrontmatter
})

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function injectMeta(
  html: string,
  meta: {
    title: string
    description: string
    url: string
    type: string
    image: string
    jsonLd: Record<string, unknown>
    articleMeta?: {
      publishedTime: string
      modifiedTime?: string
      author: string
      tags: string[]
    }
  }
): string {
  const fullTitle = `${meta.title} - ClawHost`

  // Replace existing title
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`)

  // Replace existing meta tags with page-specific values
  html = html.replace(/<meta name="description"[^>]*\/>/, `<meta name="description" content="${escapeHtml(meta.description)}" />`)
  html = html.replace(/<meta property="og:type"[^>]*\/>/, `<meta property="og:type" content="${meta.type}" />`)
  html = html.replace(/<meta property="og:title"[^>]*\/>/, `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`)
  html = html.replace(/<meta property="og:description"[^>]*\/>/, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`)
  html = html.replace(/<meta property="og:image"[^>]*\/>/, `<meta property="og:image" content="${meta.image}" />`)
  html = html.replace(/<meta name="twitter:title"[^>]*\/>/, `<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`)
  html = html.replace(/<meta name="twitter:description"[^>]*\/>/, `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`)
  html = html.replace(/<meta name="twitter:image"[^>]*\/>/, `<meta name="twitter:image" content="${meta.image}" />`)

  // Build additional tags
  let extraTags = `
    <meta property="og:url" content="${meta.url}" />
    <link rel="canonical" href="${meta.url}" />`

  // Article-specific meta tags
  if (meta.articleMeta) {
    extraTags += `
    <meta property="article:published_time" content="${meta.articleMeta.publishedTime}" />`
    if (meta.articleMeta.modifiedTime) {
      extraTags += `
    <meta property="article:modified_time" content="${meta.articleMeta.modifiedTime}" />`
    }
    extraTags += `
    <meta property="article:author" content="${escapeHtml(meta.articleMeta.author)}" />`
    for (const tag of meta.articleMeta.tags) {
      extraTags += `
    <meta property="article:tag" content="${escapeHtml(tag)}" />`
    }
  }

  extraTags += `
    <script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>
  `

  html = html.replace('</head>', `${extraTags}</head>`)

  return html
}

// Generate /posts/index.html (listing page)
const listingHtml = injectMeta(template, {
  title: 'Blog',
  description: 'Guides, tutorials, and news about OpenClaw and self-hosted infrastructure.',
  url: `${SITE_URL}/posts`,
  type: 'website',
  image: `${SITE_URL}/og-image.png`,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'ClawHost Blog',
    description: 'Guides, tutorials, and news about OpenClaw and self-hosted infrastructure.',
    url: `${SITE_URL}/posts`,
    publisher: {
      '@type': 'Organization',
      name: 'ClawHost',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
    },
  },
})

fs.mkdirSync(path.join(DIST, 'posts'), { recursive: true })
fs.writeFileSync(path.join(DIST, 'posts', 'index.html'), listingHtml)

// Generate /posts/<slug>/index.html for each post
for (const post of posts) {
  const imageUrl = post.coverImage ? `${SITE_URL}${post.coverImage}` : `${SITE_URL}/og-image.png`

  const postHtml = injectMeta(template, {
    title: post.title,
    description: post.description,
    url: `${SITE_URL}/posts/${post.slug}`,
    type: 'article',
    image: imageUrl,
    articleMeta: {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      author: post.author,
      tags: post.tags,
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      image: imageUrl,
      author: { '@type': 'Organization', name: post.author },
      datePublished: post.publishedAt,
      ...(post.updatedAt && { dateModified: post.updatedAt }),
      url: `${SITE_URL}/posts/${post.slug}`,
      publisher: {
        '@type': 'Organization',
        name: 'ClawHost',
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/posts/${post.slug}`,
      },
      keywords: post.tags.join(', '),
    },
  })

  const dir = path.join(DIST, 'posts', post.slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), postHtml)
}

console.log(`Pre-rendered ${posts.length} blog posts + listing page.`)
