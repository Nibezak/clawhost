import type { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { ROUTES } from '@/lib/routes'
import { GithubLogo, XLogo } from '@phosphor-icons/react'

const LandingFooter: FC = (): ReactNode => {
  return (
    <footer className="border-t border-white/5 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
              Deploy OpenClaw on your own VPS with one click. Full privacy, dedicated resources, no
              shared infrastructure.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://github.com/clawhost"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-white/5 p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
              >
                <GithubLogo className="h-5 w-5" weight="fill" />
              </a>
              <a
                href="https://x.com/clawhost"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-white/5 p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
              >
                <XLogo className="h-5 w-5" weight="fill" />
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              &copy; {new Date().getFullYear()} ClawHost. All rights reserved.
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Built by{' '}
              <a
                href="https://bfzli.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition hover:text-white"
              >
                @bfzli
              </a>
              {' · '}
              Supported by{' '}
              <a
                href="https://openclaw.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition hover:text-white"
              >
                OpenClaw
              </a>
              {' & '}
              <a
                href="https://hetzner.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition hover:text-white"
              >
                Hetzner
              </a>
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-clash mb-4 font-semibold text-white">Product</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/#how-it-works" className="text-gray-400 transition hover:text-white">
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/#features" className="text-gray-400 transition hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/#pricing" className="text-gray-400 transition hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="text-gray-400 transition hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & More */}
          <div>
            <h4 className="font-clash mb-4 font-semibold text-white">Legal & More</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to={ROUTES.PRIVACY} className="text-gray-400 transition hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to={ROUTES.TERMS} className="text-gray-400 transition hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/clawhost"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition hover:text-white"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@clawhost.cloud"
                  className="text-gray-400 transition hover:text-white"
                >
                  Get in Touch
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { LandingFooter }
