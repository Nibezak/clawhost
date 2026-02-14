import type { OtpCodeEmailProps } from '@/ts/Interfaces'

import {
    Body,
    Container,
    Head,
    Html,
    Img,
    Preview,
    Section,
    Text
} from '@react-email/components'

import {
    darkModeStyles,
    main,
    container,
    body,
    paragraph,
    paragraphMuted,
    logoSection,
    logo
} from '@/emails/styles'

const codeStyle = {
    fontSize: '32px',
    fontWeight: '700' as const,
    letterSpacing: '8px',
    textAlign: 'center' as const,
    color: '#ef5350',
    padding: '16px 0',
    margin: '8px 0 20px',
    fontFamily: 'monospace'
}

const OtpCodeEmail = ({ code }: OtpCodeEmailProps) => {
    return (
        <Html>
            <Head>
                <meta name='color-scheme' content='light dark' />
                <meta name='supported-color-schemes' content='light dark' />
                <style>{darkModeStyles}</style>
            </Head>
            <Preview>Your ClawHost sign-in code: {code}</Preview>
            <Body style={main} className='email-body'>
                <Container style={container} className='email-container'>
                    <Section style={logoSection}>
                        <Img
                            src='https://cdn.clawhost.cloud/assets/clawhost-logo-dark.png'
                            width='140'
                            alt='ClawHost'
                            style={logo}
                            className='logo-light'
                        />
                        <Img
                            src='https://cdn.clawhost.cloud/assets/clawhost-logo-light.png'
                            width='140'
                            alt='ClawHost'
                            style={{ ...logo, display: 'none' }}
                            className='logo-dark'
                        />
                    </Section>
                    <Section style={body}>
                        <Text style={paragraph} className='email-text'>
                            Your sign-in code is:
                        </Text>
                        <Text style={codeStyle}>{code}</Text>
                        <Text style={paragraph} className='email-text'>
                            This code expires in 10 minutes.
                        </Text>
                        <Text
                            style={paragraphMuted}
                            className='email-text-muted'
                        >
                            If you didn't request this code, you can safely
                            ignore this email.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    )
}

export default OtpCodeEmail