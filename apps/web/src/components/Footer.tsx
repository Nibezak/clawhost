import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ClawHost. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <a
              href="mailto:support@clawhost.cloud"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
