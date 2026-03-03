import type { FC, ReactNode } from 'react'
import type { ChangelogEmailProps } from '@/ts/Interfaces'

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

const dateStyle = {
    fontSize: '13px',
    color: '#8898aa',
    margin: '0 0 8px',
    textAlign: 'center' as const
}

const releaseTitle = {
    fontSize: '20px',
    fontWeight: '700' as const,
    color: '#1a1a1a',
    margin: '0 0 12px',
    textAlign: 'center' as const
}

const featureList = {
    margin: '0 0 24px',
    padding: '0'
}

const featureItem = {
    fontSize: '13px',
    lineHeight: '1.8',
    color: '#3c3c3c',
    margin: '0',
    padding: '4px 0',
    textAlign: 'left' as const
}

const secondaryButton = {
    ...button,
    background: 'none',
    backgroundColor: '#f4f4f5',
    color: '#18181b',
    marginBottom: '0'
}

const gifSection = {
    textAlign: 'center' as const,
    margin: '0 0 20px'
}

const gifStyle = {
    margin: '0 auto',
    borderRadius: '12px',
    maxWidth: '100%'
}

const ChangelogEmail: FC<ChangelogEmailProps> = ({
    title,
    description,
    features,
    date
}): ReactNode => {
    return (
        <Html>
            <Preview>
                {t('emails.changelogPreview', { title: title || '' })}
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
                            {t('emails.changelogHeading')}
                        </Text>

                        <Section style={gifSection}>
                            <Img
                                src={CDN_ASSETS.CHANGELOG_GIF}
                                width='320'
                                alt=''
                                style={gifStyle}
                            />
                        </Section>

                        <Text style={dateStyle}>{date}</Text>

                        <Text style={releaseTitle}>{title}</Text>

                        <Text style={paragraph}>{description}</Text>

                        <div style={featureList}>
                            {(features || []).map((feature, index) => (
                                <Text key={index} style={featureItem}>
                                    ✓ {feature}
                                </Text>
                            ))}
                        </div>

                        <Section style={buttonContainer}>
                            <Button
                                href='https://clawhost.cloud/changelog'
                                style={button}
                            >
                                {t('emails.changelogButton')}
                            </Button>
                        </Section>

                        <Section
                            style={{ ...buttonContainer, marginTop: '12px' }}
                        >
                            <Button
                                href='https://clawhost.cloud'
                                style={secondaryButton}
                            >
                                {t('emails.changelogVisitButton')}
                            </Button>
                        </Section>

                        <Text style={paragraphMuted}>
                            {t('emails.changelogFooter')}
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    )
}

export default ChangelogEmail