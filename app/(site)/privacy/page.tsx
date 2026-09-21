import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Notice',
  description: 'Privacy Notice for AI Value Sandbox and ainavsystem.com, operated by SafeHaven LLC.',
  alternates: { canonical: 'https://www.ainavsystem.com/privacy/' },
}

const EFFECTIVE_DATE = 'September 2026'

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px 96px' }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 12px' }}>
        Legal
      </p>
      <h1 style={{ fontSize: 36, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>
        Privacy Notice
      </h1>
      <p style={{ fontSize: 14, color: '#9ca3af', margin: '0 0 40px' }}>
        Effective {EFFECTIVE_DATE}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, fontSize: 16, color: '#374151', lineHeight: 1.75 }}>
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
          <h2 style={h2}>Booking a workshop seat</h2>
          <p>When you purchase a seat, we collect and store:</p>
          <ul style={{ margin: '8px 0 0', paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>Your name and email address, as provided to our payment processor at checkout</li>
            <li>The number of seats purchased and the amount paid</li>
            <li>A payment reference from our payment processor (not your card details)</li>
          </ul>
          <p style={{ marginTop: 12 }}>
            We use this information to confirm your reservation, send you the confirmation email
            with workshop details, and — if needed — to process a refund under our{' '}
            <Link href="/terms" style={link}>refund policy</Link>. We do not sell this
            information or use it for advertising.
          </p>
        </section>

        <section>
          <h2 style={h2}>Payment processing</h2>
          <p>
            Checkout is handled entirely by{' '}
            <a href="https://www.paddle.com" target="_blank" rel="noopener noreferrer" style={link}>Paddle.com Market Limited</a>,
            our payment processor and merchant of record. Paddle collects and processes your
            payment details directly — we never see or store your full card number. Paddle&apos;s
            own privacy policy governs how it handles that data.
          </p>
        </section>

        <section>
          <h2 style={h2}>Email</h2>
          <p>
            Confirmation emails after a booking are sent through Resend, our transactional email
            provider, using the email address you provided at checkout.
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
          <h2 style={h2}>WhatsApp</h2>
          <p>
            If you choose to contact us via a WhatsApp link on this site, that conversation is
            subject to WhatsApp&apos;s own privacy policy in addition to this notice.
          </p>
        </section>

        <section>
          <h2 style={h2}>Data retention</h2>
          <p>
            We keep workshop reservation records for as long as needed for accounting, tax, and
            legal purposes, and to respond to any refund or support requests.
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
  )
}

const h2: React.CSSProperties = { fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: '0 0 10px' }
const link: React.CSSProperties = { color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }
