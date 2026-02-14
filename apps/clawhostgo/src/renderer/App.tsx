import type { FC, ReactNode } from 'react'

import { t } from '@openclaw/i18n'
import { AuthProvider, useAuth } from '@/lib/auth'
import Toast from '@/components/Toast'
import Login from '@/pages/Login'

const AppContent: FC = (): ReactNode => {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className='flex h-screen items-center justify-center bg-[#0a0a0f]'>
                <div className='flex flex-col items-center gap-3'>
                    <svg
                        className='h-8 w-8 animate-spin text-[#ef5350]'
                        viewBox='0 0 24 24'
                        fill='none'
                    >
                        <circle
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='3'
                            className='opacity-25'
                        />
                        <path
                            d='M4 12a8 8 0 018-8'
                            stroke='currentColor'
                            strokeWidth='3'
                            strokeLinecap='round'
                            className='opacity-75'
                        />
                    </svg>
                    <span className='text-sm text-gray-400'>
                        {t('common.loading')}
                    </span>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Login />
    }

    return (
        <div className='flex h-screen items-center justify-center bg-[#0a0a0f] text-white'>
            <p className='text-gray-400'>{t('common.loading')}</p>
        </div>
    )
}

const App: FC = (): ReactNode => {
    return (
        <AuthProvider>
            <Toast />
            <AppContent />
        </AuthProvider>
    )
}

export default App