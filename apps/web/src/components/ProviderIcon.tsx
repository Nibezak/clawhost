import type { FC, ReactNode } from 'react'
import type { ProviderIconProps } from '@/ts/Interfaces'

const ProviderIcon: FC<ProviderIconProps> = ({
    provider,
    className
}): ReactNode => {
    if (provider === 'hetzner') {
        return (
            <svg
                className={className || 'h-4 w-4'}
                viewBox='0 0 63 64'
                fill='none'
            >
                <rect width='63' height='64' rx='31.5' fill='#D50C2D' />
                <path
                    d='M17 20h10v24H17zM36 20h10v24H36zM27 30h9v4h-9z'
                    fill='white'
                />
            </svg>
        )
    }

    if (provider === 'digitalocean') {
        return (
            <svg
                className={className || 'h-4 w-4'}
                viewBox='0 0 512 512'
                fill='none'
            >
                <path
                    d='M78 373v-47h47v104h57V300h74v147A191 191 0 1065 256h74a117 117 0 11117 117'
                    fill='#0080FF'
                />
            </svg>
        )
    }

    if (provider === 'vultr') {
        return (
            <svg
                className={className || 'h-4 w-4'}
                viewBox='0 0 48 48'
                fill='none'
            >
                <path
                    d='M24 0C10.745 0 0 10.745 0 24s10.745 24 24 24 24-10.745 24-24S37.255 0 24 0z'
                    fill='#007BFC'
                />
                <path d='M33.6 14.4H14.4L24 33.6z' fill='white' />
            </svg>
        )
    }

    return null
}

export default ProviderIcon