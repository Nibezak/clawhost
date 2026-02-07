export const darkModeStyles = `
  :root {
    color-scheme: light dark;
  }
  a, img {
    -webkit-user-drag: none;
    user-drag: none;
    -webkit-user-select: none;
    user-select: none;
  }
  @media (prefers-color-scheme: dark) {
    .email-body {
      background-color: #0a0a0f !important;
      background-image: linear-gradient(rgba(239, 83, 80, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 83, 80, 0.05) 1px, transparent 1px) !important;
      background-size: 24px 24px !important;
    }
    .email-container {
      background-color: #1a1a1f !important;
      border-color: #2a2a2f !important;
    }
    .email-heading {
      color: #ffffff !important;
    }
    .email-text {
      color: #a0a0a0 !important;
    }
    .email-text-muted {
      color: #666666 !important;
    }
    .logo-light {
      display: none !important;
    }
    .logo-dark {
      display: block !important;
    }
  }
`

export const main = {
  backgroundColor: '#fdfdfd',
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
  fontFamily: 'Verdana, Geneva, sans-serif',
  padding: '40px 0',
}

export const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '48px 32px',
  paddingBottom: '48px',
  marginBottom: '64px',
  marginTop: '64px',
  borderRadius: '32px',
  maxWidth: '450px',
  border: '1px solid #e8e8e8'
}

export const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#1a1a1a',
  padding: '0 0 20px',
  textAlign: 'center' as const,
}

export const body = {
  padding: '0 20px',
}

export const paragraph = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#3c3c3c',
  margin: '0 0 20px',
  textAlign: 'center',
  marginTop: '4px'
}

export const paragraphMuted = {
  fontSize: '11px',
  lineHeight: '1.5',
  color: '#8898aa',
  margin: '0',
  textAlign: 'center'
}

export const buttonContainer = {
    textAlign: 'center'
}

export const button = {
  background: 'linear-gradient(to right, #ef5350, #c62828)',
  backgroundColor: '#ef5350',
  borderRadius: '9999px',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '14px 32px',
  width: 'auto',
  marginBottom: '20px',
}

export const logoSection = {
  textAlign: 'center' as const,
  marginBottom: '20px',
}

export const logo = {
  margin: '0 auto',
}