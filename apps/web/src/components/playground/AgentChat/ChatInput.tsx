import type { FC, ReactNode, KeyboardEvent } from 'react'
import type { ChatInputProps } from '@/ts/Interfaces'

import { useState, useRef, useCallback } from 'react'
import { t } from '@openclaw/i18n'
import { PaperPlaneRight, Stop } from '@phosphor-icons/react'

const ChatInput: FC<ChatInputProps> = ({
    isConnected,
    isStreaming,
    onSend,
    onAbort
}): ReactNode => {
    const [input, setInput] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const handleSend = useCallback(() => {
        if (!input.trim() || isStreaming) return
        onSend(input)
        setInput('')
        inputRef.current?.focus()
    }, [input, isStreaming, onSend])

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
            }
        },
        [handleSend]
    )

    return (
        <div className='border-t border-white/10 p-3'>
            <div className='flex items-center gap-2'>
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                        isConnected
                            ? t('playground.chatInputPlaceholder')
                            : t('playground.chatInputDisabled')
                    }
                    disabled={!isConnected}
                    className='flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-[#ef5350]/50 disabled:cursor-not-allowed disabled:text-gray-500'
                />
                {isStreaming ? (
                    <button
                        onClick={onAbort}
                        className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-600 text-white transition-colors hover:bg-yellow-700'
                    >
                        <Stop className='h-4 w-4' weight='bold' />
                    </button>
                ) : (
                    <button
                        onClick={handleSend}
                        disabled={!isConnected || !input.trim()}
                        className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ef5350] text-white transition-colors hover:bg-[#e53935] disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        <PaperPlaneRight
                            className='h-4 w-4'
                            weight='bold'
                        />
                    </button>
                )}
            </div>
        </div>
    )
}

export default ChatInput