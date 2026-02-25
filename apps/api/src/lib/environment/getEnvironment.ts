import type { Context } from 'hono'
import type { Environment } from '@/ts/Types'

import DEV from '@/lib/environment/DEV'
import PROD from '@/lib/environment/PROD'

const getEnvironment = (c: Context): Environment => {
    const url = new URL(c.req.url)
    const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1'
    return isLocal ? DEV : PROD
}

export default getEnvironment