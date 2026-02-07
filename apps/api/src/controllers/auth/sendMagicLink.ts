import type { Context } from 'hono'

import { auth } from '../../services/firebase'
import { resend, FROM_EMAIL } from '../../services/resend'
import MagicLinkEmail from '../../emails/MagicLinkEmail'

const sendMagicLink = async (c: Context) => {
  try {
    const { email, redirectUrl } = await c.req.json<{
      email: string
      redirectUrl: string
    }>()

    if (!email) {
      return c.json({ error: 'Email is required' }, 400)
    }

    if (!redirectUrl) {
      return c.json({ error: 'Redirect URL is required' }, 400)
    }

    // Generate the magic link using Firebase Admin SDK
    const actionCodeSettings = {
      url: redirectUrl,
      handleCodeInApp: true,
    }

    const magicLink = await auth.generateSignInWithEmailLink(email, actionCodeSettings)

    // Send the email via Resend
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Sign in to ClawHost',
      react: MagicLinkEmail({ magicLink }),
    })

    if (error) {
      console.error('Resend error:', error)
      return c.json({ error: 'Failed to send email' }, 500)
    }

    return c.json({ success: true })
  } catch (err) {
    console.error('Send magic link error:', err)
    return c.json({ error: err instanceof Error ? err.message : 'Failed to send magic link' }, 500)
  }
}

export default sendMagicLink
