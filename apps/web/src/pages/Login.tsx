import type { FC, ReactNode } from 'react'

import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { isSignInWithEmailLink } from 'firebase/auth'
import { t } from '@openclaw/i18n'
import { useAuth } from '@/lib/auth'
import { auth } from '@/lib/firebase'
import { useUIStore } from '@/lib/store'
import ROUTES from '@/lib/routes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Logo from '@/components/Logo'
import PageBackground from '@/components/PageBackground'
import PageTitle from '@/components/PageTitle'
import { Envelope, CircleNotch } from '@phosphor-icons/react'

const COOLDOWN_KEY = 'otpSentAt'
const COOLDOWN_DURATION = 60

const getRemainingCooldown = (): number => {
    const sentAt = localStorage.getItem(COOLDOWN_KEY)
    if (!sentAt) return 0
    const elapsed = Math.floor((Date.now() - Number(sentAt)) / 1000)
    return Math.max(0, COOLDOWN_DURATION - elapsed)
}

const Login: FC = (): ReactNode => {
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const [verifyingEmail, setVerifyingEmail] = useState<string | null>(null)
    const [cooldown, setCooldown] = useState(getRemainingCooldown)
    const { user, loading: authLoading, sendOtp, verifyOtp } = useAuth()
    const { showToast } = useUIStore()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const planParam = searchParams.get('plan')
    const deployParam = searchParams.get('deploy')
    const providerParam = searchParams.get('provider')

    const getRedirectUrl = () => {
        if (planParam) {
            const providerSuffix = providerParam
                ? `&provider=${providerParam}`
                : ''
            return `${ROUTES.CLAWS}?plan=${planParam}${providerSuffix}`
        }
        if (deployParam) return `${ROUTES.CLAWS}?deploy=true`
        return ROUTES.CLAWS
    }

    useEffect(() => {
        if (user) {
            navigate(getRedirectUrl())
        }
    }, [user, navigate])

    useEffect(() => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            const storedEmail = window.localStorage.getItem('emailForSignIn')
            const storedPlan = window.localStorage.getItem('planForSignIn')
            const redirectUrl = storedPlan
                ? `${ROUTES.CLAWS}?plan=${storedPlan}`
                : ROUTES.CLAWS

            if (storedEmail) {
                setLoading(true)
                setVerifyingEmail(storedEmail)
                verifyOtp(storedEmail)
                    .then(() => {
                        window.localStorage.removeItem('planForSignIn')
                        showToast(t('auth.welcomeBack'), 'success')
                        navigate(redirectUrl)
                    })
                    .catch((err) => showToast(err.message, 'error'))
                    .finally(() => {
                        setLoading(false)
                        setVerifyingEmail(null)
                    })
            } else {
                const inputEmail = window.prompt(
                    t('auth.enterEmailForConfirmation')
                )
                if (inputEmail) {
                    setLoading(true)
                    setVerifyingEmail(inputEmail)
                    verifyOtp(inputEmail)
                        .then(() => {
                            window.localStorage.removeItem('planForSignIn')
                            showToast(t('auth.welcomeBack'), 'success')
                            navigate(redirectUrl)
                        })
                        .catch((err) => showToast(err.message, 'error'))
                        .finally(() => {
                            setLoading(false)
                            setVerifyingEmail(null)
                        })
                }
            }
        }
    }, [verifyOtp, navigate, showToast])

    useEffect(() => {
        if (cooldown <= 0) return
        const interval = setInterval(() => {
            setCooldown(getRemainingCooldown())
        }, 1000)
        return () => clearInterval(interval)
    }, [cooldown])

    const startCooldown = useCallback(() => {
        localStorage.setItem(COOLDOWN_KEY, String(Date.now()))
        setCooldown(COOLDOWN_DURATION)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (planParam) {
                window.localStorage.setItem('planForSignIn', planParam)
            }
            await sendOtp(email)
            startCooldown()
            setSent(true)
        } catch (err: any) {
            showToast(err.message, 'error')
        } finally {
            setLoading(false)
        }
    }

    if (authLoading) {
        return (
            <div className='relative flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4 text-white'>
                <PageBackground />
                <CircleNotch className='h-8 w-8 animate-spin text-white/50' />
            </div>
        )
    }

    if (loading && verifyingEmail) {
        return (
            <div className='relative flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4 text-white'>
                <PageTitle title={t('auth.signingIn')} />
                <PageBackground />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className='relative w-full max-w-md rounded-xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm'
                >
                    <div className='text-center'>
                        <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/5'>
                            <CircleNotch className='h-8 w-8 animate-spin text-[#ef5350]' />
                        </div>
                        <h1 className='font-clash mb-2 text-2xl font-bold'>
                            {t('auth.signingYouIn')}
                        </h1>
                        <p className='text-gray-400'>
                            {t('auth.loggingInAs')}{' '}
                            <span className='font-medium text-white'>
                                {verifyingEmail}
                            </span>
                        </p>
                    </div>
                </motion.div>
            </div>
        )
    }

    if (sent) {
        return (
            <div className='relative flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4 text-white'>
                <PageTitle title={t('auth.checkYourEmail')} />
                <PageBackground />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className='relative w-full max-w-md rounded-xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm'
                >
                    <div className='text-center'>
                        <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/5'>
                            <Envelope className='h-8 w-8 text-[#ef5350]' />
                        </div>
                        <h1 className='font-clash mb-2 text-2xl font-bold'>
                            {t('auth.checkYourEmailHeading')}
                        </h1>
                        <p className='mb-4 text-gray-400'>
                            {t('auth.sentLoginLink')}{' '}
                            <span className='font-medium text-white'>
                                {email}
                            </span>
                        </p>
                        <p className='text-sm text-gray-500'>
                            {t('auth.clickLinkToSignIn')}
                        </p>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className='relative flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4 text-white'>
            <PageTitle
                title={t('auth.signIn')}
                description={t('auth.signInDescription')}
            />
            <PageBackground />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='relative w-full max-w-md'
            >
                <div className='mb-8 flex flex-col items-center'>
                    <div className='mb-6'>
                        <Logo />
                    </div>
                    <p className='text-gray-400'>
                        {t('auth.signInToDeployOpenClaw')}
                    </p>
                </div>

                <div className='rounded-xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm'>
                    <form onSubmit={handleSubmit} className='space-y-5'>
                        <div className='space-y-2'>
                            <Label htmlFor='email' className='text-gray-300'>
                                {t('auth.emailAddress')}
                            </Label>
                            <Input
                                type='email'
                                id='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('auth.emailPlaceholder')}
                                required
                                className='h-11 border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-[#ef5350]/50 focus:ring-[#ef5350]/20'
                            />
                        </div>

                        <Button
                            type='submit'
                            size='lg'
                            className='w-full gap-2 border-0 bg-gradient-to-r from-[#ef5350] to-[#c62828] text-white hover:opacity-90'
                            disabled={loading || cooldown > 0}
                        >
                            {loading ? (
                                <>
                                    <CircleNotch className='h-4 w-4 animate-spin' />
                                    {t('auth.sending')}
                                </>
                            ) : cooldown > 0 ? (
                                t('auth.resendIn', {
                                    seconds: String(cooldown)
                                })
                            ) : (
                                t('auth.continueWithEmail')
                            )}
                        </Button>

                        <p className='text-center text-sm text-gray-500'>
                            {t('auth.magicLinkDescription')}
                        </p>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

export default Login