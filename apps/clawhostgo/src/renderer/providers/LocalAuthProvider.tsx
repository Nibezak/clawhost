import type { FC, ReactNode } from 'react'
import type { AuthContextType, CachedProfile } from '@/ts/Interfaces'

import { useState, useEffect } from 'react'
import AuthContext from '@electron/providers/AuthContext'

const noop = async (): Promise<void> => {}

const LocalAuthProvider: FC<{ children: ReactNode }> = ({
    children
}): ReactNode => {
    const [cachedProfile, setCachedProfile] = useState<CachedProfile>({
        email: 'local@clawhostgo',
        name: ''
    })

    useEffect(() => {
        window.electronAPI?.invoke('getProfile').then((profile) => {
            const p = profile as CachedProfile
            if (p?.name) {
                setCachedProfile((prev) => ({ ...prev, name: p.name || '' }))
            }
        })
    }, [])

    const value: AuthContextType = {
        user: {
            uid: 'local',
            email: 'local@clawhostgo'
        } as AuthContextType['user'],
        loading: false,
        cachedProfile,
        updateCachedProfile: (data) => {
            setCachedProfile((prev) => ({ ...prev, ...data }))
        },
        sendOtp: noop,
        verifyOtp: noop,
        signInWithGoogle: noop,
        signInWithGithub: noop,
        linkGoogle: noop,
        linkGithub: noop,
        unlinkGoogle: noop,
        unlinkGithub: noop,
        signOut: noop,
        isLocal: true
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default LocalAuthProvider