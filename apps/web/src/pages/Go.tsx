import type { FC, ReactNode } from 'react'
import type { FeatureItem, Faq } from '@/ts/Interfaces'

import { lazy, Suspense, useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { t } from '@openclaw/i18n'
import { Button } from '@/components/ui'
import { PageTitle, Header, LandingFooter, FeaturesGrid, ComparisonTable, FaqSection } from '@/components'
import { useGitHubStars, GITHUB_REPO_URL } from '@/hooks'
import {
    SparkleIcon,
    GithubLogoIcon,
    DownloadSimpleIcon,
    ClockIcon,
    LockIcon,
    TerminalIcon,
    CreditCardIcon,
    LinkIcon,
    ShieldCheckIcon,
    GitBranchIcon,
    SlidersHorizontalIcon,
    GearSixIcon,
    PuzzlePieceIcon,
    ChatCircleDotsIcon,
    UsersThreeIcon,
    CheckIcon
} from '@phosphor-icons/react'

const LazyDemoPreview = lazy(() => import('@/components/LandingDemoPreview'))

const getGoFeatures = (): FeatureItem[] => [
    {
        icon: ClockIcon,
        title: t('landing.zeroConfig'),
        description: t('go.zeroConfigDescription')
    },
    {
        icon: LockIcon,
        title: t('landing.ownedData'),
        description: t('go.ownedDataDescription')
    },
    {
        icon: TerminalIcon,
        title: t('landing.fullSshAccess'),
        description: t('go.terminalAccessDescription')
    },
    {
        icon: CreditCardIcon,
        title: t('go.simplePricing'),
        description: t('go.simplePricingDescription')
    },
    {
        icon: LinkIcon,
        title: t('go.localDomain'),
        description: t('go.localDomainDescription')
    },
    {
        icon: ShieldCheckIcon,
        title: t('landing.secure'),
        description: t('go.secureDescription')
    },
    {
        icon: GitBranchIcon,
        title: t('landing.autoUpdates'),
        description: t('landing.autoUpdatesDescription')
    },
    {
        icon: SlidersHorizontalIcon,
        title: t('landing.openclawControl'),
        description: t('landing.openclawControlDescription')
    },
    {
        icon: GearSixIcon,
        title: t('landing.clawHostControl'),
        description: t('landing.clawHostControlDescription')
    },
    {
        icon: PuzzlePieceIcon,
        title: t('landing.skillsMarketplace'),
        description: t('landing.skillsMarketplaceDescription')
    },
    {
        icon: ChatCircleDotsIcon,
        title: t('landing.directChat'),
        description: t('landing.directChatDescription')
    },
    {
        icon: UsersThreeIcon,
        title: t('landing.multipleAgents'),
        description: t('landing.multipleAgentsDescription')
    }
]

const getGoFaqs = (): Faq[] => [
    {
        question: t('go.faq1Question'),
        answer: t('go.faq1Answer')
    },
    {
        question: t('go.faq2Question'),
        answer: t('go.faq2Answer')
    },
    {
        question: t('go.faq3Question'),
        answer: t('go.faq3Answer')
    },
    {
        question: t('go.faq4Question'),
        answer: t('go.faq4Answer')
    },
    {
        question: t('go.faq5Question'),
        answer: t('go.faq5Answer')
    },
    {
        question: t('go.faq6Question'),
        answer: t('go.faq6Answer')
    }
]

const Go: FC = (): ReactNode => {
    const { data: gitHubStars } = useGitHubStars()
    const [activeSection, setActiveSection] = useState('')
    const previewRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress: previewProgress } = useScroll({
        target: previewRef,
        offset: ['start end', 'end start']
    })
    const previewScale = useTransform(
        previewProgress,
        [0, 0.4, 0.6, 1],
        [0.92, 1.02, 1.02, 0.92]
    )

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < 200) {
                setActiveSection('')
                return
            }
            const sections = ['features', 'pricing', 'comparison', 'faq']
            for (const section of sections) {
                const el = document.getElementById(section)
                if (el && window.scrollY >= el.offsetTop - 100) {
                    setActiveSection(section)
                    break
                }
            }
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { label: t('go.features'), href: '#features', id: 'features' },
        { label: t('go.pricing'), href: '#pricing', id: 'pricing' },
        { label: t('go.comparison'), href: '#comparison', id: 'comparison' },
        { label: t('go.faqTitle'), href: '#faq', id: 'faq' }
    ]

    return (
        <div className='font-satoshi bg-background text-foreground min-h-screen'>
            <PageTitle title={t('go.pageTitle')} />

            <div className='landing-gradient pointer-events-none fixed inset-0' />

            <Header
                showNavLinks={true}
                navLinks={navLinks}
                activeSection={activeSection}
            />

            <main>
                <section className='relative overflow-hidden px-6 pb-16 pt-32'>
                    <div className='landing-grid pointer-events-none' />

                    <div className='animate-hero-fade-in relative mx-auto max-w-6xl'>
                        <div className='flex flex-col items-center text-center'>
                            <div className='mb-8 flex flex-wrap items-center justify-center gap-3'>
                                <div className='glow-border border-border bg-foreground/5 inline-flex items-center gap-2 rounded-full border px-4 py-2'>
                                    <SparkleIcon
                                        className='h-4 w-4 text-[#ef5350]'
                                        weight='fill'
                                    />
                                    <span className='text-foreground/80 text-sm'>
                                        {t('go.badge')}
                                    </span>
                                </div>
                            </div>

                            <h1 className='font-clash mb-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl'>
                                <span className='from-foreground via-foreground to-muted-foreground bg-gradient-to-b bg-clip-text text-transparent'>
                                    {t('go.heroTitle1')}
                                </span>
                                <br />
                                <span className='animate-gradient bg-gradient-to-r from-[#ef5350] via-[#ff7043] to-[#ffab91] bg-clip-text text-transparent'>
                                    {t('go.heroTitle2')}
                                </span>
                            </h1>

                            <p className='text-muted-foreground mb-10 max-w-2xl text-lg leading-relaxed md:text-xl'>
                                {t('go.description')}
                            </p>

                            <div className='mb-16 flex flex-col gap-4 sm:flex-row'>
                                <Button
                                    size='lg'
                                    disabled
                                    className='gap-2 border-0 bg-gradient-to-r from-[#ef5350] to-[#c62828] px-6 font-semibold text-white opacity-70'
                                >
                                    <DownloadSimpleIcon className='h-5 w-5' weight='bold' />
                                    {t('go.comingSoon')}
                                </Button>

                                <Button
                                    size='lg'
                                    variant='outline'
                                    className='border-border bg-foreground/5 text-foreground hover:bg-foreground/10 gap-2 px-6'
                                    asChild
                                >
                                    <a
                                        href={GITHUB_REPO_URL}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        <GithubLogoIcon className='h-5 w-5' weight='fill' />
                                        {t('go.selfHostInstead')}

                                        {gitHubStars && (
                                            <span className='bg-foreground/10 flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs'>
                                                {gitHubStars.formatted}
                                                <span className='text-[12px]'>★</span>
                                            </span>
                                        )}
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <div ref={previewRef} className='mx-auto mb-32 max-w-6xl px-6'>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{ scale: previewScale }}
                        className='border-border bg-background flex h-[80vh] flex-col overflow-hidden rounded-2xl border'
                    >
                        <Suspense fallback={
                            <div className='flex flex-1 items-center justify-center'>
                                <div className='border-border bg-muted/50 h-3 w-3 animate-pulse rounded-full' />
                            </div>
                        }>
                            <LazyDemoPreview urlOverride='ClawHost Go' />
                        </Suspense>
                    </motion.div>
                </div>

                <FeaturesGrid
                    badge={t('go.features')}
                    heading={t('go.whyClawHostGo')}
                    description={t('go.featuresDescription')}
                    features={getGoFeatures()}
                />

                <section id='pricing' className='border-border border-t px-6 py-32'>
                    <div className='mx-auto max-w-4xl'>
                        <div className='mb-16 text-center'>
                            <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-[#ef5350]/20 bg-[#ef5350]/10 px-3 py-1 text-sm text-[#ef5350]'>
                                {t('go.pricing')}
                            </div>
                            <h2 className='font-clash mb-4 text-3xl font-bold md:text-4xl'>
                                {t('go.pricingTitle')}
                            </h2>
                            <p className='text-muted-foreground mx-auto max-w-xl'>
                                {t('go.pricingDescription')}
                            </p>
                        </div>

                        <div className='border-border mx-auto max-w-2xl rounded-2xl border bg-gradient-to-b from-white/[0.03] to-transparent p-8'>
                            <div className='flex flex-col items-center gap-8 md:flex-row md:items-start'>
                                <div className='flex shrink-0 flex-col items-center md:items-start'>
                                    <div className='font-clash mb-1 text-5xl font-bold'>
                                        {t('go.pricingPrice')}
                                    </div>
                                    <span className='text-muted-foreground mb-6 text-sm'>
                                        {t('go.pricingLabel')}
                                    </span>
                                    <Button
                                        size='lg'
                                        disabled
                                        className='w-full border-0 bg-gradient-to-r from-[#ef5350] to-[#c62828] font-semibold text-white opacity-70'
                                    >
                                        {t('go.comingSoon')}
                                    </Button>
                                </div>

                                <div className='border-border hidden w-px self-stretch bg-gradient-to-b from-transparent via-white/10 to-transparent md:block' />

                                <div className='grid flex-1 grid-cols-2 gap-x-6 gap-y-3'>
                                    {[
                                        t('go.pricingFeature1'),
                                        t('go.pricingFeature2'),
                                        t('go.pricingFeature3'),
                                        t('go.pricingFeature4'),
                                        t('go.pricingFeature5'),
                                        t('go.pricingFeature6')
                                    ].map((feature) => (
                                        <div key={feature} className='flex items-center gap-2'>
                                            <CheckIcon className='h-3.5 w-3.5 shrink-0 text-green-600 dark:text-green-400' />
                                            <span className='text-foreground/80 text-sm'>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <ComparisonTable
                    badge={t('go.comparison')}
                    heading={t('go.comparisonTitle')}
                    description={t('go.comparisonDescription')}
                    logoSuffix='Go'
                    rows={[
                        { us: t('nav.goSubtitle'), others: t('nav.cloudSubtitle') },
                        { us: t('go.comparisonLocalUs'), others: t('go.comparisonLocalOthers') },
                        { us: t('go.comparisonPricingUs'), others: t('go.comparisonPricingOthers') },
                        { us: t('go.comparisonDataUs'), others: t('go.comparisonDataOthers') },
                        { us: t('go.comparisonSetupUs'), others: t('go.comparisonSetupOthers') },
                        { us: t('go.comparisonUptimeUs'), others: t('go.comparisonUptimeOthers') },
                        { us: t('go.comparisonAccessUs'), others: t('go.comparisonAccessOthers') },
                        { us: t('go.comparisonUpdatesUs'), others: t('go.comparisonUpdatesOthers') },
                        { us: t('go.comparisonAgentsUs'), others: t('go.comparisonAgentsOthers') }
                    ]}
                    showFullComparisonLink={false}
                />

                <FaqSection
                    badge={t('go.faqTitle')}
                    heading={t('go.faqHeading')}
                    description={t('go.faqDescription')}
                    faqs={getGoFaqs()}
                />
            </main>

            <LandingFooter />
        </div>
    )
}

export default Go