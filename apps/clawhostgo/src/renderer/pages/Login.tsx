import type { FC, ReactNode } from 'react'

import { useState, useEffect, useRef, useCallback } from 'react'
import { t } from '@openclaw/i18n'
import { useAuth } from '@/lib/auth'
import { useUIStore } from '@/lib/store'

const COOLDOWN_DURATION = 60
const CODE_LENGTH = 6

const Login: FC = (): ReactNode => {
    const { sendOtp, verifyOtp } = useAuth()
    const { showToast } = useUIStore()
    const [email, setEmail] = useState('')
    const [step, setStep] = useState<'email' | 'code'>('email')
    const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''))
    const [loading, setLoading] = useState(false)
    const [cooldown, setCooldown] = useState(0)
    const [codeError, setCodeError] = useState(false)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        if (cooldown <= 0) return
        const interval = setInterval(() => {
            setCooldown((prev) => Math.max(0, prev - 1))
        }, 1000)
        return () => clearInterval(interval)
    }, [cooldown])

    const handleSendOtp = useCallback(async () => {
        if (!email.trim() || loading || cooldown > 0) return
        setLoading(true)
        try {
            await sendOtp(email.trim())
            setCooldown(COOLDOWN_DURATION)
            setStep('code')
            setCode(Array(CODE_LENGTH).fill(''))
            setCodeError(false)
            setTimeout(() => inputRefs.current[0]?.focus(), 100)
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : t('errors.somethingWentWrong')
            showToast(message, 'error')
        } finally {
            setLoading(false)
        }
    }, [email, loading, cooldown, sendOtp, showToast])

    const handleVerifyOtp = useCallback(
        async (fullCode: string) => {
            if (loading) return
            setLoading(true)
            setCodeError(false)
            try {
                await verifyOtp(email.trim(), fullCode)
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : t('mobile.invalidCode')
                showToast(message, 'error')
                setCodeError(true)
                setCode(Array(CODE_LENGTH).fill(''))
                inputRefs.current[0]?.focus()
            } finally {
                setLoading(false)
            }
        },
        [email, loading, verifyOtp, showToast]
    )

    const handleCodeChange = useCallback(
        (value: string, index: number) => {
            if (!/^\d*$/.test(value)) return

            const newCode = [...code]

            if (value.length > 1) {
                const digits = value.split('').slice(0, CODE_LENGTH)
                digits.forEach((digit, i) => {
                    if (index + i < CODE_LENGTH) {
                        newCode[index + i] = digit
                    }
                })
                setCode(newCode)
                setCodeError(false)
                const nextIndex = Math.min(
                    index + digits.length,
                    CODE_LENGTH - 1
                )
                inputRefs.current[nextIndex]?.focus()

                const fullCode = newCode.join('')
                if (
                    fullCode.length === CODE_LENGTH &&
                    newCode.every((d) => d !== '')
                ) {
                    handleVerifyOtp(fullCode)
                }
                return
            }

            newCode[index] = value
            setCode(newCode)
            setCodeError(false)

            if (value && index < CODE_LENGTH - 1) {
                inputRefs.current[index + 1]?.focus()
            }

            const fullCode = newCode.join('')
            if (
                fullCode.length === CODE_LENGTH &&
                newCode.every((d) => d !== '')
            ) {
                handleVerifyOtp(fullCode)
            }
        },
        [code, handleVerifyOtp]
    )

    const handleCodeKeyDown = useCallback(
        (key: string, index: number) => {
            if (key === 'Backspace' && !code[index] && index > 0) {
                const newCode = [...code]
                newCode[index - 1] = ''
                setCode(newCode)
                inputRefs.current[index - 1]?.focus()
            }
        },
        [code]
    )

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleSendOtp()
    }

    const handleChangeEmail = useCallback(() => {
        setStep('email')
        setCode(Array(CODE_LENGTH).fill(''))
        setCodeError(false)
    }, [])

    const handleResend = useCallback(async () => {
        if (cooldown > 0 || loading) return
        setLoading(true)
        try {
            await sendOtp(email.trim())
            setCooldown(COOLDOWN_DURATION)
            setCode(Array(CODE_LENGTH).fill(''))
            setCodeError(false)
            inputRefs.current[0]?.focus()
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : t('errors.somethingWentWrong')
            showToast(message, 'error')
        } finally {
            setLoading(false)
        }
    }, [cooldown, loading, email, sendOtp, showToast])

    return (
        <div className='relative flex h-screen items-center justify-center bg-[#0a0a0f] text-white'>
            <div className='landing-gradient pointer-events-none fixed inset-0' />
            <div className='landing-grid pointer-events-none fixed inset-0' />

            <div className='relative w-full max-w-md px-4'>
                <div className='mb-8 flex flex-col items-center'>
                    <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ef5350]/10'>
                        <svg
                            width='28'
                            height='28'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='#ef5350'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        >
                            <path d='M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4' />
                            <polyline points='10 17 15 12 10 7' />
                            <line x1='15' y1='12' x2='3' y2='12' />
                        </svg>
                    </div>
                    <h1 className='font-clash text-2xl font-bold'>
                        {t('mobile.signIn')}
                    </h1>
                    <p className='mt-1 text-sm text-gray-400'>
                        {t('mobile.signInDescription')}
                    </p>
                </div>

                {step === 'email' ? (
                    <div className='rounded-xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm'>
                        <form onSubmit={handleSubmit} className='space-y-5'>
                            <div className='space-y-2'>
                                <label
                                    htmlFor='email'
                                    className='text-sm text-gray-300'
                                >
                                    {t('mobile.enterEmail')}
                                </label>
                                <input
                                    type='email'
                                    id='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('mobile.emailPlaceholder')}
                                    required
                                    className='h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-white placeholder:text-gray-500 focus:border-[#ef5350]/50 focus:outline-none focus:ring-1 focus:ring-[#ef5350]/20'
                                />
                            </div>

                            <button
                                type='submit'
                                disabled={
                                    loading || cooldown > 0 || !email.trim()
                                }
                                className='flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#ef5350] to-[#c62828] text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50'
                            >
                                {loading ? (
                                    <>
                                        <svg
                                            className='h-4 w-4 animate-spin'
                                            viewBox='0 0 24 24'
                                            fill='none'
                                        >
                                            <circle
                                                cx='12'
                                                cy='12'
                                                r='10'
                                                stroke='currentColor'
                                                strokeWidth='3'
                                                className='opacity-25'
                                            />
                                            <path
                                                d='M4 12a8 8 0 018-8'
                                                stroke='currentColor'
                                                strokeWidth='3'
                                                strokeLinecap='round'
                                                className='opacity-75'
                                            />
                                        </svg>
                                        {t('mobile.sending')}
                                    </>
                                ) : cooldown > 0 ? (
                                    t('auth.resendIn', {
                                        seconds: String(cooldown)
                                    })
                                ) : (
                                    t('mobile.continueWithEmail')
                                )}
                            </button>

                            <p className='text-center text-sm text-gray-500'>
                                {t('mobile.otpDescription')}
                            </p>
                        </form>
                    </div>
                ) : (
                    <div className='rounded-xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm'>
                        <div className='text-center'>
                            <h2 className='font-clash mb-2 text-xl font-bold'>
                                {t('mobile.checkYourEmail')}
                            </h2>
                            <p className='mb-6 text-sm text-gray-400'>
                                {t('mobile.codeSentTo')}{' '}
                                <span className='font-medium text-white'>
                                    {email}
                                </span>
                            </p>
                        </div>

                        <div className='mb-6 flex justify-center gap-2'>
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(ref) => {
                                        inputRefs.current[index] = ref
                                    }}
                                    type='text'
                                    inputMode='numeric'
                                    maxLength={index === 0 ? CODE_LENGTH : 1}
                                    value={digit}
                                    onChange={(e) =>
                                        handleCodeChange(e.target.value, index)
                                    }
                                    onKeyDown={(e) =>
                                        handleCodeKeyDown(e.key, index)
                                    }
                                    disabled={loading}
                                    className={`font-clash h-12 w-11 rounded-lg border bg-white/5 text-center text-lg font-bold text-white focus:outline-none focus:ring-1 ${
                                        codeError
                                            ? 'border-red-500 focus:ring-red-500/20'
                                            : digit
                                              ? 'border-[#ef5350] focus:ring-[#ef5350]/20'
                                              : 'border-white/10 focus:border-[#ef5350]/50 focus:ring-[#ef5350]/20'
                                    }`}
                                />
                            ))}
                        </div>

                        {loading && (
                            <div className='mb-4 flex items-center justify-center gap-2'>
                                <svg
                                    className='h-4 w-4 animate-spin text-[#ef5350]'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                >
                                    <circle
                                        cx='12'
                                        cy='12'
                                        r='10'
                                        stroke='currentColor'
                                        strokeWidth='3'
                                        className='opacity-25'
                                    />
                                    <path
                                        d='M4 12a8 8 0 018-8'
                                        stroke='currentColor'
                                        strokeWidth='3'
                                        strokeLinecap='round'
                                        className='opacity-75'
                                    />
                                </svg>
                                <span className='text-sm text-gray-400'>
                                    {t('mobile.signingIn')}
                                </span>
                            </div>
                        )}

                        <div className='flex justify-between'>
                            <button
                                onClick={handleResend}
                                disabled={cooldown > 0 || loading}
                                className='text-sm text-[#ef5350] transition-opacity hover:opacity-80 disabled:text-gray-600'
                            >
                                {cooldown > 0
                                    ? t('mobile.resendIn', {
                                          seconds: String(cooldown)
                                      })
                                    : t('mobile.resendCode')}
                            </button>
                            <button
                                onClick={handleChangeEmail}
                                disabled={loading}
                                className='text-sm text-[#ef5350] transition-opacity hover:opacity-80 disabled:text-gray-600'
                            >
                                {t('mobile.changeEmail')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Login