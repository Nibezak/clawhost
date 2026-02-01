import type { FC, ReactNode } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/lib/auth'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Toast } from '@/components/Toast'
import { ROUTES } from '@/lib/routes'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import SSHKeys from '@/pages/SSHKeys'
import Account from '@/pages/Account'
import Terms from '@/pages/Terms'
import Privacy from '@/pages/Privacy'
import NotFound from '@/pages/NotFound'
import ProtectedRoute from '@/components/ProtectedRoute'

const App: FC = (): ReactNode => {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Toast />
      <Routes>
        <Route path={ROUTES.HOME} element={<Landing />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.TERMS} element={<Terms />} />
        <Route path={ROUTES.PRIVACY} element={<Privacy />} />
        <Route
          path={ROUTES.CLAWS}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SSH_KEYS}
          element={
            <ProtectedRoute>
              <SSHKeys />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ACCOUNT}
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
