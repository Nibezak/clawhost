import type { FC, ReactNode } from 'react'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import LandingFooter from '@/components/LandingFooter'
import PageBackground from '@/components/PageBackground'
import PageTitle from '@/components/PageTitle'

const Terms: FC = (): ReactNode => {
    return (
        <div className='relative flex min-h-screen flex-col bg-[#0a0a0f] text-white'>
            <PageTitle
                title='Terms of Service'
                description='Read the terms and conditions for using ClawHost services.'
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
                    Terms of Service
                </h1>
                <p className='text-muted-foreground mb-12'>
                    Last updated: February 7, 2026
                </p>

                <div className='prose prose-invert prose-sm max-w-none space-y-8'>
                    <section>
                        <h2 className='mb-3 text-xl font-semibold'>
                            1. Acceptance of Terms
                        </h2>
                        <p className='text-muted-foreground leading-relaxed'>
                            By accessing and using ClawHost ("Service"), you
                            accept and agree to be bound by the terms and
                            provisions of this agreement. If you do not agree to
                            these terms, please do not use our Service.
                        </p>
                    </section>

                    <section>
                        <h2 className='mb-3 text-xl font-semibold'>
                            2. Description of Service
                        </h2>
                        <p className='text-muted-foreground leading-relaxed'>
                            ClawHost provides one-click OpenClaw deployment on
                            dedicated servers. We enable users to deploy,
                            manage, and access pre-configured OpenClaw instances
                            with full root access and dedicated resources.
                        </p>
                    </section>

                    <section>
                        <h2 className='mb-3 text-xl font-semibold'>
                            3. User Responsibilities
                        </h2>
                        <p className='text-muted-foreground leading-relaxed'>
                            You agree to:
                        </p>
                        <ul className='text-muted-foreground mt-2 list-inside list-disc space-y-2'>
                            <li>
                                Provide accurate and complete registration
                                information
                            </li>
                            <li>
                                Maintain the security of your account
                                credentials
                            </li>
                            <li>
                                Use the Service in compliance with all
                                applicable laws
                            </li>
                            <li>
                                Not use the Service for any illegal or
                                unauthorized purpose
                            </li>
                            <li>
                                Not attempt to gain unauthorized access to any
                                systems or networks
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='mb-3 text-xl font-semibold'>
                            4. Prohibited Uses
                        </h2>
                        <p className='text-muted-foreground leading-relaxed'>
                            You may not use our Service to:
                        </p>
                        <ul className='text-muted-foreground mt-2 list-inside list-disc space-y-2'>
                            <li>
                                Distribute malware, viruses, or any harmful
                                software
                            </li>
                            <li>
                                Conduct denial-of-service attacks or network
                                abuse
                            </li>
                            <li>Send spam or unsolicited communications</li>
                            <li>Host or distribute illegal content</li>
                            <li>
                                Violate any third-party rights including
                                intellectual property
                            </li>
                            <li>Mine cryptocurrency</li>
                            <li>
                                Any other unlawful or harmful activities that we
                                may determine to be inappropriate at our
                                discretion
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='mb-3 text-xl font-semibold'>
                            5. Payment and Billing
                        </h2>
                        <p className='text-muted-foreground leading-relaxed'>
                            Services are billed on a fixed monthly basis. All
                            payments are non-refundable. When you pay for a
                            server, you have access to it for the full billing
                            period. If you cancel, the cancellation takes effect
                            at the end of the current billing period. Prices are
                            subject to change with reasonable notice. Failure to
                            pay may result in suspension or termination of your
                            account.
                        </p>
                    </section>

                    <section>
                        <h2 className='mb-3 text-xl font-semibold'>
                            6. Service Availability
                        </h2>
                        <p className='text-muted-foreground leading-relaxed'>
                            We strive to maintain high availability but do not
                            guarantee uninterrupted access to the Service. We
                            reserve the right to modify, suspend, or discontinue
                            any part of the Service at any time with or without
                            notice.
                        </p>
                    </section>

                    <section>
                        <h2 className='mb-3 text-xl font-semibold'>
                            7. Limitation of Liability
                        </h2>
                        <p className='text-muted-foreground leading-relaxed'>
                            To the maximum extent permitted by law, ClawHost
                            shall not be liable for any indirect, incidental,
                            special, consequential, or punitive damages, or any
                            loss of profits or revenues, whether incurred
                            directly or indirectly.
                        </p>
                    </section>

                    <section>
                        <h2 className='mb-3 text-xl font-semibold'>
                            8. Termination
                        </h2>
                        <p className='text-muted-foreground leading-relaxed'>
                            We may terminate or suspend your account and access
                            to the Service immediately, without prior notice,
                            for conduct that we believe violates these Terms or
                            is harmful to other users, us, or third parties, or
                            for any other reason.
                        </p>
                    </section>

                    <section>
                        <h2 className='mb-3 text-xl font-semibold'>
                            9. Changes to Terms
                        </h2>
                        <p className='text-muted-foreground leading-relaxed'>
                            We reserve the right to modify these terms at any
                            time. We will notify users of any material changes
                            via email or through the Service. Continued use of
                            the Service after such modifications constitutes
                            acceptance of the updated terms.
                        </p>
                    </section>

                    <section>
                        <h2 className='mb-3 text-xl font-semibold'>
                            10. Contact Information
                        </h2>
                        <p className='text-muted-foreground leading-relaxed'>
                            If you have any questions about these Terms, please
                            contact us at{' '}
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