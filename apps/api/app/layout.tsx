import type { FC, ReactNode } from 'react'
import type { RootLayoutProps } from '@/ts/Interfaces'

const RootLayout: FC<RootLayoutProps> = ({ children }): ReactNode => {
    return (
        <html>
            <body>{children}</body>
        </html>
    )
}

export default RootLayout