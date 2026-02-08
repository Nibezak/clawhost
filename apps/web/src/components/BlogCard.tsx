import type { FC, ReactNode } from 'react'
import type { BlogCardProps } from '@/ts/Interfaces'

import { Link } from 'react-router-dom'
import { t } from '@openclaw/i18n'
import { CalendarBlank, Clock } from '@phosphor-icons/react'

const BlogCard: FC<BlogCardProps> = ({ post }): ReactNode => {
    const formattedDate = new Date(post.publishedAt).toLocaleDateString(
        'en-US',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
    )

    return (
        <Link
            to={`/posts/${post.slug}`}
            className='group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] transition hover:border-white/20 hover:bg-white/[0.04]'
        >
            <div className='aspect-[16/9] w-full overflow-hidden bg-white/5'>
                {post.coverImage ? (
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className='h-full w-full object-cover transition group-hover:scale-105'
                    />
                ) : (
                    <div className='flex h-full items-center justify-center'>
                        <span className='font-clash text-2xl font-bold text-white/10'>
                            ClawHost
                        </span>
                    </div>
                )}
            </div>

            <div className='flex flex-1 flex-col p-5'>
                <div className='mb-3 flex flex-wrap gap-2'>
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className='rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-gray-400'
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <h2 className='font-clash group-hover:text-primary mb-2 text-lg font-semibold text-white transition'>
                    {post.title}
                </h2>

                <p className='mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-400'>
                    {post.description}
                </p>

                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3 text-xs text-gray-500'>
                        <span className='flex items-center gap-1.5'>
                            <CalendarBlank className='h-3.5 w-3.5' />
                            {formattedDate}
                        </span>
                        <span className='flex items-center gap-1.5'>
                            <Clock className='h-3.5 w-3.5' />
                            {t('blog.readingTime', {
                                minutes: String(post.readingTime)
                            })}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export { BlogCard }