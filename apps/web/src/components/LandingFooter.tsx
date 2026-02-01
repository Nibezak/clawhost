import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { ROUTES } from '@/lib/routes'
import { GithubLogo, XLogo } from '@phosphor-icons/react'

export function LandingFooter() {
  return (
    <footer className="border-t border-white/5 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 text-gray-400 text-sm max-w-sm leading-relaxed">
              Deploy OpenClaw on your own VPS with one click. Full privacy, dedicated resources, no shared infrastructure.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://github.com/clawhost"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
              >
                <GithubLogo className="w-5 h-5" weight="fill" />
              </a>
              <a
                href="https://x.com/clawhost"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
              >
                <XLogo className="w-5 h-5" weight="fill" />
              </a>
            </div>
            <p className="mt-4 text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} ClawHost. All rights reserved.
            </p>
            <p className="mt-2 text-gray-500 text-xs">
              Built by{' '}
              <a
                href="https://bfzli.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                @bfzli
              </a>
              {' · '}
              Supported by{' '}
              <a
                href="https://openclaw.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                OpenClaw
              </a>
              {' & '}
              <a
                href="https://hetzner.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                Hetzner
              </a>
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-clash font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/#how-it-works" className="text-gray-400 hover:text-white transition">How it works</Link></li>
              <li><Link to="/#features" className="text-gray-400 hover:text-white transition">Features</Link></li>
              <li><Link to="/#pricing" className="text-gray-400 hover:text-white transition">Pricing</Link></li>
              <li><Link to="/#faq" className="text-gray-400 hover:text-white transition">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal & More */}
          <div>
            <h4 className="font-clash font-semibold text-white mb-4">Legal & More</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to={ROUTES.PRIVACY} className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to={ROUTES.TERMS} className="text-gray-400 hover:text-white transition">Terms of Service</Link></li>
              <li><a href="https://github.com/clawhost" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">Documentation</a></li>
              <li><a href="mailto:support@clawhost.cloud" className="text-gray-400 hover:text-white transition">Get in Touch</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
