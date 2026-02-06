import type { MagicLinkEmailProps } from '../ts/Interfaces'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import {
  darkModeStyles,
  main,
  container,
  heading,
  buttonContainer,
  body,
  paragraph,
  paragraphMuted,
  button,
  logoSection,
  logo,
} from './styles'

export const MagicLinkEmail = ({ magicLink }: MagicLinkEmailProps) => {
  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style>{darkModeStyles}</style>
      </Head>
      <Preview>Sign in to ClawHost</Preview>
      <Body style={main} className="email-body">
        <Container style={container} className="email-container">
          <Section style={logoSection}>
            <Img
              src="https://cdn.clawhost.cloud/assets/clawhost-logo-dark.png"
              width="140"
              alt="ClawHost"
              style={logo}
              className="logo-light"
            />
            <Img
              src="https://cdn.clawhost.cloud/assets/clawhost-logo-light.png"
              width="140"
              alt="ClawHost"
              style={{ ...logo, display: 'none' }}
              className="logo-dark"
            />
          </Section>
          <Section style={body}>
            <Text style={paragraph} className="email-text">
              Click the button below to sign in to your ClawHost account. This link will expire in 1 hour.
            </Text>
            <Section style={buttonContainer}>
            <Button style={button} href={magicLink}>
              Sign in to ClawHost
            </Button>
            </Section>
            <Text style={paragraphMuted} className="email-text-muted">
              If you didn't request this email, you can safely ignore it.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default MagicLinkEmail
