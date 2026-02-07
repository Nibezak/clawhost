import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@openclaw/shared', '@openclaw/i18n'],
}

export default nextConfig
