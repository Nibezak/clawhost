import type { UseTextToSpeechReturn } from '@/ts/Interfaces'

import { useState, useCallback, useRef, useEffect } from 'react'

const useTextToSpeech = (): UseTextToSpeechReturn => {
    const [activeMessageId, setActiveMessageId] = useState<string | null>(null)
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

    const stop = useCallback(() => {
        window.speechSynthesis.cancel()
        utteranceRef.current = null
        setActiveMessageId(null)
    }, [])

    const speak = useCallback(
        (messageId: string, text: string) => {
            stop()

            const utterance = new SpeechSynthesisUtterance(text)
            utteranceRef.current = utterance

            utterance.onend = () => {
                utteranceRef.current = null
                setActiveMessageId(null)
            }

            utterance.onerror = () => {
                utteranceRef.current = null
                setActiveMessageId(null)
            }

            setActiveMessageId(messageId)
            window.speechSynthesis.speak(utterance)
        },
        [stop]
    )

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel()
        }
    }, [])

    return { activeMessageId, speak, stop }
}

export default useTextToSpeech