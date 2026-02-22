import type { FC, MouseEvent, ReactNode } from 'react'

import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
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

const LANDING_SECTIONS = [
    'how-it-works',
    'features',
    'testimonials',
    'pricing',
    'comparison',
    'faq'
]

const LandingFooter: FC = (): ReactNode => {
    const { pathname } = useLocation()
    const isLanding = pathname === ROUTES.HOME
    const [activeSection, setActiveSection] = useState('')

    useEffect(() => {
        if (!isLanding) return

        const handleScroll = (): void => {
            for (const section of [...LANDING_SECTIONS].reverse()) {
                const el = document.getElementById(section)
                if (el && window.scrollY >= el.offsetTop - 100) {
                    setActiveSection(section)
                    return
                }
            }
            if (window.scrollY < 200) setActiveSection('')
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [isLanding])

    const hashClass = (section: string): string =>
        `transition ${isLanding && activeSection === section ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`

    const pageClass = (route: string): string =>
        `transition ${pathname === route || pathname.startsWith(route + '/') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`

    const handleHashClick = (e: MouseEvent, section: string): void => {
        if (isLanding) {
            e.preventDefault()
            const el = document.getElementById(section)
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        }
    }

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
                                aria-label='GitHub'
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
                                aria-label='X'
                                className='bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground rounded-lg p-2 transition'
                            >
                                <XLogoIcon className='h-5 w-5' weight='fill' />
                            </a>
                            <a
                                href={FACEBOOK_URL}
                                target='_blank'
                                rel='noopener noreferrer'
                                aria-label='Facebook'
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
                                aria-label='Instagram'
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
                                aria-label='Threads'
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
                                aria-label='YouTube'
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
                                aria-label='TikTok'
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
                                <Link
                                    to='/#how-it-works'
                                    onClick={(e) =>
                                        handleHashClick(e, 'how-it-works')
                                    }
                                    className={hashClass('how-it-works')}
                                >
                                    {t('landing.howItWorks')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to='/#features'
                                    onClick={(e) =>
                                        handleHashClick(e, 'features')
                                    }
                                    className={hashClass('features')}
                                >
                                    {t('landing.features')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to='/#testimonials'
                                    onClick={(e) =>
                                        handleHashClick(e, 'testimonials')
                                    }
                                    className={hashClass('testimonials')}
                                >
                                    {t('landing.testimonials')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to='/#pricing'
                                    onClick={(e) =>
                                        handleHashClick(e, 'pricing')
                                    }
                                    className={hashClass('pricing')}
                                >
                                    {t('landing.pricing')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to='/#comparison'
                                    onClick={(e) =>
                                        handleHashClick(e, 'comparison')
                                    }
                                    className={hashClass('comparison')}
                                >
                                    {t('landing.comparison')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to='/#faq'
                                    onClick={(e) => handleHashClick(e, 'faq')}
                                    className={hashClass('faq')}
                                >
                                    {t('landing.faqTitle')}
                                </Link>
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
                                    to={ROUTES.BLOG}
                                    className={pageClass(ROUTES.BLOG)}
                                >
                                    {t('footer.blog')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={ROUTES.COMPARE}
                                    className={pageClass(ROUTES.COMPARE)}
                                >
                                    {t('footer.compare')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={ROUTES.CHANGELOG}
                                    className={pageClass(ROUTES.CHANGELOG)}
                                >
                                    {t('footer.changelog')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={ROUTES.FEATURE_REQUESTS}
                                    className={pageClass(
                                        ROUTES.FEATURE_REQUESTS
                                    )}
                                >
                                    {t('footer.featureRequests')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={ROUTES.PRIVACY}
                                    className={pageClass(ROUTES.PRIVACY)}
                                >
                                    {t('footer.privacyPolicy')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={ROUTES.TERMS}
                                    className={pageClass(ROUTES.TERMS)}
                                >
                                    {t('footer.termsOfService')}
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