import type { FC, ReactNode } from 'react'

import { Link } from 'react-router-dom'
import { t } from '@openclaw/i18n'
import Logo from '@/components/Logo'
import ROUTES from '@/lib/routes'
import { GITHUB_REPO_URL } from '@/hooks'
import { TWITTER_URL, FACEBOOK_URL, INSTAGRAM_URL, THREADS_URL, YOUTUBE_URL, TIKTOK_URL, SUPPORT_EMAIL } from '@/lib/links'
import { FacebookLogo, GithubLogo, InstagramLogo, ThreadsLogo, TiktokLogo, XLogo, YoutubeLogo } from '@phosphor-icons/react'

const LandingFooter: FC = (): ReactNode => {
    return (
        <footer className='border-t border-white/5 px-6 py-16'>
            <div className='mx-auto max-w-6xl'>
                <div className='grid gap-12 md:grid-cols-4'>
                    <div className='md:col-span-2'>
                        <Logo />
                        <p className='mt-4 max-w-sm text-[15.5px] text-gray-400'>
                            {t('footer.productDescription')}
                        </p>
                        <div className='mt-6 flex items-center gap-3'>
                            <a
                                href={GITHUB_REPO_URL}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='rounded-lg bg-white/5 p-2 text-gray-400 transition hover:bg-white/10 hover:text-white'
                            >
                                <GithubLogo className='h-5 w-5' weight='fill' />
                            </a>
                            <a
                                href={TWITTER_URL}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='rounded-lg bg-white/5 p-2 text-gray-400 transition hover:bg-white/10 hover:text-white'
                            >
                                <XLogo className='h-5 w-5' weight='fill' />
                            </a>
                            <a
                                href={FACEBOOK_URL}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='rounded-lg bg-white/5 p-2 text-gray-400 transition hover:bg-white/10 hover:text-white'
                            >
                                <FacebookLogo className='h-5 w-5' weight='fill' />
                            </a>
                            <a
                                href={INSTAGRAM_URL}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='rounded-lg bg-white/5 p-2 text-gray-400 transition hover:bg-white/10 hover:text-white'
                            >
                                <InstagramLogo className='h-5 w-5' weight='fill' />
                            </a>
                            <a
                                href={THREADS_URL}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='rounded-lg bg-white/5 p-2 text-gray-400 transition hover:bg-white/10 hover:text-white'
                            >
                                <ThreadsLogo className='h-5 w-5' weight='fill' />
                            </a>
                            <a
                                href={YOUTUBE_URL}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='rounded-lg bg-white/5 p-2 text-gray-400 transition hover:bg-white/10 hover:text-white'
                            >
                                <YoutubeLogo className='h-5 w-5' weight='fill' />
                            </a>
                            <a
                                href={TIKTOK_URL}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='rounded-lg bg-white/5 p-2 text-gray-400 transition hover:bg-white/10 hover:text-white'
                            >
                                <TiktokLogo className='h-5 w-5' weight='fill' />
                            </a>
                        </div>
                        <p className='mt-4 text-sm text-gray-500'>
                            &copy; {new Date().getFullYear()}{' '}
                            {t('footer.copyright')}
                        </p>
                    </div>

                    <div>
                        <h4 className='font-clash mb-4 font-semibold text-white'>
                            {t('footer.product')}
                        </h4>
                        <ul className='space-y-3 text-sm'>
                            <li>
                                <a
                                    href='#how-it-works'
                                    className='text-gray-400 transition hover:text-white'
                                >
                                    {t('landing.howItWorks')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#features'
                                    className='text-gray-400 transition hover:text-white'
                                >
                                    {t('landing.features')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#pricing'
                                    className='text-gray-400 transition hover:text-white'
                                >
                                    {t('landing.pricing')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#faq'
                                    className='text-gray-400 transition hover:text-white'
                                >
                                    {t('landing.faqTitle')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#testimonials'
                                    className='text-gray-400 transition hover:text-white'
                                >
                                    {t('landing.testimonials')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#comparison'
                                    className='text-gray-400 transition hover:text-white'
                                >
                                    {t('landing.comparison')}
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className='font-clash mb-4 font-semibold text-white'>
                            {t('footer.legalAndMore')}
                        </h4>
                        <ul className='space-y-3 text-sm'>
                            <li>
                                <Link
                                    to={ROUTES.POSTS}
                                    className='text-gray-400 transition hover:text-white'
                                >
                                    {t('footer.blog')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={ROUTES.PRIVACY}
                                    className='text-gray-400 transition hover:text-white'
                                >
                                    {t('footer.privacyPolicy')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={ROUTES.TERMS}
                                    className='text-gray-400 transition hover:text-white'
                                >
                                    {t('footer.termsOfService')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={ROUTES.CHANGELOG}
                                    className='text-gray-400 transition hover:text-white'
                                >
                                    {t('footer.changelog')}
                                </Link>
                            </li>
                            <li>
                                <a
                                    href={SUPPORT_EMAIL}
                                    className='text-gray-400 transition hover:text-white'
                                >
                                    {t('footer.getInTouch')}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default LandingFooter