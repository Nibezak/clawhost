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
                viewBox='0 0 1024 1024'
                fill='none'
            >
                <circle cx='512' cy='512' r='512' fill='#007BFC' />
                <path
                    d='M259.9 357.4c-2.5-3.9-3.9-8.6-3.9-13.6 0-14.1 11.5-25.6 25.6-25.6h131.1c9.1 0 17.1 4.8 21.7 12l181.9 288.5c2.5 4 3.9 8.6 3.9 13.6s-1.5 9.7-3.9 13.6l-65.6 104c-4.5 7.2-12.5 12-21.7 12-9.1 0-17.1-4.8-21.7-12L259.9 357.4zm395.3 158.1c4.5 7.2 12.5 11.9 21.7 11.9 9.1 0 17.1-4.8 21.7-11.9l22.6-35.8 43-68.2c2.5-3.9 3.9-8.6 3.9-13.7 0-5-1.5-9.7-3.9-13.7L730.1 330c-4.5-7.2-12.5-12-21.7-12H577.1c-14.1 0-25.6 11.5-25.6 25.6 0 5 1.4 9.7 3.9 13.6l99.8 158.3z'
                    fill='white'
                />
            </svg>
        )
    }

    if (provider === 'local') {
        return (
            <svg
                className={className || 'h-4 w-4'}
                viewBox='0 0 24 24'
                fill='none'
            >
                <rect width='24' height='24' rx='12' fill='#6366f1' />
                <path
                    d='M7 8h10v6H7zM9 14v2M15 14v2M6 16h12'
                    stroke='white'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                />
            </svg>
        )
    }

    return null
}

export default ProviderIcon