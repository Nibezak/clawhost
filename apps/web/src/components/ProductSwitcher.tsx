import type { FC, ReactNode } from 'react'

import { Link, useLocation } from 'react-router-dom'
import { t } from '@openclaw/i18n'
import { ROUTES } from '@/lib'

const ProductSwitcher: FC = (): ReactNode => {
    const { pathname } = useLocation()
    const isGo = pathname.startsWith(ROUTES.GO)

    return (
        <div className='bg-foreground/5 border-border flex items-center gap-0.5 rounded-lg border p-0.5'>
            <Link
                to={ROUTES.HOME}
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                    !isGo
                        ? 'bg-foreground text-background shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                }`}
            >
                {t('nav.cloud')}
            </Link>
            <Link
                to={ROUTES.GO}
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                    isGo
                        ? 'bg-foreground text-background shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                }`}
            >
                {t('nav.go')}
            </Link>
        </div>
    )
}

export default ProductSwitcher