import type { FC, ReactNode } from 'react'

import { Link } from 'react-router-dom'
import { t } from '@openclaw/i18n'
import { Logo } from '@/components'
import { ROUTES } from '@/lib'
import { GITHUB_REPO_URL } from '@/hooks'
import {
    TWITTER_URL,
    FACEBOOK_URL,
    INSTAGRAM_URL,
    THREADS_URL,
    YOUTUBE_URL,
    TIKTOK_URL,
    SUPPORT_EMAIL
} from '@/lib/links'
import {
    FacebookLogoIcon,
    GithubLogoIcon,
    InstagramLogoIcon,
    ThreadsLogoIcon,
    TiktokLogoIcon,
    XLogoIcon,
    YoutubeLogoIcon
} from '@phosphor-icons/react'

const LandingFooter: FC = (): ReactNode => {
    return (
        <footer className='border-border border-t px-6 py-16'>
            <div className='mx-auto max-w-6xl'>
                <div className='grid gap-12 md:grid-cols-4'>
                    <div className='md:col-span-2'>
                        <Logo />
                        <p className='text-muted-foreground mt-4 max-w-sm text-[15.5px]'>
                            {t('footer.productDescription')}
                        </p>
                        <div className='mt-6 flex items-center gap-3'>
                            <a
                                href={GITHUB_REPO_URL}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground rounded-lg p-2 transition'
                            >
                                <GithubLogoIcon
                                    className='h-5 w-5'
                                    weight='fill'
                                />
                            </a>
                            <a
                                href={TWITTER_URL}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground rounded-lg p-2 transition'
                            >
                                <XLogoIcon className='h-5 w-5' weight='fill' />
                            </a>
                            <a
                                href={FACEBOOK_URL}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground rounded-lg p-2 transition'
                            >
                                <FacebookLogoIcon
                                    className='h-5 w-5'
                                    weight='fill'
                                />
                            </a>
                            <a
                                href={INSTAGRAM_URL}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground rounded-lg p-2 transition'
                            >
                                <InstagramLogoIcon
                                    className='h-5 w-5'
                                    weight='fill'
                                />
                            </a>
                            <a
                                href={THREADS_URL}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground rounded-lg p-2 transition'
                            >
                                <ThreadsLogoIcon
                                    className='h-5 w-5'
                                    weight='fill'
                                />
                            </a>
                            <a
                                href={YOUTUBE_URL}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground rounded-lg p-2 transition'
                            >
                                <YoutubeLogoIcon
                                    className='h-5 w-5'
                                    weight='fill'
                                />
                            </a>
                            <a
                                href={TIKTOK_URL}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground rounded-lg p-2 transition'
                            >
                                <TiktokLogoIcon
                                    className='h-5 w-5'
                                    weight='fill'
                                />
                            </a>
                        </div>
                        <p className='text-muted-foreground mt-4 text-sm'>
                            &copy; {new Date().getFullYear()}{' '}
                            {t('footer.copyright')}
                        </p>
                    </div>

                    <div>
                        <h4 className='font-clash text-foreground mb-4 font-semibold'>
                            {t('footer.product')}
                        </h4>
                        <ul className='space-y-3 text-sm'>
                            <li>
                                <a
                                    href='#how-it-works'
                                    className='text-muted-foreground hover:text-foreground transition'
                                >
                                    {t('landing.howItWorks')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#features'
                                    className='text-muted-foreground hover:text-foreground transition'
                                >
                                    {t('landing.features')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#pricing'
                                    className='text-muted-foreground hover:text-foreground transition'
                                >
                                    {t('landing.pricing')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#faq'
                                    className='text-muted-foreground hover:text-foreground transition'
                                >
                                    {t('landing.faqTitle')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#testimonials'
                                    className='text-muted-foreground hover:text-foreground transition'
                                >
                                    {t('landing.testimonials')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#comparison'
                                    className='text-muted-foreground hover:text-foreground transition'
                                >
                                    {t('landing.comparison')}
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className='font-clash text-foreground mb-4 font-semibold'>
                            {t('footer.legalAndMore')}
                        </h4>
                        <ul className='space-y-3 text-sm'>
                            <li>
                                <Link
                                    to={ROUTES.POSTS}
                                    className='text-muted-foreground hover:text-foreground transition'
                                >
                                    {t('footer.blog')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={ROUTES.PRIVACY}
                                    className='text-muted-foreground hover:text-foreground transition'
                                >
                                    {t('footer.privacyPolicy')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={ROUTES.TERMS}
                                    className='text-muted-foreground hover:text-foreground transition'
                                >
                                    {t('footer.termsOfService')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={ROUTES.CHANGELOG}
                                    className='text-muted-foreground hover:text-foreground transition'
                                >
                                    {t('footer.changelog')}
                                </Link>
                            </li>
                            <li>
                                <a
                                    href={SUPPORT_EMAIL}
                                    className='text-muted-foreground hover:text-foreground transition'
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