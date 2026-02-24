import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    transpilePackages: ['@openclaw/shared', '@openclaw/i18n'],
    serverExternalPackages: ['ssh2', 'ws']
}

export default nextConfig