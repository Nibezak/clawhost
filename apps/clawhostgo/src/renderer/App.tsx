import type { FC, ReactNode } from 'react'

import { AuthProvider, useAuth } from '@/lib/auth'
import Toast from '@/components/Toast'
import Login from '@/pages/Login'

const AppContent: FC = (): ReactNode => {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className='flex h-screen items-center justify-center bg-[#0a0a0f]'>
                <div className='h-8 w-8 animate-spin rounded-full border-2 border-[#ef5350] border-t-transparent' />
            </div>
        )
    }

    if (!user) {
        return <Login />
    }

    return (
        <div className='flex h-screen items-center justify-center bg-[#0a0a0f]'>
            <h1 className='text-2xl font-medium text-white'>ClawHost Go</h1>
        </div>
    )
}

const App: FC = (): ReactNode => {
    return (
        <AuthProvider>
            <AppContent />
            <Toast />
        </AuthProvider>
    )
}

export default App