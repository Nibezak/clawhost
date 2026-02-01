import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { isSignInWithEmailLink } from 'firebase/auth'
import { useAuth } from '../lib/auth'
import { auth } from '../lib/firebase'
import { useUIStore } from '@/lib/store'
import { ROUTES } from '@/lib/routes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/Logo'
import { PageBackground } from '@/components/PageBackground'
import { PageTitle } from '@/components/PageTitle'
import { Envelope, CircleNotch } from '@phosphor-icons/react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verifyingEmail, setVerifyingEmail] = useState<string | null>(null)
  const { user, sendOtp, verifyOtp } = useAuth()
  const { showToast } = useUIStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const planParam = searchParams.get('plan')

  const getRedirectUrl = () => {
    return planParam ? `${ROUTES.CLAWS}?plan=${planParam}` : ROUTES.CLAWS
  }

  useEffect(() => {
    if (user) {
      navigate(getRedirectUrl())
    }
  }, [user, navigate])

useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const storedEmail = window.localStorage.getItem('emailForSignIn')
      // Also get stored plan from localStorage (we store it when sending OTP)
      const storedPlan = window.localStorage.getItem('planForSignIn')
      const redirectUrl = storedPlan ? `${ROUTES.CLAWS}?plan=${storedPlan}` : ROUTES.CLAWS

      if (storedEmail) {
        setLoading(true)
        setVerifyingEmail(storedEmail)
        verifyOtp(storedEmail)
          .then(() => {
            window.localStorage.removeItem('planForSignIn')
            showToast('Welcome back.', 'success')
            navigate(redirectUrl)
          })
          .catch((err) => showToast(err.message, 'error'))
          .finally(() => {
            setLoading(false)
            setVerifyingEmail(null)
          })
      } else {
        const inputEmail = window.prompt('Please enter your email for confirmation')
        if (inputEmail) {
          setLoading(true)
          setVerifyingEmail(inputEmail)
          verifyOtp(inputEmail)
            .then(() => {
              window.localStorage.removeItem('planForSignIn')
              showToast('Welcome back.', 'success')
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

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Store plan in localStorage so we can retrieve it after email link click
      if (planParam) {
        window.localStorage.setItem('planForSignIn', planParam)
      }
      await sendOtp(email)
      setSent(true)
    } catch (err: any) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Show verifying state when coming back from email link
  if (loading && verifyingEmail) {
    return (
      <div className="relative min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
        <PageTitle title="Signing In" />
        <PageBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative max-w-md w-full p-8 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <CircleNotch className="w-8 h-8 text-[#ef5350] animate-spin" />
            </div>
            <h1 className="font-clash text-2xl font-bold mb-2">Signing you in</h1>
            <p className="text-gray-400">
              Logging in as <span className="text-white font-medium">{verifyingEmail}</span>
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  if (sent) {
    return (
      <div className="relative min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
        <PageTitle title="Check Your Email" />
        <PageBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative max-w-md w-full p-8 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Envelope className="w-8 h-8 text-[#ef5350]" />
            </div>
            <h1 className="font-clash text-2xl font-bold mb-2">Check your email</h1>
            <p className="text-gray-400 mb-4">
              We sent a login link to <span className="text-white font-medium">{email}</span>
            </p>
            <p className="text-gray-500 text-sm">
              Click the link in the email to sign in. You can close this tab.
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <PageTitle title="Sign In" />
      <PageBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative max-w-md w-full"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="mb-6">
            <Logo />
          </div>
          <p className="text-gray-400">Sign in to deploy OpenClaw</p>
        </div>

<div className="p-8 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email address</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#ef5350]/50 focus:ring-[#ef5350]/20"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#ef5350] to-[#c62828] hover:opacity-90 text-white border-0 gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircleNotch className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Continue with Email'
              )}
            </Button>

            <p className="text-gray-500 text-sm text-center">
              We'll send you a magic link to sign in. No password needed.
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
