const darkModeStyles = `
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

export default darkModeStyles