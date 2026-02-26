import type { FC, ReactNode } from 'react'

import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/lib/auth'
import { TooltipProvider } from '@/components/ui'
import { useThemeEffect, useLanguageEffect } from '@/hooks'
import { ROUTES } from '@/lib'
import api from '@/lib/api'
import Toast from '@/components/Toast'
import Dashboard from '@/pages/Dashboard'
import Account from '@/pages/Account'
import SetupScreen from '@electron/components/SetupScreen'

const AppContent: FC = (): ReactNode => {
    const { user, loading } = useAuth()
    const [needsSetup, setNeedsSetup] = useState<boolean | null>(null)

    useEffect(() => {
        const checkProfile = () => {
            api.getProfile()
                .then((profile) => {
                    const p = profile as { setupComplete?: boolean }
                    setNeedsSetup(!p?.setupComplete)
                })
                .catch(() => {
                    setTimeout(checkProfile, 500)
                })
        }
        checkProfile()
    }, [])

    if (loading || needsSetup === null) {
        return (
            <div className='bg-background flex h-screen items-center justify-center'>
                <div className='h-8 w-8 animate-spin rounded-full border-2 border-[#ef5350] border-t-transparent' />
            </div>
        )
    }

    if (!user) {
        return (
            <div className='bg-background flex h-screen items-center justify-center'>
                <div className='h-8 w-8 animate-spin rounded-full border-2 border-[#ef5350] border-t-transparent' />
            </div>
        )
    }

    if (needsSetup) {
        return <SetupScreen onComplete={() => setNeedsSetup(false)} />
    }

    return (
        <Routes>
            <Route path={ROUTES.ACCOUNT} element={<Account />} />
            <Route path='*' element={<Dashboard />} />
        </Routes>
    )
}

const App: FC = (): ReactNode => {
    useThemeEffect()
    useLanguageEffect()

    return (
        <TooltipProvider delayDuration={300}>
            <AuthProvider>
                <div id='electron-drag-bar' className='bg-background' />
                <AppContent />
                <Toast />
            </AuthProvider>
        </TooltipProvider>
    )
}

export default App