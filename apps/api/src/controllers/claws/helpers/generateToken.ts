// Generate a secure random token (64 hex chars = 32 bytes)
export function generateToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
        ''
    )
}