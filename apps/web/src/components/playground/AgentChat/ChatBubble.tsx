import type { FC, ReactNode } from 'react'
import type { ChatBubbleProps, ChatImageSource } from '@/ts/Interfaces'

import { useState } from 'react'
import { t } from '@openclaw/i18n'
import { StopIcon, WarningIcon, FileTextIcon, DownloadSimpleIcon } from '@phosphor-icons/react'
import ChatMarkdown from '@/components/playground/AgentChat/ChatMarkdown'
import ChatLightbox from '@/components/playground/AgentChat/ChatLightbox'

const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']

const FILE_EXT_TO_MIME: Record<string, string> = {
    pdf: 'application/pdf',
    txt: 'text/plain',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp'
}

const FILENAME_PATTERN = /^(\S+\.\w{1,5})(,\s*\S+\.\w{1,5})*$/

const getImageSrc = (img: ChatImageSource): string => {
    if (img.type === 'url') return img.data
    return `data:${img.mediaType};base64,${img.data}`
}

const isImageAttachment = (img: ChatImageSource): boolean =>
    IMAGE_MIMES.includes(img.mediaType) && !!img.data

const ChatBubble: FC<ChatBubbleProps> = ({ message }): ReactNode => {
    const isUser = message.role === 'user'
    const [lightboxImage, setLightboxImage] = useState<ChatImageSource | null>(null)
    const [lightboxFileName, setLightboxFileName] = useState<string | undefined>(undefined)

    const openLightbox = (image: ChatImageSource, fileName?: string) => {
        setLightboxImage(image)
        setLightboxFileName(fileName)
    }

    const hasAttachments = message.images && message.images.length > 0
    const hasNonImageAttachments = message.images?.some((img) => !isImageAttachment(img))
    const contentLooksLikeFileName = isUser && FILENAME_PATTERN.test(message.content.trim())
    const showAsFileCard = contentLooksLikeFileName && (!hasAttachments || hasNonImageAttachments)

    const renderFileCard = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase() || ''
        const mime = FILE_EXT_TO_MIME[ext] || 'application/octet-stream'
        const fakeSource: ChatImageSource = { type: 'base64', mediaType: mime, data: '' }

        return (
            <button
                onClick={() => openLightbox(fakeSource, fileName)}
                className='flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 transition-colors hover:bg-white/10'
            >
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-white/10'>
                    <FileTextIcon className='h-4 w-4 text-gray-400' weight='duotone' />
                </div>
                <div className='flex flex-col items-start'>
                    <span className='text-xs font-medium text-gray-200'>
                        {fileName}
                    </span>
                    <span className='text-[10px] text-gray-500'>
                        {ext.toUpperCase()}
                    </span>
                </div>
                <DownloadSimpleIcon className='h-3.5 w-3.5 text-gray-500' weight='bold' />
            </button>
        )
    }

    const renderAttachments = (images: ChatImageSource[]) => (
        <div className='mb-2 flex flex-wrap gap-2'>
            {images.map((img, idx) => {
                if (!isImageAttachment(img)) {
                    const ext = img.mediaType.split('/')[1]?.toUpperCase() || 'FILE'
                    const name = img.filename || (showAsFileCard ? message.content.trim() : `file.${ext.toLowerCase()}`)
                    return (
                        <button
                            key={idx}
                            onClick={() => openLightbox(img, name)}
                            className='flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 transition-colors hover:bg-white/10'
                        >
                            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-white/10'>
                                <FileTextIcon className='h-4 w-4 text-gray-400' weight='duotone' />
                            </div>
                            <div className='flex flex-col items-start'>
                                <span className='text-xs font-medium text-gray-200'>
                                    {name}
                                </span>
                                <span className='text-[10px] text-gray-500'>
                                    {ext}
                                </span>
                            </div>
                            <DownloadSimpleIcon className='h-3.5 w-3.5 text-gray-500' weight='bold' />
                        </button>
                    )
                }

                return (
                    <button
                        key={idx}
                        onClick={() => openLightbox(img)}
                        className='overflow-hidden rounded-lg'
                    >
                        <img
                            src={getImageSrc(img)}
                            alt=''
                            className='max-h-48 rounded-lg transition-opacity hover:opacity-80'
                        />
                    </button>
                )
            })}
        </div>
    )

    const formattedTime = message.timestamp
        ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : null

    if (isUser) {
        return (
            <>
                <div className='flex flex-col items-end gap-1'>
                    <div className='max-w-[85%] rounded-2xl rounded-br-md bg-[#ef5350]/15 px-3.5 py-2.5'>
                        {hasAttachments && renderAttachments(message.images!)}
                        {showAsFileCard && !hasNonImageAttachments && (
                            <div className='mb-2 flex flex-wrap gap-2'>
                                {message.content.trim().split(/,\s*/).map((name, idx) => (
                                    <div key={idx}>{renderFileCard(name)}</div>
                                ))}
                            </div>
                        )}
                        {!showAsFileCard && (
                            <p className='whitespace-pre-wrap text-sm text-gray-200'>
                                {message.content}
                            </p>
                        )}
                    </div>
                    {formattedTime && (
                        <span className='px-1 text-[10px] text-gray-600'>{formattedTime}</span>
                    )}
                </div>
                {lightboxImage && (
                    <ChatLightbox image={lightboxImage} fileName={lightboxFileName} onClose={() => setLightboxImage(null)} />
                )}
            </>
        )
    }

    return (
        <>
            <div className='flex flex-col items-start gap-1'>
                <div className='min-w-0 max-w-[85%] rounded-2xl rounded-bl-md bg-white/5 px-3.5 py-2.5'>
                    {hasAttachments && renderAttachments(message.images!)}
                    <div className='min-w-0 text-sm text-gray-300'>
                        <ChatMarkdown content={message.content} />
                        {message.status === 'streaming' && (
                            <span className='ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-gray-400' />
                        )}
                    </div>
                    {message.status === 'error' && (
                        <div className='mt-2 flex items-center gap-1.5'>
                            <WarningIcon className='h-3 w-3 text-red-400' />
                            <span className='text-[11px] text-red-400'>
                                {t('playground.chatErrorMessage')}
                            </span>
                        </div>
                    )}
                    {message.status === 'aborted' && (
                        <div className='mt-2 flex items-center gap-1.5'>
                            <StopIcon className='h-3 w-3 text-yellow-500' />
                            <span className='text-[11px] text-yellow-500'>
                                {t('playground.chatAbortedMessage')}
                            </span>
                        </div>
                    )}
                </div>
                {formattedTime && (
                    <span className='px-1 text-[10px] text-gray-600'>{formattedTime}</span>
                )}
            </div>
            {lightboxImage && (
                <ChatLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
            )}
        </>
    )
}

export default ChatBubble