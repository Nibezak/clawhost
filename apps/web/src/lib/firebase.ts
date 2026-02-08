import type { User } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

export const AUTH_STORAGE_KEY = 'clawhost_auth'
export const PROFILE_CACHE_KEY = 'clawhost_profile'

// Shared promise that resolves when Firebase first determines auth state.
// All token requests wait on this instead of creating separate onAuthStateChanged listeners.
let authReadyResolve: (user: User | null) => void
export const authReady = new Promise<User | null>((resolve) => {
    authReadyResolve = resolve
})

const unsubscribeInit = onAuthStateChanged(auth, (user) => {
    authReadyResolve(user)
    unsubscribeInit()
})

// In-memory token cache (Firebase tokens last 3600s, refresh at 3500s)
let cachedToken: string | null = null
let tokenExpiry = 0

export async function getCachedToken(): Promise<string | null> {
    // Fast path: token is cached and valid
    if (cachedToken && Date.now() < tokenExpiry) {
        return cachedToken
    }

    // If currentUser isn't available yet, wait for auth to initialize
    if (!auth.currentUser) {
        const user = await authReady
        if (!user) return null
    }

    const currentUser = auth.currentUser
    if (!currentUser) return null

    cachedToken = await currentUser.getIdToken()
    tokenExpiry = Date.now() + 3500 * 1000
    return cachedToken
}

export function clearTokenCache(): void {
    cachedToken = null
    tokenExpiry = 0
}

// Clear token cache when user signs out
onAuthStateChanged(auth, (user) => {
    if (!user) {
        clearTokenCache()
    }
})