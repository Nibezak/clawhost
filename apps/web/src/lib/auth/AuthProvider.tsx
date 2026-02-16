import type { FC, ReactNode } from 'react'
import type { User } from 'firebase/auth'
import type { AuthProviderProps, CachedProfile } from '@/ts/Interfaces'

import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
    GoogleAuthProvider,
    GithubAuthProvider,
    onAuthStateChanged,
    signInWithCustomToken,
    signInWithPopup,
    signOut as firebaseSignOut
} from 'firebase/auth'
import { auth, AUTH_STORAGE_KEY, PROFILE_CACHE_KEY } from '@/lib/firebase'
import { api } from '@/lib'
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
                } catch {}

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
                queryClient.clear()
            }
        })
        return unsubscribe
    }, [queryClient])

    const sendOtp = useCallback(async (email: string) => {
        await api.sendOtp(email)
    }, [])

    const verifyOtp = useCallback(async (email: string, code: string) => {
        const { customToken } = await api.verifyOtp(email, code)
        await signInWithCustomToken(auth, customToken)
    }, [])

    const signInWithGoogle = useCallback(async () => {
        await signInWithPopup(auth, new GoogleAuthProvider())
    }, [])

    const signInWithGithub = useCallback(async () => {
        await signInWithPopup(auth, new GithubAuthProvider())
    }, [])

    const signOut = useCallback(async () => {
        await firebaseSignOut(auth)
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                cachedProfile,
                updateCachedProfile,
                sendOtp,
                verifyOtp,
                signInWithGoogle,
                signInWithGithub,
                signOut
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider