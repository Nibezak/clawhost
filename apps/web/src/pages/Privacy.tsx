import type { FC, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/Header'
import { LandingFooter } from '@/components/LandingFooter'
import { PageBackground } from '@/components/PageBackground'
import { PageTitle } from '@/components/PageTitle'

const Privacy: FC = (): ReactNode => {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#0a0a0f] text-white">
      <PageTitle title="Privacy Policy" />
      <PageBackground />
      <Header />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative mx-auto max-w-3xl flex-1 px-6 py-12"
      >
        <h1 className="font-clash mb-2 text-4xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground mb-12">Last updated: February 1, 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8">
          <section>
            <h2 className="mb-3 text-xl font-semibold">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              ClawHost ("we", "our", or "us") is committed to protecting your privacy. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your information when you
              use our Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">2. Information We Collect</h2>
            <p className="text-muted-foreground mb-3 leading-relaxed">
              We collect information in the following ways:
            </p>

            <h3 className="mb-2 text-lg font-medium">Personal Information</h3>
            <ul className="text-muted-foreground list-inside list-disc space-y-2">
              <li>Email address (for account creation and communication)</li>
              <li>Name (optional, for personalization)</li>
              <li>Payment information (processed securely by third-party providers)</li>
            </ul>

            <h3 className="mb-2 mt-4 text-lg font-medium">Usage Information</h3>
            <ul className="text-muted-foreground list-inside list-disc space-y-2">
              <li>Server usage and resource consumption</li>
              <li>Login times and IP addresses</li>
              <li>Browser type and device information</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the collected information to:
            </p>
            <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-2">
              <li>Provide and maintain our Service</li>
              <li>Process transactions and send billing information</li>
              <li>Send important notices and updates</li>
              <li>Respond to customer support requests</li>
              <li>Monitor and analyze usage patterns to improve our Service</li>
              <li>Detect and prevent fraud or abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">4. Data Sharing and Disclosure</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell your personal information. We may share information with:
            </p>
            <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-2">
              <li>
                Service providers who assist in operating our Service (e.g., cloud infrastructure
                providers)
              </li>
              <li>Legal authorities when required by law or to protect our rights</li>
              <li>Business partners in case of merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">5. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational measures to protect your
              personal information against unauthorized access, alteration, disclosure, or
              destruction. This includes encryption, secure servers, and regular security
              assessments.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">6. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information for as long as your account is active or as needed
              to provide you services. We may retain certain information as required by law or for
              legitimate business purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">7. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              Depending on your location, you may have the right to:
            </p>
            <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">8. Cookies and Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use essential cookies to maintain your session and provide the Service. We do not
              use third-party tracking cookies for advertising purposes. You can configure your
              browser to refuse cookies, but this may affect Service functionality.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">9. International Data Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your information may be transferred to and processed in countries other than your own.
              We ensure appropriate safeguards are in place to protect your data in accordance with
              this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">10. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our Service is not intended for individuals under 18 years of age. We do not knowingly
              collect personal information from children. If we become aware of such collection, we
              will delete the information immediately.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">11. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">12. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy or wish to exercise your rights,
              please contact us at{' '}
              <a href="mailto:privacy@clawhost.cloud" className="text-primary hover:underline">
                privacy@clawhost.cloud
              </a>
            </p>
          </section>
        </div>
      </motion.main>

      <LandingFooter />
    </div>
  )
}

export default Privacy
