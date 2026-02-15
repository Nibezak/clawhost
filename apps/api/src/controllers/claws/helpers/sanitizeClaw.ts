function sanitizeClaw<T extends Record<string, unknown>>(
    claw: T
): Omit<T, 'rootPassword' | 'gatewayToken'> {
    const {
        rootPassword: _,
        gatewayToken: __,
        ...safe
    } = claw as T & { rootPassword?: unknown; gatewayToken?: unknown }
    return safe as Omit<T, 'rootPassword' | 'gatewayToken'>
}

export default sanitizeClaw