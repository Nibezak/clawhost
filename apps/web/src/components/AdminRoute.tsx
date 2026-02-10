import type { FC, ReactNode } from 'react'
import type { AdminRouteProps } from '@/ts/Interfaces'

import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/hooks'
import { ROUTES } from '@/lib/routes'
import NotFound from '@/pages/NotFound'

const AdminRoute: FC<AdminRouteProps> = ({ children }): ReactNode => {
    const { user, loading } = useAuth()
    const { data: profile, isLoading: profileLoading } = useProfile({
        enabled: !!user
    })

    if (loading || profileLoading) {
        return null
    }

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace />
    }

    if (profile && profile.role !== 'admin') {
        return <NotFound />
    }

    return <>{children}</>
}

export default AdminRoute