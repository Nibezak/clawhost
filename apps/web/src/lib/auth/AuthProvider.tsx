import type { FC, ReactNode } from 'react'
import type { User } from 'firebase/auth'
import type { AuthProviderProps, CachedProfile } from '@/ts/Interfaces'

import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
    onAuthStateChanged,
    signInWithEmailLink,
    isSignInWithEmailLink,
    signOut as firebaseSignOut
} from 'firebase/auth'
import { auth, AUTH_STORAGE_KEY, PROFILE_CACHE_KEY } from '@/lib/firebase'
import api from '@/lib/api'
import AuthContext from '@/lib/auth/AuthContext'

function readCachedProfile(): CachedProfile | null {
    try {
        const raw = localStorage.getItem(PROFILE_CACHE_KEY)
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

const AuthProvider: FC<AuthProviderProps> = ({ children }): ReactNode => {
    const queryClient = useQueryClient()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [cachedProfile, setCachedProfile] = useState<CachedProfile | null>(
        readCachedProfile
    )

    const updateCachedProfile = useCallback((data: Partial<CachedProfile>) => {
        setCachedProfile((prev) => {
            const updated = { ...prev, ...data } as CachedProfile
            localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(updated))
            return updated
        })
    }, [])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user)
            setLoading(false)

            if (user) {
                localStorage.setItem(AUTH_STORAGE_KEY, 'true')

                try {
                    const profile = await queryClient.fetchQuery({
                        queryKey: ['profile'],
                        queryFn: api.getProfile
                    })
                    const fresh: CachedProfile = {
                        email: profile.email,
                        name: profile.name
                    }
                    setCachedProfile(fresh)
                    localStorage.setItem(
                        PROFILE_CACHE_KEY,
                        JSON.stringify(fresh)
                    )
                } catch {
                    /* localStorage unavailable */
                }

                queryClient.prefetchQuery({
                    queryKey: ['claws'],
                    queryFn: () => api.getClaws()
                })
                queryClient.prefetchQuery({
                    queryKey: ['userStats'],
                    queryFn: api.getUserStats
                })
            } else {
                localStorage.removeItem(AUTH_STORAGE_KEY)
                localStorage.removeItem(PROFILE_CACHE_KEY)
                setCachedProfile(null)
            }
        })
        return unsubscribe
    }, [queryClient])

    const sendOtp = async (email: string) => {
        const redirectUrl = `${window.location.origin}/login`
        await api.sendMagicLink(email, redirectUrl)
        window.localStorage.setItem('emailForSignIn', email)
    }

    const verifyOtp = async (email: string) => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            await signInWithEmailLink(auth, email, window.location.href)
            window.localStorage.removeItem('emailForSignIn')
        }
    }

    const signOut = async () => {
        await firebaseSignOut(auth)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                cachedProfile,
                updateCachedProfile,
                sendOtp,
                verifyOtp,
                signOut
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider