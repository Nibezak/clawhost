import type { FC, ReactNode } from 'react'
import type { AuthContextValue } from '@/ts/Interfaces'
import type { User } from 'firebase/auth'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { onAuthStateChanged, signInWithCustomToken, signOut as firebaseSignOut } from 'firebase/auth'
import { auth, clearTokenCache } from '@/lib/firebase'
import api from '@/lib/api'

const noop = async () => {}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    loading: true,
    sendOtp: noop,
    verifyOtp: noop,
    signOut: noop
})

const AuthProvider: FC<{ children: ReactNode }> = ({ children }): ReactNode => {
    const [user, setUser] = useState<AuthContextValue['user']>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!auth) {
            setLoading(false)
            return undefined
        }

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName
                })
            } else {
                setUser(null)
            }
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const sendOtp = useCallback(async (email: string): Promise<void> => {
        await api.sendOtp(email)
    }, [])

    const verifyOtp = useCallback(async (email: string, code: string): Promise<void> => {
        if (!auth) throw new Error('Auth not initialized')
        const { customToken } = await api.verifyOtp(email, code)
        await signInWithCustomToken(auth, customToken)
    }, [])

    const signOut = useCallback(async (): Promise<void> => {
        if (!auth) return
        clearTokenCache()
        await firebaseSignOut(auth)
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, sendOtp, verifyOtp, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = (): AuthContextValue => useContext(AuthContext)

export default AuthProvider
export { useAuth }