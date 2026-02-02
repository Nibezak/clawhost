import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface MagicLinkEmailProps {
  magicLink: string
}

export const MagicLinkEmail = ({ magicLink }: MagicLinkEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Sign in to OpenClaw</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Sign in to OpenClaw</Heading>
          <Section style={body}>
            <Text style={paragraph}>
              Click the button below to sign in to your OpenClaw account. This link will expire in 1 hour.
            </Text>
            <Button style={button} href={magicLink}>
              Sign in to OpenClaw
            </Button>
            <Text style={paragraph}>
              If you didn't request this email, you can safely ignore it.
            </Text>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            If the button doesn't work, copy and paste this link into your browser:
          </Text>
          <Link href={magicLink} style={link}>
            {magicLink}
          </Link>
        </Container>
      </Body>
    </Html>
  )
}

export default MagicLinkEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  marginBottom: '64px',
  borderRadius: '8px',
}

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '600',
  color: '#1a1a1a',
  padding: '0 0 20px',
  textAlign: 'center' as const,
}

const body = {
  padding: '0 20px',
}

const paragraph = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#3c3c3c',
  margin: '0 0 20px',
}

const button = {
  backgroundColor: '#000000',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 24px',
  margin: '20px auto',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '1.5',
}

const link = {
  color: '#8898aa',
  fontSize: '12px',
  wordBreak: 'break-all' as const,
}
