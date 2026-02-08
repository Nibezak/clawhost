import type { FC, ReactNode } from 'react'
import type { ProtectedRouteProps } from '@/ts/Interfaces'

import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { ROUTES } from '@/lib/routes'

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }): ReactNode => {
    const { user, loading } = useAuth()

    if (!loading && !user) {
        return <Navigate to={ROUTES.LOGIN} replace />
    }

    return <>{children}</>
}

export default ProtectedRoute