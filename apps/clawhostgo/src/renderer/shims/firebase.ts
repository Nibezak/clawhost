const auth = null
const authReady = Promise.resolve()

const getCachedToken = async (): Promise<null> => null

const clearTokenCache = (): void => {}

const AUTH_STORAGE_KEY = 'clawhost-auth-token'
const PROFILE_CACHE_KEY = 'clawhost-profile-cache'

export {
    auth,
    authReady,
    getCachedToken,
    clearTokenCache,
    AUTH_STORAGE_KEY,
    PROFILE_CACHE_KEY
}