import { Navigate } from 'react-router-dom'
import { t } from '@openclaw/i18n'
import { useAuth } from '@/lib/auth'
import { ROUTES } from '@/lib/routes'
import { PageBackground } from '@/components/PageBackground'
import { Logo } from '@/components/Logo'
import { CircleNotch } from '@phosphor-icons/react'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#0a0a0f] text-white">
        <PageBackground />
        <div className="relative flex flex-1 flex-col items-center justify-center">
          <Logo />
          <div className="mt-8 flex items-center gap-3">
            <CircleNotch className="text-primary h-5 w-5 animate-spin" />
            <span className="text-muted-foreground">{t('common.loading')}</span>
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
