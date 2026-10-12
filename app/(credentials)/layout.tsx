import localFont from 'next/font/local'
import './credentials.css'

// Self-hosted (assets/fonts) so the record renders the same everywhere, with no third-party font request.
const display = localFont({
  variable: '--cr-display', display: 'swap',
  src: [
    { path: '../../assets/fonts/spectral-latin-300-normal.woff2', weight: '300', style: 'normal' },
    { path: '../../assets/fonts/spectral-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../assets/fonts/spectral-latin-400-italic.woff2', weight: '400', style: 'italic' },
  ],
})
const body = localFont({
  variable: '--cr-body', display: 'swap',
  src: [
    { path: '../../assets/fonts/hanken-grotesk-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../assets/fonts/hanken-grotesk-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../assets/fonts/hanken-grotesk-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
})

// Credential and verification pages: standalone, no site navigation.
export default function CredentialsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`cr-root ${display.variable} ${body.variable}`}>
      <div className="cr-wrap">
        <header className="cr-top">
          <a className="cr-brand" href="/">AI Value Sandbox <span>/ Credentials</span><small>operated by SafeHaven LLC</small></a>
          <a href="/verify">Verify a credential</a>
        </header>
        {children}
        <footer className="cr-foot">
          <span>AI Value Sandbox, operated by SafeHaven LLC</span>
          <a href="/">ainavsystem.com</a>
        </footer>
      </div>
    </div>
  )
}
