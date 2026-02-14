import type { FC, ReactNode } from 'react'
import type { User } from 'firebase/auth'

import { useCallback, useEffect, useState } from 'react'
import {
    onAuthStateChanged,
    signInWithCustomToken,
    signOut as firebaseSignOut
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import api from '@/lib/api'
import AuthContext from '@/lib/auth/AuthContext'

const AuthProvider: FC<{ children: ReactNode }> = ({ children }): ReactNode => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const sendOtp = useCallback(async (email: string): Promise<void> => {
        await api.sendOtp(email)
    }, [])

    const verifyOtp = useCallback(
        async (email: string, code: string): Promise<void> => {
            const { customToken } = await api.verifyOtp(email, code)
            await signInWithCustomToken(auth, customToken)
        },
        []
    )

    const signOut = useCallback(async (): Promise<void> => {
        await firebaseSignOut(auth)
    }, [])

    return (
        <AuthContext.Provider
            value={{ user, loading, sendOtp, verifyOtp, signOut }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider