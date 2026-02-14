import type { FC, ReactNode } from 'react'
import type { CopyableFieldProps } from '@/ts/Interfaces'

import { useState } from 'react'
import { t } from '@openclaw/i18n'
import { useUIStore } from '@/lib/store'
import { Check, Copy } from '@phosphor-icons/react'

const CopyableField: FC<CopyableFieldProps> = ({
    label,
    value,
    icon
}): ReactNode => {
    const [isCopied, setIsCopied] = useState(false)
    const { showToast } = useUIStore()

    const handleCopy = () => {
        navigator.clipboard.writeText(value)
        setIsCopied(true)
        showToast(t('common.copiedWithLabel', { label }), 'success')
        setTimeout(() => setIsCopied(false), 2000)
    }

    return (
        <div
            onClick={handleCopy}
            className='bg-background hover:bg-background/80 group flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 transition-colors'
        >
            <div className='min-w-0'>
                <span className='text-muted-foreground block text-xs'>
                    {label}
                </span>
                <span className='flex items-center gap-1.5 truncate font-mono text-sm'>
                    {icon}
                    {value}
                </span>
            </div>
            <div className='shrink-0'>
                {isCopied ? (
                    <Check className='h-4 w-4 text-green-500' />
                ) : (
                    <Copy className='text-muted-foreground h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100' />
                )}
            </div>
        </div>
    )
}

export default CopyableField