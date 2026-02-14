import type { FC, ReactNode } from 'react'

import { motion } from 'framer-motion'
import { t } from '@openclaw/i18n'
import Header from '@/components/Header'
import LandingFooter from '@/components/LandingFooter'
import PageBackground from '@/components/PageBackground'
import PageTitle from '@/components/PageTitle'
import JsonLd from '@/components/JsonLd'
import BlogCard from '@/components/BlogCard'
import { allPosts } from '@/lib/blog'
import getBaseDomain from '@/lib/getBaseDomain'

const Blog: FC = (): ReactNode => {
    return (
        <div className='relative flex min-h-screen flex-col bg-[#0a0a0f] text-white'>
            <PageTitle
                title={t('blog.title')}
                description={t('blog.description')}
            />
            <JsonLd
                data={{
                    '@context': 'https://schema.org',
                    '@type': 'Blog',
                    name: 'ClawHost Blog',
                    description: t('blog.description'),
                    url: `https://${getBaseDomain()}/posts`
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
                <h1 className='font-clash mb-2 text-4xl font-bold'>
                    {t('blog.title')}
                </h1>
                <p className='text-muted-foreground mb-12'>
                    {t('blog.description')}
                </p>

                {allPosts.length > 0 ? (
                    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                        {allPosts.map((post) => (
                            <BlogCard key={post.slug} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className='py-24 text-center'>
                        <h2 className='font-clash mb-2 text-xl font-semibold'>
                            {t('blog.noPosts')}
                        </h2>
                        <p className='text-muted-foreground'>
                            {t('blog.noPostsDescription')}
                        </p>
                    </div>
                )}
            </motion.main>

            <LandingFooter />
        </div>
    )
}

export default Blog