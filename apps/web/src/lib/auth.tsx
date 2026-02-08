import type { User } from 'firebase/auth'
import type {
    AuthContextType,
    AuthProviderProps,
    CachedProfile
} from '@/ts/Interfaces'
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
    onAuthStateChanged,
    signInWithEmailLink,
    isSignInWithEmailLink,
    signOut as firebaseSignOut
} from 'firebase/auth'
import { auth, AUTH_STORAGE_KEY, PROFILE_CACHE_KEY } from '@/lib/firebase'
import { api } from '@/lib/api'

const AuthContext = createContext<AuthContextType | null>(null)

function readCachedProfile(): CachedProfile | null {
    try {
        const raw = localStorage.getItem(PROFILE_CACHE_KEY)
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
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

                // Fetch profile and cache it
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
                    // Keep existing cached profile if fetch fails
                }

                // Prefetch other critical data
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

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}