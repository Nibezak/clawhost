import type { FC, ReactNode } from 'react'

import { motion } from 'framer-motion'
import { t } from '@openclaw/i18n'
import Header from '@/components/Header'
import LandingFooter from '@/components/LandingFooter'
import PageBackground from '@/components/PageBackground'
import PageTitle from '@/components/PageTitle'

const Terms: FC = (): ReactNode => {
    return (
        <div className='relative flex min-h-screen flex-col bg-[#0a0a0f] text-white'>
            <PageTitle
                title={t('terms.title')}
                description={t('terms.description')}
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
                    {t('terms.title')}
                </h1>
                <p className='text-muted-foreground mb-12'>
                    {t('terms.lastUpdated')}
                </p>

                <div className='prose prose-invert prose-sm max-w-none space-y-8'>
                    <section>
                        <h2 className='mb-3 text-xl font-semibold'>
                            {t('terms.acceptanceTitle')}
                        </h2>
                        <p className='text-muted-foreground leading-relaxed'>
                            {t('terms.acceptanceText')}
                        </p>
                    </section>

                    <section>
                        <h2 className='mb-3 text-xl font-semibold'>
                            {t('terms.serviceTitle')}
                        </h2>
                        <p className='text-muted-foreground leading-relaxed'>
                            {t('terms.serviceText')}
                        </p>
                    </section>

                    <section>
                        <h2 className='mb-3 text-xl font-semibold'>
                            {t('terms.responsibilitiesTitle')}
                        </h2>
                        <p className='text-muted-foreground leading-relaxed'>
                            {t('terms.responsibilitiesText')}
                        </p>
                        <ul className='text-muted-foreground mt-2 list-inside list-disc space-y-2'>
                            <li>{t('terms.responsibilitiesAccurate')}</li>
                            <li>{t('terms.responsibilitiesSecurity')}</li>
                            <li>{t('terms.responsibilitiesCompliance')}</li>
                            <li>{t('terms.responsibilitiesLegal')}</li>
                            <li>{t('terms.responsibilitiesAccess')}</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='mb-3 text-xl font-semibold'>
                            {t('terms.prohibitedTitle')}
                        </h2>
                        <p className='text-muted-foreground leading-relaxed'>
                            {t('terms.prohibitedText')}
                        </p>
                        <ul className='text-muted-foreground mt-2 list-inside list-disc space-y-2'>
                            <li>{t('terms.prohibitedMalware')}</li>
                            <li>{t('terms.prohibitedDos')}</li>
                            <li>{t('terms.prohibitedSpam')}</li>
                            <li>{t('terms.prohibitedIllegal')}</li>
                            <li>{t('terms.prohibitedIp')}</li>
                            <li>{t('terms.prohibitedMining')}</li>
                            <li>{t('terms.prohibitedOther')}</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='mb-3 text-xl font-semibold'>
                            {t('terms.paymentTitle')}
                        </h2>
                        <p className='text-muted-foreground leading-relaxed'>
                            {t('terms.paymentText')}
                        </p>
                    </section>

                    <section>
                        <h2 className='mb-3 text-xl font-semibold'>
                            {t('terms.availabilityTitle')}
                        </h2>
                        <p className='text-muted-foreground leading-relaxed'>
                            {t('terms.availabilityText')}
                        </p>
                    </section>

                    <section>
                        <h2 className='mb-3 text-xl font-semibold'>
                            {t('terms.liabilityTitle')}
                        </h2>
                        <p className='text-muted-foreground leading-relaxed'>
                            {t('terms.liabilityText')}
                        </p>
                    </section>

                    <section>
                        <h2 className='mb-3 text-xl font-semibold'>
                            {t('terms.terminationTitle')}
                        </h2>
                        <p className='text-muted-foreground leading-relaxed'>
                            {t('terms.terminationText')}
                        </p>
                    </section>

                    <section>
                        <h2 className='mb-3 text-xl font-semibold'>
                            {t('terms.changesToTermsTitle')}
                        </h2>
                        <p className='text-muted-foreground leading-relaxed'>
                            {t('terms.changesToTermsText')}
                        </p>
                    </section>

                    <section>
                        <h2 className='mb-3 text-xl font-semibold'>
                            {t('terms.contactTitle')}
                        </h2>
                        <p className='text-muted-foreground leading-relaxed'>
                            {t('terms.contactText')}{' '}
                            <a
                                href='mailto:legal@clawhost.cloud'
                                className='text-primary hover:underline'
                            >
                                legal@clawhost.cloud
                            </a>
                        </p>
                    </section>
                </div>
            </motion.main>

            <LandingFooter />
        </div>
    )
}

export default Terms