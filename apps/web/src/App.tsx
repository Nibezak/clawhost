import type { FC, ReactNode } from 'react'

import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/lib/auth'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Toast } from '@/components/Toast'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ROUTES } from '@/lib/routes'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import SSHKeys from '@/pages/SSHKeys'
import Account from '@/pages/Account'
import Terms from '@/pages/Terms'
import Privacy from '@/pages/Privacy'
import Blog from '@/pages/Blog'
import BlogPost from '@/pages/BlogPost'
import NotFound from '@/pages/NotFound'
import ProtectedRoute from '@/components/ProtectedRoute'

const App: FC = (): ReactNode => {
    return (
        <TooltipProvider delayDuration={300}>
            <AuthProvider>
                <ScrollToTop />
                <Toast />
                <Routes>
                    <Route path={ROUTES.HOME} element={<Landing />} />
                    <Route path={ROUTES.LOGIN} element={<Login />} />
                    <Route path={ROUTES.TERMS} element={<Terms />} />
                    <Route path={ROUTES.PRIVACY} element={<Privacy />} />
                    <Route path={ROUTES.POSTS} element={<Blog />} />
                    <Route path={ROUTES.POST} element={<BlogPost />} />
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
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </TooltipProvider>
    )
}

export default App