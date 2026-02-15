import type { FC, ReactNode } from 'react'

import { motion } from 'framer-motion'
import { t } from '@openclaw/i18n'
import Header from '@/components/Header'
import LandingFooter from '@/components/LandingFooter'
import PageBackground from '@/components/PageBackground'
import PageTitle from '@/components/PageTitle'
import { Check, Circle } from '@phosphor-icons/react'

const Changelog: FC = (): ReactNode => {
    return (
        <div className='relative flex min-h-screen flex-col bg-[#0a0a0f] text-white'>
            <PageTitle
                title={t('changelog.title')}
                description={t('changelog.description')}
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
                    {t('changelog.title')}
                </h1>
                <p className='text-muted-foreground mb-16'>
                    {t('changelog.subtitle')}
                </p>

                <div className='relative space-y-8 md:space-y-16'>
                    <div className='absolute left-[19px] top-6 hidden h-[calc(100%-3rem)] w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent md:block' />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className='relative md:pl-14'
                    >
                        <div className='absolute left-0 top-1 hidden md:block'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10'>
                                <div className='h-2 w-2 animate-pulse rounded-full bg-amber-400' />
                            </div>
                        </div>

                        <div className='rounded-2xl border border-amber-500/10 bg-amber-500/[0.02] p-8'>
                            <span className='mb-4 block text-sm font-medium text-amber-400'>
                                {t('changelog.upcomingRelease')}
                            </span>

                            <h2 className='font-clash mb-2 text-2xl font-bold'>
                                {t('changelog.upcomingReleaseTitle')}
                            </h2>

                            <p className='text-muted-foreground mb-6 leading-relaxed'>
                                {t('changelog.upcomingReleaseDescription')}
                            </p>

                            <ul className='space-y-3'>
                                <li className='flex items-center gap-3'>
                                    <Circle className='h-2.5 w-2.5 flex-shrink-0 text-amber-400' weight='fill' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.upcomingReleaseFeature1')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Circle className='h-2.5 w-2.5 flex-shrink-0 text-amber-400' weight='fill' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.upcomingReleaseFeature2')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Circle className='h-2.5 w-2.5 flex-shrink-0 text-amber-400' weight='fill' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.upcomingReleaseFeature3')}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className='relative md:pl-14'
                    >
                        <div className='absolute left-0 top-1 hidden md:block'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]'>
                                <div className='h-2 w-2 rounded-full bg-white/60' />
                            </div>
                        </div>

                        <div className='rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8'>
                            <span className='text-muted-foreground mb-4 block text-sm'>
                                {t('changelog.release5Date')}
                            </span>

                            <h2 className='font-clash mb-2 text-2xl font-bold'>
                                {t('changelog.release5Title')}
                            </h2>

                            <p className='text-muted-foreground mb-6 leading-relaxed'>
                                {t('changelog.release5Description')}
                            </p>

                            <ul className='space-y-3'>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release5Feature1')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release5Feature2')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release5Feature3')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release5Feature4')}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className='relative md:pl-14'
                    >
                        <div className='absolute left-0 top-1 hidden md:block'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]'>
                                <div className='h-2 w-2 rounded-full bg-white/60' />
                            </div>
                        </div>

                        <div className='rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8'>
                            <span className='text-muted-foreground mb-4 block text-sm'>
                                {t('changelog.release4Date')}
                            </span>

                            <h2 className='font-clash mb-2 text-2xl font-bold'>
                                {t('changelog.release4Title')}
                            </h2>

                            <p className='text-muted-foreground mb-6 leading-relaxed'>
                                {t('changelog.release4Description')}
                            </p>

                            <ul className='space-y-3'>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release4Feature1')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release4Feature2')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release4Feature3')}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        className='relative md:pl-14'
                    >
                        <div className='absolute left-0 top-1 hidden md:block'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]'>
                                <div className='h-2 w-2 rounded-full bg-white/60' />
                            </div>
                        </div>

                        <div className='rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8'>
                            <span className='text-muted-foreground mb-4 block text-sm'>
                                {t('changelog.release3Date')}
                            </span>

                            <h2 className='font-clash mb-2 text-2xl font-bold'>
                                {t('changelog.release3Title')}
                            </h2>

                            <p className='text-muted-foreground mb-6 leading-relaxed'>
                                {t('changelog.release3Description')}
                            </p>

                            <ul className='space-y-3'>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release3Feature1')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release3Feature2')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release3Feature3')}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                        className='relative md:pl-14'
                    >
                        <div className='absolute left-0 top-1 hidden md:block'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]'>
                                <div className='h-2 w-2 rounded-full bg-white/60' />
                            </div>
                        </div>

                        <div className='rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8'>
                            <span className='text-muted-foreground mb-4 block text-sm'>
                                {t('changelog.release2Date')}
                            </span>

                            <h2 className='font-clash mb-2 text-2xl font-bold'>
                                {t('changelog.release2Title')}
                            </h2>

                            <p className='text-muted-foreground mb-6 leading-relaxed'>
                                {t('changelog.release2Description')}
                            </p>

                            <ul className='space-y-3'>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release2Feature1')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release2Feature2')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release2Feature3')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release2Feature4')}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                        className='relative md:pl-14'
                    >
                        <div className='absolute left-0 top-1 hidden md:block'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]'>
                                <div className='h-2 w-2 rounded-full bg-white/60' />
                            </div>
                        </div>

                        <div className='rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8'>
                            <span className='text-muted-foreground mb-4 block text-sm'>
                                {t('changelog.release1Date')}
                            </span>

                            <h2 className='font-clash mb-2 text-2xl font-bold'>
                                {t('changelog.release1Title')}
                            </h2>

                            <p className='text-muted-foreground mb-6 leading-relaxed'>
                                {t('changelog.release1Description')}
                            </p>

                            <ul className='space-y-3'>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release1Feature1')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release1Feature2')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release1Feature3')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release1Feature4')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release1Feature5')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release1Feature6')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release1Feature7')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release1Feature8')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release1Feature9')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release1Feature10')}
                                    </span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <Check className='h-4 w-4 flex-shrink-0 text-green-400' />
                                    <span className='text-sm text-white'>
                                        {t('changelog.release1Feature11')}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </motion.main>

            <LandingFooter />
        </div>
    )
}

export default Changelog