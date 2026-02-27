import type { UseTextToSpeechReturn } from '@/ts/Interfaces'

import { useState, useCallback, useRef, useEffect } from 'react'
import { t } from '@openclaw/i18n'
import { getCachedToken } from '@/lib/firebase'
import useUIStore from '@/lib/store/useUIStore'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const useTextToSpeech = (): UseTextToSpeechReturn => {
    const { showToast } = useUIStore()
    const [activeMessageId, setActiveMessageId] = useState<string | null>(null)
    const [loadingMessageId, setLoadingMessageId] = useState<string | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const abortRef = useRef<AbortController | null>(null)
    const cacheRef = useRef<Map<string, string>>(new Map())
    const outputDeviceIdRef = useRef<string | null>(null)

    const stopPlayback = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
            audioRef.current = null
        }
        if (abortRef.current) {
            abortRef.current.abort()
            abortRef.current = null
        }
    }, [])

    const stop = useCallback(() => {
        stopPlayback()
        setActiveMessageId(null)
        setLoadingMessageId(null)
    }, [stopPlayback])

    const setOutputDeviceId = useCallback((deviceId: string | null) => {
        outputDeviceIdRef.current = deviceId
    }, [])

    const playFromUrl = useCallback((messageId: string, url: string) => {
        const audio = new Audio(url)
        audioRef.current = audio

        if (outputDeviceIdRef.current && 'setSinkId' in audio) {
            // @ts-ignore
            audio.setSinkId(outputDeviceIdRef.current)
        }

        audio.onended = () => {
            audioRef.current = null
            setActiveMessageId(null)
        }

        audio.onerror = () => {
            audioRef.current = null
            setActiveMessageId(null)
        }

        setLoadingMessageId(null)
        setActiveMessageId(messageId)
        audio.play()
    }, [])

    const speak = useCallback(
        async (messageId: string, text: string) => {
            stopPlayback()
            setActiveMessageId(null)

            const cached = cacheRef.current.get(messageId)
            if (cached) {
                playFromUrl(messageId, cached)
                return
            }

            setLoadingMessageId(messageId)

            try {
                const token = await getCachedToken()
                const controller = new AbortController()
                abortRef.current = controller

                const res = await fetch(`${BASE_URL}/ai/tts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify({ text }),
                    signal: controller.signal
                })

                if (!res.ok) {
                    setLoadingMessageId(null)
                    showToast(t('playground.chatSpeechFailed'), 'error')
                    return
                }

                const blob = await res.blob()
                const url = URL.createObjectURL(blob)
                cacheRef.current.set(messageId, url)

                playFromUrl(messageId, url)
            } catch (err) {
                if (err instanceof DOMException && err.name === 'AbortError') {
                    setLoadingMessageId(null)
                    return
                }
                stopPlayback()
                setActiveMessageId(null)
                setLoadingMessageId(null)
                showToast(t('playground.chatSpeechFailed'), 'error')
            }
        },
        [stopPlayback, playFromUrl, showToast]
    )

    useEffect(() => {
        return () => {
            stopPlayback()
            cacheRef.current.forEach((url) => URL.revokeObjectURL(url))
            cacheRef.current.clear()
        }
    }, [stopPlayback])

    return { activeMessageId, loadingMessageId, speak, stop, setOutputDeviceId }
}

export default useTextToSpeech