function sanitizeClaw<T extends Record<string, unknown>>(
    claw: T
): Omit<T, 'rootPassword'> {
    const { rootPassword: _, ...safe } = claw as T & { rootPassword?: unknown }
    return safe as Omit<T, 'rootPassword'>
}

export default sanitizeClaw