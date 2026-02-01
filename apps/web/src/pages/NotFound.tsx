import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/Header'
import { LandingFooter } from '@/components/LandingFooter'
import { PageBackground } from '@/components/PageBackground'
import { PageTitle } from '@/components/PageTitle'
import { ROUTES } from '@/lib/routes'
import { House, MagnifyingGlass } from '@phosphor-icons/react'

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <PageTitle title="Page Not Found" />
      <PageBackground />
      <Header />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative flex-1 flex items-center justify-center px-6 py-8"
      >
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <MagnifyingGlass className="w-12 h-12 text-primary" />
          </div>

          <h1 className="font-clash text-6xl font-bold mb-4">404</h1>
          <h2 className="text-xl font-semibold mb-2">Page not found</h2>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Button size="lg" asChild>
            <Link to={ROUTES.HOME}>
              <House className="w-5 h-5" weight="regular" />
              Go to Homepage
            </Link>
          </Button>
        </div>
      </motion.main>

      <LandingFooter />
    </div>
  )
}
