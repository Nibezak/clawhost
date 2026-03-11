import PATHS from '@/lib/paths'

const ROUTES = {
    HOME: PATHS.HOME,
    LOGIN: `/${PATHS.LOGIN}`,
    CLAWS: `/${PATHS.CLAWS}`,
    SSH_KEYS: `/${PATHS.SSH_KEYS}`,
    ACCOUNT: `/${PATHS.ACCOUNT}`,
    BILLING: `/${PATHS.BILLING}`,
    TERMS: `/${PATHS.TERMS}`,
    PRIVACY: `/${PATHS.PRIVACY}`,
    CHANGELOG: `/${PATHS.CHANGELOG}`,
    BLOG: `/${PATHS.BLOG}`,
    BLOG_POST: `/${PATHS.BLOG}/:slug`,
    COMPARE: `/${PATHS.COMPARE}`
} as const

export default ROUTES