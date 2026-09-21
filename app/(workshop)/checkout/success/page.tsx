import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "You're Confirmed — AI Value Sandbox",
  robots: { index: false, follow: false },
}

const C = { bg: '#080808', card: '#161513', border: 'rgba(245,241,234,0.12)', accent: '#C2410C', white: '#F5F1EA', muted: '#A39C90' }
const WORKSHOP_DATE = 'October 3, 2026'

export default function CheckoutSuccessPage() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 24px' }}>
        <a href="/" style={{ color: C.white, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
          &larr; Back to the workshop
        </a>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{
          maxWidth: 560, width: '100%', textAlign: 'center',
          border: `1.5px solid ${C.accent}`, borderRadius: 16, padding: '56px 40px',
          background: C.card, boxShadow: '0 0 40px rgba(194,65,12,0.1)',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: C.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 style={{ fontSize: 30, fontWeight: 800, color: C.white, margin: '0 0 12px' }}>
            You&apos;re confirmed.
          </h1>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.7, margin: '0 0 4px' }}>
            Your seat in AI Value Sandbox is booked for
          </p>
          <p style={{ fontSize: 18, fontWeight: 700, color: C.accent, margin: '0 0 28px' }}>
            {WORKSHOP_DATE}
          </p>

          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, margin: '0 0 32px' }}>
            A confirmation with the workshop details is on its way to your email.
            Bring one real business task you want to improve with AI — no technical background required.
          </p>

          <a
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', background: C.accent, color: C.white,
              padding: '14px 32px', borderRadius: 12, fontSize: 14, fontWeight: 800,
              textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
            }}
          >
            Back to the workshop
          </a>
        </div>
      </div>
    </div>
  )
}
