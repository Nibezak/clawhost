import type { FC, ReactNode } from 'react'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Warning, X, Info } from '@phosphor-icons/react'
import { useUIStore } from '@/lib/store'

const icons = {
    success: Check,
    error: Warning,
    warning: Warning,
    info: Info
}

const colors = {
    success: 'bg-green-500/10 border-green-500/20 text-green-400',
    error: 'bg-red-500/10 border-red-500/20 text-red-400',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
}

const iconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
}

const Toast: FC = (): ReactNode => {
    const { toast, hideToast } = useUIStore()

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                hideToast()
            }, toast.duration || 5000)
            return () => clearTimeout(timer)
        }
    }, [toast, hideToast])

    return (
        <AnimatePresence>
            {toast && (
                <motion.div
                    initial={{ opacity: 0, y: -20, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: -20, x: '-50%' }}
                    className='fixed left-1/2 top-6 z-[100]'
                >
                    <div
                        className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm ${colors[toast.type]}`}
                    >
                        {(() => {
                            const Icon = icons[toast.type]
                            return (
                                <Icon
                                    className={`h-5 w-5 ${iconColors[toast.type]}`}
                                    weight='fill'
                                />
                            )
                        })()}
                        <span className='text-sm font-medium text-white'>
                            {toast.message}
                        </span>
                        <button
                            onClick={hideToast}
                            className='ml-2 text-gray-400 transition hover:text-white'
                        >
                            <X className='h-4 w-4' />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export { Toast }