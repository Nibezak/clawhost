import type { FC, ReactNode } from 'react'
import type { ChatLightboxProps } from '@/ts/Interfaces'

import { useEffect, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { t } from '@openclaw/i18n'
import { CircleNotchIcon, DownloadSimpleIcon, XIcon, FileTextIcon } from '@phosphor-icons/react'

const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']

const getImageSrc = (image: ChatLightboxProps['image']): string => {
    if (image.type === 'url') return image.data
    return `data:${image.mediaType};base64,${image.data}`
}

const deriveFileName = (image: ChatLightboxProps['image']): string => {
    if (image.filename) return image.filename
    if (image.type === 'url') return image.data.split('/').pop() || 'file'
    const ext = image.mediaType.split('/')[1] || 'bin'
    return `file.${ext}`
}

const ChatLightbox: FC<ChatLightboxProps> = ({ image, fileName: fileNameProp, onClose }): ReactNode => {
    const src = getImageSrc(image)
    const fileName = fileNameProp || deriveFileName(image)
    const isImage = IMAGE_MIMES.includes(image.mediaType)
    const [isDownloading, setIsDownloading] = useState(false)

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
    }, [onClose])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    const handleDownload = async () => {
        if (isDownloading) return
        setIsDownloading(true)

        const minDelay = new Promise((r) => setTimeout(r, 1000))

        try {
            const [, blob] = await Promise.all([
                minDelay,
                fetch(src).then((r) => r.blob())
            ])
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = fileName
            link.click()
            URL.revokeObjectURL(url)
        } catch {
            await minDelay
            const link = document.createElement('a')
            link.href = src
            link.download = fileName
            link.target = '_blank'
            link.click()
        } finally {
            setIsDownloading(false)
        }
    }

    return createPortal(
        <div
            className='fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-6'
            onClick={onClose}
        >
            <div
                className='flex max-h-[80vh] max-w-[90vw] flex-col rounded-xl border border-white/10 bg-[#0a0a0f]'
                onClick={(e) => e.stopPropagation()}
            >
                <div className='flex items-center justify-between border-b border-white/10 px-4 py-2.5'>
                    <span className='truncate text-sm text-gray-200'>
                        {fileName}
                    </span>
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className='rounded-md p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
                        >
                            {isDownloading ? (
                                <CircleNotchIcon className='h-4 w-4 animate-spin' />
                            ) : (
                                <DownloadSimpleIcon className='h-4 w-4' weight='bold' />
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className='rounded-md p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white'
                        >
                            <XIcon className='h-4 w-4' weight='bold' />
                        </button>
                    </div>
                </div>
                {isImage ? (
                    <div className='p-4'>
                        <img
                            src={src}
                            alt=''
                            className='max-h-[calc(80vh-4rem)] max-w-full rounded-lg object-contain'
                        />
                    </div>
                ) : (
                    <div className='flex min-w-[320px] flex-col items-center gap-1.5 px-16 py-14'>
                        <FileTextIcon className='h-10 w-10 text-gray-500' weight='duotone' />
                        <p className='text-sm text-gray-400'>
                            {t('playground.chatNoPreview')}
                        </p>
                    </div>
                )}
            </div>
        </div>,
        document.body
    )
}

export default ChatLightbox