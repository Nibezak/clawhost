import type { FC, ReactNode } from 'react'

import { t } from '@openclaw/i18n'

import {
    Body,
    Button,
    Container,
    Html,
    Img,
    Preview,
    Section,
    Text
} from '@react-email/components'

import CDN_ASSETS from '@/lib/cdn'
import {
    main,
    container,
    body,
    heading,
    paragraph,
    paragraphMuted,
    button,
    buttonContainer,
    logoSection,
    logo
} from '@/emails/styles'

const DiagnosticsEmail: FC = (): ReactNode => {
    return (
        <Html>
            <Preview>
                {t('emails.features.diagnostics.preview')}
            </Preview>

            <Body style={main}>
                <Container style={container}>
                    <Section style={logoSection}>
                        <Img
                            src={CDN_ASSETS.LOGO}
                            width='140'
                            alt='ClawHost'
                            style={logo}
                        />
                    </Section>

                    <Section style={body}>
                        <Text style={heading}>
                            {t('emails.features.diagnostics.heading')}
                        </Text>

                        <Text style={paragraph}>
                            {t('emails.features.diagnostics.description')}
                        </Text>

                        <Section style={buttonContainer}>
                            <Button
                                href='https://clawhost.cloud'
                                style={button}
                            >
                                {t('emails.features.diagnostics.cta')}
                            </Button>
                        </Section>

                        <Text style={paragraphMuted}>
                            {t('emails.featureFooter')}
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    )
}

export default DiagnosticsEmail