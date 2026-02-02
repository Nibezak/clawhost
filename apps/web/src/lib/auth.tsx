import type { ReactNode } from 'react'
import type { User } from 'firebase/auth'
import type { AuthContextType } from '@/ts/Interfaces'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailLink,
  isSignInWithEmailLink,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { api } from '@/lib/api'

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

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
    <AuthContext.Provider value={{ user, loading, sendOtp, verifyOtp, signOut }}>
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
