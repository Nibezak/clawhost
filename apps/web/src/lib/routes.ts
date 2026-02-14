export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    CLAWS: '/claws',
    SSH_KEYS: '/ssh-keys',
    ACCOUNT: '/account',
    BILLING: '/billing',
    TERMS: '/terms',
    PRIVACY: '/privacy',
    CHANGELOG: '/changelog',
    POSTS: '/posts',
    POST: '/posts/:slug'
} as const

export type Route = (typeof ROUTES)[keyof typeof ROUTES]