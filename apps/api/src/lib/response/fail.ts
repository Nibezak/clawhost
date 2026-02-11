import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

const fail = <T = null>(
    c: Context,
    message: string,
    code: ContentfulStatusCode = 400,
    data: T = null as T
) => {
    return c.json(
        {
            success: false,
            data,
            message,
            code
        },
        code
    )
}

export default fail