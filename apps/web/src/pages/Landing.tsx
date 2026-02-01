import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/Header'
import { LandingFooter } from '@/components/LandingFooter'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { ROUTES } from '@/lib/routes'
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
  Lightning,
  Sparkle,
  CaretDown,
  Quotes,
  GithubLogo,
} from '@phosphor-icons/react'

const testimonials = [
  {
    quote: "Finally, a VPN I actually own. Setup took 30 seconds and I've been running it for months without issues.",
    author: "Alex Chen",
    role: "Software Developer",
    avatar: "AC",
  },
  {
    quote: "Switched from NordVPN. Way faster speeds since I'm not sharing with thousands of other users.",
    author: "Maria Santos",
    role: "Digital Nomad",
    avatar: "MS",
  },
  {
    quote: "The one-click deploy is legit. I'm not technical at all but got my VPN running in under a minute.",
    author: "James Wilson",
    role: "Freelancer",
    avatar: "JW",
  },
  {
    quote: "Love that I can see exactly what's running on my server. Total transparency, unlike commercial VPNs.",
    author: "Sophie Kim",
    role: "Privacy Advocate",
    avatar: "SK",
  },
]

const faqs = [
  {
    question: "What is ClawHost?",
    answer: "ClawHost lets you deploy OpenClaw — a pre-configured VPN — onto your own dedicated VPS with one click. Pick a location, and your OpenClaw server is live and ready to connect in under 60 seconds.",
  },
  {
    question: "What is OpenClaw?",
    answer: "OpenClaw is a plug-and-play VPN solution built on WireGuard. It's pre-configured for security and performance, so you don't need to manually set up anything. Just deploy and connect.",
  },
  {
    question: "How is this different from NordVPN or ExpressVPN?",
    answer: "Commercial VPNs share servers with thousands of users. With ClawHost, you deploy OpenClaw on your own VPS — dedicated resources, full control, no logs, no third parties.",
  },
  {
    question: "Do I need technical knowledge?",
    answer: "Not at all. Just click deploy, pick a location, and we handle everything. You'll get a WireGuard config file that works with any WireGuard client on any device — just import and connect.",
  },
  {
    question: "What locations are available?",
    answer: "We offer 10+ VPS locations worldwide including US, Europe, Asia, and more. You can deploy OpenClaw on multiple servers in different regions if needed.",
  },
  {
    question: "How much does it cost?",
    answer: "Pricing starts at $25/month which includes the VPS cost plus the $20 OpenClaw pre-installation fee. You're billed hourly so you only pay for what you use. Destroy your server anytime.",
  },
  {
    question: "Can I access my server directly?",
    answer: "Yes! You get full root SSH access to your VPS. Install additional software, customize configurations, or use it for other purposes beyond OpenClaw.",
  },
]

export default function Landing() {
  const { user } = useAuth()
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: api.getPlans,
  })

  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState('')

useEffect(() => {
    const handleScroll = () => {
      // Determine active section
      const sections = ['how-it-works', 'features', 'testimonials', 'pricing', 'faq']
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

  // Add $20 for VPN pre-installed
  const VPN_FEE = 20

const navLinks = [
    { label: 'How it works', href: '#how-it-works', id: 'how-it-works' },
    { label: 'Features', href: '#features', id: 'features' },
    { label: 'Testimonials', href: '#testimonials', id: 'testimonials' },
    { label: 'Pricing', href: '#pricing', id: 'pricing' },
    { label: 'FAQ', href: '#faq', id: 'faq' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-satoshi">
      {/* Background gradient (fixed) */}
      <div className="fixed inset-0 landing-gradient pointer-events-none" />

      {/* Header */}
      <Header showNavLinks={true} navLinks={navLinks} activeSection={activeSection} />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Grid (scrolls with content, fades out) */}
        <div className="landing-grid pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-6xl mx-auto"
        >
          <div className="flex flex-col items-center text-center">
            {/* Animated badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 glow-border"
            >
              <Sparkle className="w-4 h-4 text-[#ef5350]" weight="fill" />
<span className="text-sm text-gray-300">Deploy OpenClaw on your own VPS</span>
            </motion.div>

            {/* Main heading with gradient - Clash Display font */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-clash text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05] tracking-tight"
            >
<span className="bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent">
                Deploy OpenClaw.
              </span>
              <br />
<span className="bg-gradient-to-r from-[#ef5350] via-[#ff7043] to-[#ffab91] bg-clip-text text-transparent animate-gradient">
                One click. Done.
              </span>
            </motion.h1>

<motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-[#8892b0] mb-10 max-w-2xl leading-relaxed"
            >
Get started with OpenClaw and skip all the boring, and hard configuration. We’ve got you covered with high-performance servers and zero setup.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
<Button size="lg" className="bg-gradient-to-r from-[#ef5350] to-[#c62828] hover:opacity-90 text-white font-semibold px-6 gap-2 border-0" asChild>
                <Link to={user ? ROUTES.CLAWS : ROUTES.LOGIN}>
                  <Lightning className="w-5 h-5" weight="fill" />
                  {user ? 'Go to Claws' : 'Deploy OpenClaw'}
                </Link>
              </Button>
<Button size="lg" variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 text-white px-6 gap-2" asChild>
                <a href="https://github.com/clawhost/openclaw" target="_blank" rel="noopener noreferrer">
                  <GithubLogo className="w-5 h-5" weight="fill" />
                  Self Host
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">2.4k</span>
                </a>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-8 md:gap-16 text-center"
            >
              <div>
                <div className="font-clash text-3xl md:text-4xl font-bold text-white">&lt;60s</div>
                <div className="text-sm text-gray-500">Deploy Time</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <div className="font-clash text-3xl md:text-4xl font-bold text-white">10+</div>
                <div className="text-sm text-gray-500">Locations</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <div className="font-clash text-3xl md:text-4xl font-bold text-white">100%</div>
                <div className="text-sm text-gray-500">Your Data</div>
              </div>
            </motion.div>
          </div>

{/* Dashboard Preview - macOS style */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-20 max-w-4xl mx-auto"
          >
            <div className="rounded-xl border border-white/10 bg-[#1a1a1f]/90 backdrop-blur-sm overflow-hidden glow-border shadow-2xl">
              {/* macOS Title Bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-[#2a2a30]">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                <div className="flex-1" />
                <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 text-gray-400 text-xs">
                  <Lock className="w-3 h-3" />
                  clawhost.cloud/claws
                </div>
              </div>
              {/* Dashboard Content */}
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Your Claws</h3>
                    <p className="text-sm text-gray-500">2 OpenClaw claws running</p>
                  </div>
                  <Link
                    to={user ? ROUTES.CLAWS : ROUTES.LOGIN}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ef5350] to-[#c62828] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Lightning className="w-4 h-4" weight="fill" />
                    Deploy New
                  </Link>
                </div>
                {/* Instance Cards */}
                <div className="space-y-3">
                  {/* Instance 1 */}
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/[0.02]">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">prod-vpn-eu</span>
                        <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">Running</span>
                      </div>
                      <div className="text-sm text-gray-500">Frankfurt, Germany • 2 vCPU • 4GB RAM</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white">45.33.21.98</div>
                      <div className="text-xs text-gray-500">24ms latency</div>
                    </div>
                  </div>
                  {/* Instance 2 */}
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/[0.02]">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">dev-vpn-us</span>
                        <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">Running</span>
                      </div>
                      <div className="text-sm text-gray-500">New York, USA • 1 vCPU • 2GB RAM</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white">192.241.145.32</div>
                      <div className="text-xs text-gray-500">12ms latency</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative py-24 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-white/10 bg-white/5 text-gray-300 mb-4">
              How it works
            </Badge>
            <h2 className="font-clash text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              Three steps to privacy
            </h2>
            <p className="text-[#8892b0] text-lg max-w-xl mx-auto">
              From zero to fully encrypted connection in under a minute
            </p>
          </div>

<div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: HardDrives,
                title: 'Choose your VPS',
                description: 'Pick from 10+ global locations. We spin up a dedicated VPS just for you in seconds.',
              },
              {
                step: '02',
                icon: ShieldCheck,
                title: 'We configure OpenClaw',
                description: 'OpenClaw is automatically installed and configured. No manual setup required.',
              },
              {
                step: '03',
                icon: Terminal,
                title: 'Connect & go',
                description: 'Download your config, import into any WireGuard client, and you\'re protected.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative p-6 rounded-xl border border-white/10 bg-white/[0.02]"
              >
                <div className="absolute -top-3 -left-1 font-clash text-6xl font-bold text-white/5">
                  {item.step}
                </div>
                <div className="relative pt-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#ef5350]/20 to-[#c62828]/20 border border-white/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-[#ef5350]" />
                  </div>
                  <h3 className="font-clash text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-[#8892b0] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 px-6 border-t border-white/5 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-white/10 bg-white/5 text-gray-300 mb-4">
              Features
            </Badge>
<h2 className="font-clash text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              Why ClawHost over self-hosting?
            </h2>
            <p className="text-[#8892b0] text-lg max-w-xl mx-auto">
              All the benefits of your own VPN, without the hassle of manual server configuration.
            </p>
          </div>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Clock, title: 'Zero Config', description: 'Skip hours of server setup. OpenClaw is pre-installed and ready in under 60 seconds.' },
              { icon: Lock, title: 'True Privacy', description: 'Your own VPS, your data. No shared infrastructure, no logs, no third parties.' },
              { icon: Gauge, title: 'Full Speed', description: 'Dedicated VPS resources mean no throttling. Get the full bandwidth of your server.' },
              { icon: Globe, title: 'Global Locations', description: 'Deploy OpenClaw in 10+ regions. Choose the location that works best for you.' },
              { icon: Terminal, title: 'Full SSH Access', description: 'Root access to your VPS. Install anything, customize everything.' },
              { icon: ShieldCheck, title: 'WireGuard Built-in', description: 'OpenClaw uses WireGuard — modern, fast, and secure by default.' },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-white/10 bg-white/[0.02]"
              >
                <feature.icon className="w-8 h-8 text-[#ef5350] mb-4" />
                <h3 className="font-clash text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-[#8892b0] text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* Testimonials */}
      <section id="testimonials" className="relative py-24 px-6 border-t border-white/5 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-white/10 bg-white/5 text-gray-300 mb-4">
              Testimonials
            </Badge>
            <h2 className="font-clash text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              What people say
            </h2>
            <p className="text-[#8892b0] text-lg max-w-xl mx-auto">
              Join thousands who've taken control of their privacy
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-white/10 bg-white/[0.02]"
              >
                <Quotes className="w-8 h-8 text-[#ef5350]/40 mb-4" weight="fill" />
                <p className="text-gray-300 leading-relaxed mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ef5350] to-[#c62828] flex items-center justify-center text-white text-sm font-medium">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-white">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-24 px-6 border-t border-white/5 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-white/10 bg-white/5 text-gray-300 mb-4">
              Pricing
            </Badge>
            <h2 className="font-clash text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              Simple, transparent pricing
            </h2>
<p className="text-[#8892b0] text-lg max-w-xl mx-auto">
              Pay only for what you use. All plans include OpenClaw pre-installed (+${VPN_FEE}/mo).
            </p>
          </div>

          {plansLoading ? (
            <div className="flex items-center justify-center py-12">
              <CircleNotch className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : plans && plans.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 font-clash font-semibold text-white">Plan</th>
                      <th className="text-center py-4 px-4 font-clash font-semibold text-white">vCPU</th>
                      <th className="text-center py-4 px-4 font-clash font-semibold text-white">RAM</th>
                      <th className="text-center py-4 px-4 font-clash font-semibold text-white">Storage</th>
                      <th className="text-center py-4 px-4 font-clash font-semibold text-white">Hourly</th>
                      <th className="text-center py-4 px-4 font-clash font-semibold text-white">Monthly</th>
                      <th className="text-right py-4 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((plan, index) => {
                      const totalMonthly = Math.round(plan.priceMonthly + VPN_FEE)
                      const isRecommended = index === 1

                      return (
                        <tr
                          key={plan.id}
                          className={`border-b border-white/5 ${
                            isRecommended ? 'bg-[#ef5350]/5' : ''
                          }`}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">{plan.name}</span>
                              {isRecommended && (
                                <Badge className="bg-gradient-to-r from-[#ef5350] to-[#c62828] border-0 text-white text-xs">
                                  Recommended
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="text-center py-4 px-4 text-gray-300">{plan.cpu}</td>
                          <td className="text-center py-4 px-4 text-gray-300">{plan.memory} GB</td>
                          <td className="text-center py-4 px-4 text-gray-300">{plan.disk} GB</td>
                          <td className="text-center py-4 px-4 text-gray-400 text-sm">
                            ${plan.priceHourly.toFixed(3)}/hr
                          </td>
                          <td className="text-center py-4 px-4">
                            <span className="font-clash font-bold text-white">${totalMonthly}</span>
                            <span className="text-gray-500 text-sm">/mo</span>
                          </td>
                          <td className="text-right py-4 px-4">
                            <Button
                              size="sm"
                              className={`px-4 gap-2 ${
                                isRecommended
                                  ? 'bg-gradient-to-r from-[#ef5350] to-[#c62828] hover:opacity-90 text-white border-0'
                                  : 'bg-white/10 hover:bg-white/20 text-white border-0'
                              }`}
                              asChild
                            >
                              <Link to={user ? `${ROUTES.CLAWS}?plan=${plan.id}` : `${ROUTES.LOGIN}?plan=${plan.id}`}>
                                {user ? 'Deploy' : 'Select'}
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
<div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>OpenClaw pre-installed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Unlimited bandwidth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Root SSH access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Hourly billing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              Unable to load pricing. Please try again later.
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative py-24 px-6 border-t border-white/5 scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-white/10 bg-white/5 text-gray-300 mb-4">
              FAQ
            </Badge>
            <h2 className="font-clash text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              Frequently asked questions
            </h2>
<p className="text-[#8892b0] text-lg max-w-xl mx-auto">
              Everything you need to know about deploying OpenClaw
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-medium text-white pr-4">{faq.question}</span>
                  <CaretDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        <p className="text-[#8892b0] leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* CTA */}
      <section className="relative py-32 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-clash text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                Ready to own your privacy?
              </span>
            </h2>
            <p className="text-[#8892b0] text-xl mb-10 max-w-2xl mx-auto">
              Join thousands who've deployed their own VPN with ClawHost.
              No technical skills required — just one click.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button size="lg" className="bg-gradient-to-r from-[#ef5350] to-[#c62828] hover:opacity-90 text-white font-semibold px-8 py-6 text-lg gap-2 border-0" asChild>
                <Link to={user ? ROUTES.CLAWS : ROUTES.LOGIN}>
                  <Lightning className="w-5 h-5" weight="fill" />
                  {user ? 'Go to Claws' : 'Deploy OpenClaw Now'}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 text-white px-8 py-6 text-lg gap-2" asChild>
                <a href="https://github.com/clawhost/openclaw" target="_blank" rel="noopener noreferrer">
                  <GithubLogo className="w-5 h-5" weight="fill" />
                  Self Host Instead
                </a>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Deploy in 60 seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
