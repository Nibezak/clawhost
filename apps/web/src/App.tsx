import type { FC, ReactNode } from 'react'

import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/lib/auth'
import ScrollToTop from '@/components/ScrollToTop'
import Toast from '@/components/Toast'
import { TooltipProvider } from '@/components/ui/tooltip'
import ROUTES from '@/lib/routes'
import ProtectedRoute from '@/components/ProtectedRoute'

const Landing = lazy(() => import('@/pages/Landing'))
const Login = lazy(() => import('@/pages/Login'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const SSHKeys = lazy(() => import('@/pages/SSHKeys'))
const Account = lazy(() => import('@/pages/Account'))
const Billing = lazy(() => import('@/pages/Billing'))
const Terms = lazy(() => import('@/pages/Terms'))
const Privacy = lazy(() => import('@/pages/Privacy'))
const Changelog = lazy(() => import('@/pages/Changelog'))
const Blog = lazy(() => import('@/pages/Blog'))
const BlogPost = lazy(() => import('@/pages/BlogPost'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const App: FC = (): ReactNode => {
    return (
        <TooltipProvider delayDuration={300}>
            <AuthProvider>
                <ScrollToTop />
                <Toast />
                <Suspense>
                    <Routes>
                        <Route path={ROUTES.HOME} element={<Landing />} />
                        <Route path={ROUTES.LOGIN} element={<Login />} />
                        <Route path={ROUTES.TERMS} element={<Terms />} />
                        <Route path={ROUTES.PRIVACY} element={<Privacy />} />
                        <Route
                            path={ROUTES.CHANGELOG}
                            element={<Changelog />}
                        />
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
                        <Route
                            path={ROUTES.BILLING}
                            element={
                                <ProtectedRoute>
                                    <Billing />
                                </ProtectedRoute>
                            }
                        />
                        <Route path='*' element={<NotFound />} />
                    </Routes>
                </Suspense>
            </AuthProvider>
        </TooltipProvider>
    )
}

export default App