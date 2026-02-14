import type { FC, ReactNode } from 'react'

import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { t } from '@openclaw/i18n'
import { ArrowLeft, CalendarBlank, Clock } from '@phosphor-icons/react'
import Header from '@/components/Header'
import LandingFooter from '@/components/LandingFooter'
import PageBackground from '@/components/PageBackground'
import PageTitle from '@/components/PageTitle'
import JsonLd from '@/components/JsonLd'
import { getPostComponent, getPostMeta } from '@/lib/blog'
import ROUTES from '@/lib/routes'
import NotFound from '@/pages/NotFound'
import getBaseDomain from '@/lib/getBaseDomain'

const SITE_URL = `https://${getBaseDomain()}`

const BlogPost: FC = (): ReactNode => {
    const { slug } = useParams<{ slug: string }>()

    const meta = slug ? getPostMeta(slug) : null
    const Content = slug ? getPostComponent(slug) : null

    if (!meta || !Content) {
        return <NotFound />
    }

    const formattedDate = new Date(meta.publishedAt).toLocaleDateString(
        'en-US',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
    )

    const postUrl = `${SITE_URL}/posts/${meta.slug}`
    const imageUrl = meta.coverImage
        ? `${SITE_URL}${meta.coverImage}`
        : `${SITE_URL}/og-image.webp`

    return (
        <div className='relative flex min-h-screen flex-col bg-[#0a0a0f] text-white'>
            <PageTitle
                title={meta.title}
                description={meta.description}
                image={imageUrl}
                url={postUrl}
                type='article'
            />
            <JsonLd
                data={{
                    '@context': 'https://schema.org',
                    '@type': 'BlogPosting',
                    headline: meta.title,
                    description: meta.description,
                    image: imageUrl,
                    author: { '@type': 'Organization', name: meta.author },
                    datePublished: meta.publishedAt,
                    ...(meta.updatedAt && { dateModified: meta.updatedAt }),
                    url: postUrl,
                    publisher: {
                        '@type': 'Organization',
                        name: 'ClawHost',
                        logo: {
                            '@type': 'ImageObject',
                            url: `${SITE_URL}/favicon.svg`
                        }
                    },
                    mainEntityOfPage: {
                        '@type': 'WebPage',
                        '@id': postUrl
                    },
                    keywords: meta.tags.join(', ')
                }}
            />
            <PageBackground />
            <Header />

            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='relative mx-auto w-full max-w-6xl flex-1 px-6 py-12'
            >
                <Link
                    to={ROUTES.POSTS}
                    className='mb-8 inline-flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-white'
                >
                    <ArrowLeft className='h-4 w-4' />
                    {t('blog.backToBlog')}
                </Link>

                <div className='mb-3 flex flex-wrap gap-2'>
                    {meta.tags.map((tag) => (
                        <span
                            key={tag}
                            className='rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-gray-400'
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <h1 className='font-clash mb-4 text-4xl font-bold'>
                    {meta.title}
                </h1>

                <div className='mb-8 flex items-center gap-4 text-sm text-gray-400'>
                    <span className='flex items-center gap-1.5'>
                        <CalendarBlank className='h-4 w-4' />
                        {formattedDate}
                    </span>
                    <span className='flex items-center gap-1.5'>
                        <Clock className='h-4 w-4' />
                        {t('blog.readingTime', {
                            minutes: String(meta.readingTime)
                        })}
                    </span>
                </div>

                {meta.coverImage && (
                    <div className='mb-12 overflow-hidden rounded-xl border border-white/10'>
                        <img
                            src={meta.coverImage}
                            alt={meta.title}
                            className='aspect-[2/1] w-full object-cover'
                        />
                    </div>
                )}

                <div className='prose prose-invert prose-sm prose-headings:font-clash prose-headings:font-semibold prose-h1:hidden prose-a:text-primary prose-a:no-underline hover:prose-a:underline max-w-none'>
                    <Content />
                </div>
            </motion.main>

            <LandingFooter />
        </div>
    )
}

export default BlogPost