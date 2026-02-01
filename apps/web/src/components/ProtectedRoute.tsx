import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { ROUTES } from '@/lib/routes'
import { PageBackground } from './PageBackground'
import { Logo } from './Logo'
import { CircleNotch } from '@phosphor-icons/react'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
        <PageBackground />
        <div className="relative flex-1 flex flex-col items-center justify-center">
          <Logo />
          <div className="mt-8 flex items-center gap-3">
            <CircleNotch className="w-5 h-5 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <>{children}</>
}
