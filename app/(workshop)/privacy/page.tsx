import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Notice — AI Value Sandbox',
  description: 'Privacy Notice for AI Value Sandbox and ainavsystem.com, operated by SafeHaven LLC.',
  alternates: { canonical: 'https://www.ainavsystem.com/privacy/' },
}

const EFFECTIVE_DATE = 'September 2026'
const C = { bg: '#080808', accent: '#C2410C', white: '#F5F1EA', muted: '#A39C90', body: '#D8D2C6', border: 'rgba(245,241,234,0.12)' }

export default function PrivacyPage() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <div style={{ padding: '20px 24px' }}>
        <Link href="/" style={{ color: C.white, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
          &larr; Back to the workshop
        </Link>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 96px' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 16px' }}>
          Legal
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', fontWeight: 900, color: C.white, margin: '0 0 8px', lineHeight: 1.1 }}>
          Privacy Notice
        </h1>
        <p style={{ fontSize: 14, color: C.muted, margin: '0 0 40px' }}>
          Effective {EFFECTIVE_DATE}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, fontSize: 16, color: C.body, lineHeight: 1.75 }}>
          <section>
            <h2 style={h2}>Who we are</h2>
            <p>
              This notice explains how SafeHaven LLC (trading as SafeHaven AI), Doha, Qatar,
              handles personal data on ainavsystem.com and through the AI Value Sandbox workshop.
            </p>
          </section>

          <section>
            <h2 style={h2}>The free assessment</h2>
            <p>
              The AI Readiness Assessment does not ask for your name, email, phone number, or any
              other personal information. Your answers and score are calculated in your browser
              and are not sent to or stored on our servers.
            </p>
          </section>

          <section>
            <h2 style={h2}>Reserving a workshop seat</h2>
            <p>
              Reservations are made by messaging Allan directly on WhatsApp. Any personal
              information you share there — such as your name, business, and payment
              arrangements — is exchanged directly with Allan over WhatsApp, and is subject to
              WhatsApp&apos;s own privacy policy in addition to this notice. We do not collect or
              store this information anywhere else on this site.
            </p>
          </section>

          <section>
            <h2 style={h2}>Analytics and cookies</h2>
            <p>This site uses:</p>
            <ul style={{ margin: '8px 0 0', paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li><strong>Google Analytics</strong> — aggregate traffic and usage data, using cookies.</li>
              <li><strong>Microsoft Clarity</strong> — where enabled, records anonymised on-site behaviour (such as clicks and scrolling) to help us improve the site.</li>
            </ul>
            <p style={{ marginTop: 12 }}>
              Neither tool is used to identify you personally. You can block these cookies through
              your browser settings at any time.
            </p>
          </section>

          <section>
            <h2 style={h2}>Your rights</h2>
            <p>
              You can ask us what personal data we hold about you, request a correction, or ask us
              to delete it, by emailing{' '}
              <a href="mailto:allan@safehavenai.world" style={link}>allan@safehavenai.world</a>.
              We&apos;ll respond as soon as we reasonably can.
            </p>
          </section>

          <section>
            <h2 style={h2}>Changes to this notice</h2>
            <p>
              We may update this notice from time to time. The effective date above reflects the
              most recent version.
            </p>
          </section>

          <section>
            <h2 style={h2}>Contact</h2>
            <p>
              Questions about this notice: <a href="mailto:allan@safehavenai.world" style={link}>allan@safehavenai.world</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

const h2: React.CSSProperties = { fontSize: 20, fontWeight: 700, color: C.white, margin: '0 0 10px' }
const link: React.CSSProperties = { color: C.accent, fontWeight: 600, textDecoration: 'underline' }
