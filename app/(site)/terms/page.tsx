import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for AI Value Sandbox and ainavsystem.com, operated by SafeHaven LLC.',
  alternates: { canonical: 'https://www.ainavsystem.com/terms/' },
}

const EFFECTIVE_DATE = 'September 2026'

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px 96px' }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 12px' }}>
        Legal
      </p>
      <h1 style={{ fontSize: 36, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>
        Terms of Service
      </h1>
      <p style={{ fontSize: 14, color: '#9ca3af', margin: '0 0 40px' }}>
        Effective {EFFECTIVE_DATE}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, fontSize: 16, color: '#374151', lineHeight: 1.75 }}>
        <section>
          <h2 style={h2}>Who we are</h2>
          <p>
            ainavsystem.com and the AI Value Sandbox workshop are operated by SafeHaven LLC
            (trading as SafeHaven AI), Doha, Qatar. In these terms, &quot;we,&quot; &quot;us&quot; and
            &quot;SafeHaven&quot; refer to SafeHaven LLC. By using this site or purchasing a workshop
            seat, you agree to these terms.
          </p>
        </section>

        <section>
          <h2 style={h2}>The AI Readiness Assessment</h2>
          <p>
            The assessment on this site is a free, informational quiz. It does not require an
            account, and — as described in our{' '}
            <Link href="/privacy" style={link}>Privacy Notice</Link> — it does not collect your
            name, email, or any other personal information. Your results are calculated in your
            browser and are not stored by us.
          </p>
        </section>

        <section>
          <h2 style={h2}>Purchasing a workshop seat</h2>
          <p>
            AI Value Sandbox is a paid, live workshop. Checkout is processed by{' '}
            <a href="https://www.paddle.com" target="_blank" rel="noopener noreferrer" style={link}>
              Paddle.com Market Limited
            </a>{' '}
            (&quot;Paddle&quot;), our payment processor and merchant of record. Paddle handles
            payment collection, receipts, and applicable tax — we never see or store your full
            card details.
          </p>
          <p>
            Current pricing, what&apos;s included, and seat availability are shown on the{' '}
            <Link href="/checkout" style={link}>checkout page</Link> at the time of purchase.
          </p>
        </section>

        <section>
          <h2 style={h2}>Refund policy</h2>
          <p>
            You may request a full refund up to 7 days before the workshop. Between 7 days and
            48 hours before, refunds are available at 50%. Within 48 hours of the workshop, or
            after it has taken place, no refunds are issued — seats are limited and cannot be
            reallocated on short notice. To request a refund, email{' '}
            <a href="mailto:allan@safehavenai.world" style={link}>allan@safehavenai.world</a>{' '}
            before the applicable deadline, including your name and the email used to register.
            If the workshop is postponed or cancelled by SafeHaven, you will receive an automatic
            full refund.
          </p>
        </section>

        <section>
          <h2 style={h2}>Intellectual property</h2>
          <p>
            The AI Task Canvas, the AI Navigator System, the content of{' '}
            <em>The AI Roadmap</em>, and the material delivered in the workshop are the
            intellectual property of Allan Sendagi and SafeHaven LLC. Attending the workshop
            gives you a personal licence to use the framework and your own completed Canvas in
            your business — it does not give you the right to resell, republish, or teach the
            framework itself without our written permission.
          </p>
        </section>

        <section>
          <h2 style={h2}>No guaranteed outcome</h2>
          <p>
            The workshop teaches a framework for specifying AI interventions. We do not guarantee
            any particular business result, and nothing in the workshop, this site, or our
            communications constitutes financial, legal, or technical implementation advice
            specific to your business.
          </p>
        </section>

        <section>
          <h2 style={h2}>Acceptable use</h2>
          <p>
            You agree not to misuse this site — including attempting to interfere with its
            operation, scrape it at scale, or use it for any unlawful purpose.
          </p>
        </section>

        <section>
          <h2 style={h2}>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, SafeHaven LLC&apos;s liability arising from
            your use of this site or attendance at the workshop is limited to the amount you
            paid for your seat. We are not liable for indirect or consequential losses.
          </p>
        </section>

        <section>
          <h2 style={h2}>Governing law</h2>
          <p>These terms are governed by the laws of the State of Qatar.</p>
        </section>

        <section>
          <h2 style={h2}>Changes to these terms</h2>
          <p>
            We may update these terms from time to time. The effective date above reflects the
            most recent version.
          </p>
        </section>

        <section>
          <h2 style={h2}>Contact</h2>
          <p>
            Questions about these terms: <a href="mailto:allan@safehavenai.world" style={link}>allan@safehavenai.world</a>
          </p>
        </section>
      </div>
    </div>
  )
}

const h2: React.CSSProperties = { fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: '0 0 10px' }
const link: React.CSSProperties = { color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }
