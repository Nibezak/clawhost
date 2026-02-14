import type { FC, ReactNode } from 'react'
import type { Faq, Testimonial } from '@/ts/Interfaces'
import type { ProviderType } from '@/ts/Types'

import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { t } from '@openclaw/i18n'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageTitle } from '@/components/PageTitle'
import { Header } from '@/components/Header'
import { LandingFooter } from '@/components/LandingFooter'
import HeroButtons from '@/components/HeroButtons'
import { demoPlaygroundData } from '@/data'
import {
    PlaygroundCanvas,
    PlaygroundDetailPanel,
    PlaygroundAgentDetailPanel
} from '@/components/playground'
import { useAuth } from '@/lib/auth'
import { ROUTES } from '@/lib/routes'
import { usePlans } from '@/hooks'
import ProviderIcon from '@/components/ProviderIcon'
import getBaseDomain from '@/lib/getBaseDomain'
import {
    ShieldCheck,
    Globe,
    Clock,
    Terminal,
    Lock,
    Gauge,
    HardDrives,
    Check,
    CircleNotch,
    Sparkle,
    CaretDown,
    Quotes,
    CreditCard,
    Link as LinkIcon,
    ArrowsClockwise,
    X
} from '@phosphor-icons/react'

function getTestimonials(): Testimonial[] {
    return [
        {
            quote: t('landing.testimonial1Quote'),
            author: t('landing.testimonial1Author'),
            role: t('landing.testimonial1Role'),
            avatar: 'AC'
        },
        {
            quote: t('landing.testimonial2Quote'),
            author: t('landing.testimonial2Author'),
            role: t('landing.testimonial2Role'),
            avatar: 'MS'
        },
        {
            quote: t('landing.testimonial3Quote'),
            author: t('landing.testimonial3Author'),
            role: t('landing.testimonial3Role'),
            avatar: 'JW'
        },
        {
            quote: t('landing.testimonial4Quote'),
            author: t('landing.testimonial4Author'),
            role: t('landing.testimonial4Role'),
            avatar: 'SK'
        }
    ]
}

function getFaqs(): Faq[] {
    return [
        {
            question: t('landing.faq1Question'),
            answer: t('landing.faq1Answer')
        },
        {
            question: t('landing.faq2Question'),
            answer: t('landing.faq2Answer')
        },
        {
            question: t('landing.faq3Question'),
            answer: t('landing.faq3Answer')
        },
        {
            question: t('landing.faq4Question'),
            answer: t('landing.faq4Answer')
        },
        {
            question: t('landing.faq5Question'),
            answer: t('landing.faq5Answer')
        },
        {
            question: t('landing.faq6Question'),
            answer: t('landing.faq6Answer')
        },
        {
            question: t('landing.faq7Question'),
            answer: t('landing.faq7Answer')
        },
        {
            question: t('landing.faq8Question'),
            answer: t('landing.faq8Answer')
        }
    ]
}

const Landing: FC = (): ReactNode => {
    const { user } = useAuth()
    const [pricingProvider, setPricingProvider] =
        useState<ProviderType>('hetzner')
    const { plans, isLoading: plansLoading } = usePlans(pricingProvider)

    const [openFaq, setOpenFaq] = useState<number | null>(null)
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

    const [demoClawId, setDemoClawId] = useState<string | null>(null)
    const [demoAgentId, setDemoAgentId] = useState<string | null>(null)
    const [demoAgentClawId, setDemoAgentClawId] = useState<string | null>(null)

    const demoClaw = demoClawId
        ? demoPlaygroundData.claws.find((c) => c.id === demoClawId) || null
        : null

    const demoAgentClaw = demoAgentClawId
        ? demoPlaygroundData.claws.find((c) => c.id === demoAgentClawId) || null
        : null

    const demoAgentList = demoAgentClaw
        ? demoPlaygroundData.agentsByClawId[demoAgentClaw.id] || []
        : []

    const demoAgent = demoAgentId
        ? demoAgentList.find((a) => a.id === demoAgentId) || null
        : null

    useEffect(() => {
        const handleScroll = () => {
            const sections = [
                'how-it-works',
                'features',
                'testimonials',
                'pricing',
                'comparison',
                'faq'
            ]
            for (const section of sections.reverse()) {
                const el = document.getElementById(section)
                if (el && window.scrollY >= el.offsetTop - 100) {
                    setActiveSection(section)
                    break
                }
            }
            if (window.scrollY < 200) setActiveSection('')
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        {
            label: t('landing.howItWorks'),
            href: '#how-it-works',
            id: 'how-it-works'
        },
        { label: t('landing.features'), href: '#features', id: 'features' },
        {
            label: t('landing.testimonials'),
            href: '#testimonials',
            id: 'testimonials'
        },
        { label: t('landing.pricing'), href: '#pricing', id: 'pricing' },
        {
            label: t('landing.comparison'),
            href: '#comparison',
            id: 'comparison'
        },
        { label: t('landing.faqTitle'), href: '#faq', id: 'faq' }
    ]

    return (
        <div className='font-satoshi min-h-screen bg-[#0a0a0f] text-white'>
            <PageTitle
                title={t('landing.title')}
                description={t('landing.description')}
            />

            <div className='landing-gradient pointer-events-none fixed inset-0' />

            <Header
                showNavLinks={true}
                navLinks={navLinks}
                activeSection={activeSection}
            />

            <section className='relative overflow-hidden px-6 pb-16 pt-32'>
                <div className='landing-grid pointer-events-none' />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className='relative mx-auto max-w-6xl'
                >
                    <div className='flex flex-col items-center text-center'>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className='glow-border mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2'
                        >
                            <Sparkle
                                className='h-4 w-4 text-[#ef5350]'
                                weight='fill'
                            />
                            <span className='text-sm text-gray-300'>
                                {t('landing.badge')}
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className='font-clash mb-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl'
                        >
                            <span className='bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent'>
                                {t('landing.heroTitle1')}
                            </span>
                            <br />
                            <span className='animate-gradient bg-gradient-to-r from-[#ef5350] via-[#ff7043] to-[#ffab91] bg-clip-text text-transparent'>
                                {t('landing.heroTitle2')}
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className='mb-10 max-w-2xl text-lg leading-relaxed text-[#8892b0] md:text-xl'
                        >
                            {t('landing.heroDescription')}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className='mb-16 flex flex-col gap-4 sm:flex-row'
                        >
                            <HeroButtons
                                deployLabel={t('nav.deployOpenClaw')}
                                githubLabel={t('landing.selfHostInstead')}
                                showStars={true}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className='grid grid-cols-2 gap-6 text-center md:flex md:items-center md:gap-16'
                        >
                            <div>
                                <div className='font-clash text-3xl font-bold text-white md:text-4xl'>
                                    $10/mo
                                </div>
                                <div className='text-sm text-gray-500'>
                                    {t('landing.startingPrice')}
                                </div>
                            </div>
                            <div className='hidden h-12 w-px bg-white/10 md:block' />
                            <div>
                                <div className='font-clash text-3xl font-bold text-white md:text-4xl'>
                                    30+
                                </div>
                                <div className='text-sm text-gray-500'>
                                    {t('landing.locations')}
                                </div>
                            </div>
                            <div className='hidden h-12 w-px bg-white/10 md:block' />
                            <div>
                                <div className='font-clash text-3xl font-bold text-white md:text-4xl'>
                                    45+
                                </div>
                                <div className='text-sm text-gray-500'>
                                    {t('landing.servers')}
                                </div>
                            </div>
                            <div className='hidden h-12 w-px bg-white/10 md:block' />
                            <div>
                                <div className='font-clash text-3xl font-bold text-white md:text-4xl'>
                                    Zero
                                </div>
                                <div className='text-sm text-gray-500'>
                                    {t('landing.zeroConfig')}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            <div ref={previewRef} className='mx-auto mb-32 max-w-6xl px-6'>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ scale: previewScale }}
                    className='flex h-[80vh] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0f]'
                >
                    <div className='pointer-events-none flex items-center gap-3 border-b border-white/[0.06] bg-gradient-to-b from-[#1e1e24] to-[#18181e] px-5 py-3'>
                        <div className='flex items-center gap-2'>
                            <div className='h-3 w-3 rounded-full bg-[#ff5f57] shadow-[inset_0_-1px_2px_rgba(0,0,0,0.2)]' />
                            <div className='h-3 w-3 rounded-full bg-[#febc2e] shadow-[inset_0_-1px_2px_rgba(0,0,0,0.2)]' />
                            <div className='h-3 w-3 rounded-full bg-[#28c840] shadow-[inset_0_-1px_2px_rgba(0,0,0,0.2)]' />
                        </div>
                        <div className='flex flex-1 justify-center'>
                            <div className='flex items-center gap-2 rounded-lg bg-black/30 px-4 py-1.5 text-xs text-gray-500'>
                                <Lock
                                    className='h-3 w-3 text-green-500/70'
                                    weight='fill'
                                />
                                <span>{getBaseDomain()}/claws</span>
                            </div>
                        </div>
                        <div className='w-[56px]' />
                    </div>

                    <div className='flex flex-1 overflow-hidden'>
                        <div className='relative flex min-w-0 flex-1 overflow-hidden'>
                            <div className='relative min-w-0 flex-1'>
                                <div className='playground-grid h-full'>
                                    <PlaygroundCanvas
                                        initialNodes={
                                            demoPlaygroundData.nodes
                                        }
                                        initialEdges={
                                            demoPlaygroundData.edges
                                        }
                                        initialZoom={1.25}
                                        allowPageScroll
                                        onNodeClick={(clawId) => {
                                            setDemoAgentId(null)
                                            setDemoAgentClawId(null)
                                            setDemoClawId(
                                                demoClawId === clawId
                                                    ? null
                                                    : clawId
                                            )
                                        }}
                                        onAgentClick={(agentId, clawId) => {
                                            setDemoClawId(null)
                                            setDemoAgentId(
                                                demoAgentId === agentId
                                                    ? null
                                                    : agentId
                                            )
                                            setDemoAgentClawId(clawId)
                                        }}
                                        onPaneClick={() => {
                                            setDemoClawId(null)
                                            setDemoAgentId(null)
                                            setDemoAgentClawId(null)
                                        }}
                                        panelOpen={
                                            !!demoClaw || !!demoAgent
                                        }
                                        selectedClawId={demoClawId}
                                        selectedAgentId={demoAgentId}
                                    />
                                </div>
                            </div>

                            <AnimatePresence>
                                {demoClaw && (
                                    <PlaygroundDetailPanel
                                        key='detail-panel'
                                        claw={demoClaw}
                                        plans={[]}
                                        sshKeys={[]}
                                        onClose={() => setDemoClawId(null)}
                                        readOnly
                                    />
                                )}

                                {demoAgent && demoAgentClaw && (
                                    <PlaygroundAgentDetailPanel
                                        key='agent-panel'
                                        agent={demoAgent}
                                        clawId={demoAgentClaw.id}
                                        clawName={demoAgentClaw.name}
                                        isOnlyAgent={
                                            demoAgentList.length <= 1
                                        }
                                        onClose={() => {
                                            setDemoAgentId(null)
                                            setDemoAgentClawId(null)
                                        }}
                                        readOnly
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>

            <section
                id='how-it-works'
                className='relative scroll-mt-20 border-t border-white/5 px-6 py-24'
            >
                <div className='mx-auto max-w-6xl'>
                    <div className='mb-16 text-center'>
                        <Badge
                            variant='outline'
                            className='mb-4 border-white/10 bg-white/5 text-gray-300'
                        >
                            {t('landing.howItWorks')}
                        </Badge>
                        <h2 className='font-clash mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl'>
                            {t('landing.threeStepsToPrivacy')}
                        </h2>
                        <p className='mx-auto max-w-xl text-lg text-[#8892b0]'>
                            {t('landing.howItWorksDescription')}
                        </p>
                    </div>

                    <div className='grid gap-6 md:grid-cols-3'>
                        {[
                            {
                                step: '01',
                                icon: HardDrives,
                                title: t('landing.step1Title'),
                                description: t('landing.step1Description')
                            },
                            {
                                step: '02',
                                icon: ShieldCheck,
                                title: t('landing.step2Title'),
                                description: t('landing.step2Description')
                            },
                            {
                                step: '03',
                                icon: Terminal,
                                title: t('landing.step3Title'),
                                description: t('landing.step3Description')
                            }
                        ].map((item) => (
                            <div
                                key={item.step}
                                className='relative rounded-xl border border-white/10 bg-white/[0.02] p-6'
                            >
                                <div className='font-clash absolute -left-1 -top-3 text-6xl font-bold text-white/5'>
                                    {item.step}
                                </div>
                                <div className='relative pt-6'>
                                    <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-[#ef5350]/20 to-[#c62828]/20'>
                                        <item.icon className='h-6 w-6 text-[#ef5350]' />
                                    </div>
                                    <h3 className='font-clash mb-2 text-xl font-semibold text-white'>
                                        {item.title}
                                    </h3>
                                    <p className='leading-relaxed text-[#8892b0]'>
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section
                id='features'
                className='relative scroll-mt-20 border-t border-white/5 px-6 py-24'
            >
                <div className='mx-auto max-w-6xl'>
                    <div className='mb-16 text-center'>
                        <Badge
                            variant='outline'
                            className='mb-4 border-white/10 bg-white/5 text-gray-300'
                        >
                            {t('landing.features')}
                        </Badge>
                        <h2 className='font-clash mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl'>
                            {t('landing.whyClawHost')}
                        </h2>
                        <p className='mx-auto max-w-xl text-lg text-[#8892b0]'>
                            {t('landing.featuresDescription')}
                        </p>
                    </div>

                    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                        {[
                            {
                                icon: Clock,
                                title: t('landing.zeroConfig'),
                                description: t('landing.zeroConfigDescription')
                            },
                            {
                                icon: Lock,
                                title: t('landing.ownedData'),
                                description: t('landing.ownedDataDescription')
                            },
                            {
                                icon: Gauge,
                                title: t('landing.fullSpeed'),
                                description: t('landing.fullSpeedDescription')
                            },
                            {
                                icon: Globe,
                                title: t('landing.globalLocations'),
                                description: t(
                                    'landing.globalLocationsDescription'
                                )
                            },
                            {
                                icon: Terminal,
                                title: t('landing.fullSshAccess'),
                                description: t(
                                    'landing.fullSshAccessDescription'
                                )
                            },
                            {
                                icon: CreditCard,
                                title: t('landing.payAsYouGo'),
                                description: t('landing.payAsYouGoDescription')
                            },
                            {
                                icon: LinkIcon,
                                title: t('landing.customSubdomains'),
                                description: t(
                                    'landing.customSubdomainsDescription'
                                )
                            },
                            {
                                icon: ShieldCheck,
                                title: t('landing.secure'),
                                description: t('landing.secureDescription')
                            },
                            {
                                icon: ArrowsClockwise,
                                title: t('landing.autoUpdates'),
                                description: t('landing.autoUpdatesDescription')
                            }
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className='rounded-xl border border-white/10 bg-white/[0.02] p-6'
                            >
                                <feature.icon className='mb-4 h-8 w-8 text-[#ef5350]' />
                                <h3 className='font-clash mb-2 text-lg font-semibold text-white'>
                                    {feature.title}
                                </h3>
                                <p className='text-sm leading-relaxed text-[#8892b0]'>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section
                id='testimonials'
                className='relative scroll-mt-20 border-t border-white/5 px-6 py-24'
            >
                <div className='mx-auto max-w-6xl'>
                    <div className='mb-16 text-center'>
                        <Badge
                            variant='outline'
                            className='mb-4 border-white/10 bg-white/5 text-gray-300'
                        >
                            {t('landing.testimonials')}
                        </Badge>
                        <h2 className='font-clash mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl'>
                            {t('landing.whatPeopleSay')}
                        </h2>
                        <p className='mx-auto max-w-xl text-lg text-[#8892b0]'>
                            {t('landing.testimonialsDescription')}
                        </p>
                    </div>

                    <div className='grid gap-6 md:grid-cols-2'>
                        {getTestimonials().map((testimonial, i) => (
                            <div
                                key={i}
                                className='rounded-xl border border-white/10 bg-white/[0.02] p-6'
                            >
                                <Quotes
                                    className='mb-4 h-8 w-8 text-[#ef5350]/40'
                                    weight='fill'
                                />
                                <p className='mb-6 leading-relaxed text-gray-300'>
                                    "{testimonial.quote}"
                                </p>
                                <div className='flex items-center gap-3'>
                                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#ef5350] to-[#c62828] text-sm font-medium text-white'>
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <p className='font-medium text-white'>
                                            {testimonial.author}
                                        </p>
                                        <p className='text-sm text-gray-500'>
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section
                id='pricing'
                className='relative scroll-mt-20 border-t border-white/5 px-6 py-24'
            >
                <div className='mx-auto max-w-6xl'>
                    <div className='mb-16 text-center'>
                        <Badge
                            variant='outline'
                            className='mb-4 border-white/10 bg-white/5 text-gray-300'
                        >
                            {t('landing.pricing')}
                        </Badge>
                        <h2 className='font-clash mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl'>
                            {t('landing.simpleTransparentPricing')}
                        </h2>
                        <p className='mx-auto max-w-xl text-lg text-[#8892b0]'>
                            {t('landing.pricingDescription')}
                        </p>

                        <div className='mt-8 flex justify-center'>
                            <div className='flex rounded-lg border border-white/10 bg-white/5 p-1'>
                                <button
                                    onClick={() =>
                                        setPricingProvider('hetzner')
                                    }
                                    className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
                                        pricingProvider === 'hetzner'
                                            ? 'bg-white/10 text-white shadow-sm'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <ProviderIcon
                                        provider='hetzner'
                                        className='h-4 w-4'
                                    />
                                    {t('createClaw.providerHetzner')}
                                </button>
                                <button
                                    onClick={() =>
                                        setPricingProvider('digitalocean')
                                    }
                                    className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
                                        pricingProvider === 'digitalocean'
                                            ? 'bg-white/10 text-white shadow-sm'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <ProviderIcon
                                        provider='digitalocean'
                                        className='h-4 w-4'
                                    />
                                    {t('createClaw.providerDigitalOcean')}
                                </button>
                                <button
                                    onClick={() => setPricingProvider('vultr')}
                                    className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
                                        pricingProvider === 'vultr'
                                            ? 'bg-white/10 text-white shadow-sm'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <ProviderIcon
                                        provider='vultr'
                                        className='h-4 w-4'
                                    />
                                    {t('createClaw.providerVultr')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {plansLoading ? (
                        <div className='flex items-center justify-center py-12'>
                            <CircleNotch className='h-8 w-8 animate-spin text-gray-400' />
                        </div>
                    ) : plans && plans.length > 0 ? (
                        <>
                            <div className='overflow-x-auto'>
                                <table className='w-full border-collapse'>
                                    <thead>
                                        <tr className='border-b border-white/10'>
                                            <th className='font-clash px-4 py-4 text-left font-semibold text-white'>
                                                {t('landing.planColumn')}
                                            </th>
                                            <th className='font-clash px-4 py-4 text-center font-semibold text-white'>
                                                {t('landing.vCpuColumn')}
                                            </th>
                                            <th className='font-clash px-4 py-4 text-center font-semibold text-white'>
                                                {t('landing.ramColumn')}
                                            </th>
                                            <th className='font-clash px-4 py-4 text-center font-semibold text-white'>
                                                {t('landing.storageColumn')}
                                            </th>
                                            <th className='font-clash px-4 py-4 text-center font-semibold text-white'>
                                                {t('landing.monthlyColumn')}
                                            </th>
                                            <th className='px-4 py-4 text-right'></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {plans.map((plan, index) => {
                                            const totalMonthly = Math.round(
                                                plan.priceMonthly
                                            )
                                            const recommendedPlans: Record<
                                                string,
                                                string
                                            > = {
                                                hetzner: 'cax41',
                                                digitalocean: 's-4vcpu-8gb',
                                                vultr: 'vhp-4c-8gb-amd'
                                            }
                                            const isRecommended =
                                                plan.id ===
                                                recommendedPlans[
                                                    pricingProvider
                                                ]
                                            const tierStarts: Record<
                                                string,
                                                Record<string, string>
                                            > = {
                                                hetzner: {
                                                    cx23: t(
                                                        'landing.tierShared'
                                                    ),
                                                    cax11: t('landing.tierArm'),
                                                    ccx13: t(
                                                        'landing.tierDedicated'
                                                    )
                                                },
                                                vultr: {
                                                    'vc2-2c-4gb': t(
                                                        'landing.tierRegular'
                                                    ),
                                                    'vhp-2c-4gb-amd': t(
                                                        'landing.tierHighPerformance'
                                                    ),
                                                    'vhf-3c-8gb': t(
                                                        'landing.tierHighFrequency'
                                                    )
                                                }
                                            }

                                            const providerTiers =
                                                tierStarts[pricingProvider]
                                            const tierLabel =
                                                providerTiers?.[plan.id]
                                            const showTier =
                                                tierLabel && index > 0

                                            return (
                                                <>
                                                    {showTier && (
                                                        <tr
                                                            key={`tier-${plan.id}`}
                                                        >
                                                            <td
                                                                colSpan={6}
                                                                className='px-4 pb-2 pt-6'
                                                            >
                                                                <span className='font-clash text-xs font-semibold uppercase tracking-wider text-gray-500'>
                                                                    {tierLabel}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )}
                                                    <tr
                                                        key={plan.id}
                                                        className={`border-b border-white/5 ${
                                                            isRecommended
                                                                ? 'bg-[#ef5350]/5'
                                                                : ''
                                                        }`}
                                                    >
                                                        <td className='px-4 py-4'>
                                                            <div className='flex items-center gap-2'>
                                                                <span className='font-medium text-white'>
                                                                    {plan.name.replace(
                                                                        /([A-Za-z])(\d)/,
                                                                        '$1 $2'
                                                                    )}
                                                                </span>
                                                                {isRecommended && (
                                                                    <Badge className='border-0 bg-gradient-to-r from-[#ef5350] to-[#c62828] text-xs text-white'>
                                                                        {t(
                                                                            'landing.recommended'
                                                                        )}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className='px-4 py-4 text-center text-gray-300'>
                                                            {plan.cpu}
                                                        </td>
                                                        <td className='px-4 py-4 text-center text-gray-300'>
                                                            {plan.memory} GB
                                                        </td>
                                                        <td className='px-4 py-4 text-center text-gray-300'>
                                                            {plan.disk} GB
                                                        </td>
                                                        <td className='px-4 py-4 text-center'>
                                                            <span className='font-clash font-bold text-white'>
                                                                ${totalMonthly}
                                                            </span>
                                                            <span className='text-sm text-gray-500'>
                                                                /mo
                                                            </span>
                                                        </td>
                                                        <td className='px-4 py-4 text-right'>
                                                            <Button
                                                                size='sm'
                                                                className={`gap-2 px-4 ${
                                                                    isRecommended
                                                                        ? 'border-0 bg-gradient-to-r from-[#ef5350] to-[#c62828] text-white hover:opacity-90'
                                                                        : 'border-0 bg-white/10 text-white hover:bg-white/20'
                                                                }`}
                                                                asChild
                                                            >
                                                                <Link
                                                                    to={
                                                                        user
                                                                            ? `${ROUTES.CLAWS}?plan=${plan.id}`
                                                                            : `${ROUTES.LOGIN}?plan=${plan.id}`
                                                                    }
                                                                >
                                                                    {user
                                                                        ? t(
                                                                              'landing.deploy'
                                                                          )
                                                                        : t(
                                                                              'landing.select'
                                                                          )}
                                                                </Link>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                </>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className='mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-4'>
                                <div className='flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400'>
                                    <div className='flex items-center gap-2'>
                                        <Check className='h-4 w-4 text-green-400' />
                                        <span>
                                            {t('landing.openClawPreinstalled')}
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Check className='h-4 w-4 text-green-400' />
                                        <span>
                                            {t('landing.unlimitedBandwidth')}
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Check className='h-4 w-4 text-green-400' />
                                        <span>
                                            {t('landing.rootSshAccess')}
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Check className='h-4 w-4 text-green-400' />
                                        <span>{t('landing.onlineAllDay')}</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Check className='h-4 w-4 text-green-400' />
                                        <span>
                                            {t('landing.highQualityInternet')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className='py-12 text-center text-gray-400'>
                            {t('errors.unableToLoadPricing')}
                        </div>
                    )}
                </div>
            </section>

            <section
                id='comparison'
                className='relative scroll-mt-20 border-t border-white/5 px-6 py-24'
            >
                <div className='mx-auto max-w-3xl'>
                    <div className='mb-16 text-center'>
                        <Badge
                            variant='outline'
                            className='mb-4 border-white/10 bg-white/5 text-gray-300'
                        >
                            {t('landing.comparison')}
                        </Badge>
                        <h2 className='font-clash mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl'>
                            {t('landing.comparisonTitle')}
                        </h2>
                        <p className='mx-auto max-w-xl text-lg text-[#8892b0]'>
                            {t('landing.comparisonDescription')}
                        </p>
                    </div>

                    <div className='overflow-hidden rounded-xl border border-white/10'>
                        <table className='w-full'>
                            <thead>
                                <tr className='border-b border-white/10 bg-white/[0.02]'>
                                    <th className='px-6 py-4'>
                                        <div className='flex items-center justify-center'>
                                            <img
                                                src='https://cdn.clawhost.cloud/assets/clawhost-logo-light.png'
                                                alt='ClawHost'
                                                className='h-6'
                                            />
                                        </div>
                                    </th>
                                    <th className='px-6 py-4 text-center'>
                                        <span className='font-medium text-gray-400'>
                                            {t('landing.others')}
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-white/5'>
                                <tr>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <Check className='h-5 w-5 flex-shrink-0 text-green-400' />
                                            <span className='text-white'>
                                                {t(
                                                    'landing.comparisonOpenClawUs'
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <X className='h-5 w-5 flex-shrink-0 text-red-400' />
                                            <span className='text-gray-400'>
                                                {t(
                                                    'landing.comparisonOpenClawOthers'
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className='bg-white/[0.01]'>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <Check className='h-5 w-5 flex-shrink-0 text-green-400' />
                                            <span className='text-white'>
                                                {t(
                                                    'landing.comparisonPricingUs'
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <X className='h-5 w-5 flex-shrink-0 text-red-400' />
                                            <span className='text-gray-400'>
                                                {t(
                                                    'landing.comparisonPricingOthers'
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <Check className='h-5 w-5 flex-shrink-0 text-green-400' />
                                            <span className='text-white'>
                                                {t(
                                                    'landing.comparisonOwnershipUs'
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <X className='h-5 w-5 flex-shrink-0 text-red-400' />
                                            <span className='text-gray-400'>
                                                {t(
                                                    'landing.comparisonOwnershipOthers'
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className='bg-white/[0.01]'>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <Check className='h-5 w-5 flex-shrink-0 text-green-400' />
                                            <span className='text-white'>
                                                {t(
                                                    'landing.comparisonSubdomainUs'
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <X className='h-5 w-5 flex-shrink-0 text-red-400' />
                                            <span className='text-gray-400'>
                                                {t(
                                                    'landing.comparisonSubdomainOthers'
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <Check className='h-5 w-5 flex-shrink-0 text-green-400' />
                                            <span className='text-white'>
                                                {t('landing.comparisonInfraUs')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <X className='h-5 w-5 flex-shrink-0 text-red-400' />
                                            <span className='text-gray-400'>
                                                {t(
                                                    'landing.comparisonInfraOthers'
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className='bg-white/[0.01]'>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <Check className='h-5 w-5 flex-shrink-0 text-green-400' />
                                            <span className='text-white'>
                                                {t('landing.comparisonDataUs')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <X className='h-5 w-5 flex-shrink-0 text-red-400' />
                                            <span className='text-gray-400'>
                                                {t(
                                                    'landing.comparisonDataOthers'
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <Check className='h-5 w-5 flex-shrink-0 text-green-400' />
                                            <span className='text-white'>
                                                {t(
                                                    'landing.comparisonMultipleUs'
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <X className='h-5 w-5 flex-shrink-0 text-red-400' />
                                            <span className='text-gray-400'>
                                                {t(
                                                    'landing.comparisonMultipleOthers'
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className='bg-white/[0.01]'>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <Check className='h-5 w-5 flex-shrink-0 text-green-400' />
                                            <span className='text-white'>
                                                {t(
                                                    'landing.comparisonOpenSourceUs'
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <X className='h-5 w-5 flex-shrink-0 text-red-400' />
                                            <span className='text-gray-400'>
                                                {t(
                                                    'landing.comparisonOpenSourceOthers'
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <Check className='h-5 w-5 flex-shrink-0 text-green-400' />
                                            <span className='text-white'>
                                                {t(
                                                    'landing.comparisonExportUs'
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <X className='h-5 w-5 flex-shrink-0 text-red-400' />
                                            <span className='text-gray-400'>
                                                {t(
                                                    'landing.comparisonExportOthers'
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className='bg-white/[0.01]'>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <Check className='h-5 w-5 flex-shrink-0 text-green-400' />
                                            <span className='text-white'>
                                                {t(
                                                    'landing.comparisonProvidersUs'
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <X className='h-5 w-5 flex-shrink-0 text-red-400' />
                                            <span className='text-gray-400'>
                                                {t(
                                                    'landing.comparisonProvidersOthers'
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section
                id='faq'
                className='relative scroll-mt-20 border-t border-white/5 px-6 py-24'
            >
                <div className='mx-auto max-w-3xl'>
                    <div className='mb-16 text-center'>
                        <Badge
                            variant='outline'
                            className='mb-4 border-white/10 bg-white/5 text-gray-300'
                        >
                            {t('landing.faqTitle')}
                        </Badge>
                        <h2 className='font-clash mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl'>
                            {t('landing.frequentlyAskedQuestions')}
                        </h2>
                        <p className='mx-auto max-w-xl text-lg text-[#8892b0]'>
                            {t('landing.faqDescription')}
                        </p>
                    </div>

                    <div className='space-y-3'>
                        {getFaqs().map((faq, i) => (
                            <div
                                key={i}
                                className='overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]'
                            >
                                <button
                                    onClick={() =>
                                        setOpenFaq(openFaq === i ? null : i)
                                    }
                                    className='flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]'
                                >
                                    <span className='pr-4 font-medium text-white'>
                                        {faq.question}
                                    </span>
                                    <CaretDown
                                        className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                                            openFaq === i ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: 'auto',
                                                opacity: 1
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className='overflow-hidden'
                                        >
                                            <div className='px-5 pb-5'>
                                                <p className='leading-relaxed text-[#8892b0]'>
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className='relative border-t border-white/5 px-6 py-32'>
                <div className='mx-auto max-w-4xl text-center'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className='font-clash mb-6 text-4xl font-bold md:text-6xl'>
                            <span className='bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent'>
                                {t('landing.readyToOwnYourPrivacy')}
                            </span>
                        </h2>
                        <p className='mx-auto mb-10 max-w-2xl text-xl text-[#8892b0]'>
                            {t('landing.ctaDescription')}
                        </p>

                        <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
                            <HeroButtons
                                deployLabel={t('landing.deployOpenClawNow')}
                                githubLabel={t('landing.selfHostInstead')}
                                showStars={true}
                                large
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            <LandingFooter />
        </div>
    )
}

export default Landing