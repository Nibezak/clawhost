import type { Context } from 'hono'

const ok = <T>(
    c: Context,
    data: T,
    message: string = '',
    code: number = 200
) => {
    return c.json(
        {
            success: true,
            data,
            message,
            code
        },
        200
    )
}

export default ok