import type { FC, ReactNode } from 'react'

import { AuthProvider, useAuth } from '@/lib/auth'
import { TooltipProvider } from '@/components/ui'
import Toast from '@/components/Toast'
import Dashboard from '@/pages/Dashboard'

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
        return (
            <div className='flex h-screen items-center justify-center bg-[#0a0a0f]'>
                <div className='h-8 w-8 animate-spin rounded-full border-2 border-[#ef5350] border-t-transparent' />
            </div>
        )
    }

    return <Dashboard />
}

const App: FC = (): ReactNode => {
    return (
        <TooltipProvider delayDuration={300}>
            <AuthProvider>
                <div id='electron-drag-bar' />
                <AppContent />
                <Toast />
            </AuthProvider>
        </TooltipProvider>
    )
}

export default App