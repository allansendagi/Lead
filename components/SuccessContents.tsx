'use client'
import { useEffect } from 'react'
import { track } from '@/lib/analytics'
import { PRICE_AED } from '@/lib/cohort2'

const C = { bg: '#080808', card: '#161513', border: 'rgba(245,241,234,0.12)', accent: '#C2410C', white: '#F5F1EA', muted: '#A39C90', body: '#d8d2c6' }

const WA_QUESTIONS = `https://wa.me/97450176561?text=${encodeURIComponent('Hi Allan, a question about Make AI Work · Cohort 2')}`

const steps = [
  'A confirmation email arrives now.',
  "A short pre-work email follows, to help you list your workflow's steps.",
  'Your session link arrives 24 hours before we start.',
]

export default function SuccessContents() {
  // GA4 purchase, once per order. The order id comes from the PayPal return;
  // a reload must not count a second purchase.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const order = params.get('order')
    if (!order) return
    const n = Math.min(10, Math.max(1, parseInt(params.get('seats') || '1', 10) || 1))
    const key = `purchase_tracked_${order}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch { /* storage blocked: accept a possible double count */ }
    track('purchase', {
      transaction_id: order,
      value: PRICE_AED * n,
      currency: 'AED',
      items: [{ item_name: 'Make AI Work · Cohort 2', quantity: n, price: PRICE_AED }],
    })
  }, [])

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '72px 24px 96px' }}>
        <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 3.6rem)', fontWeight: 900, color: C.white, lineHeight: 1.05, margin: '0 0 28px' }}>
          You&apos;re in.
        </h1>
        <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 16px' }}>
          Here&apos;s what happens next
        </p>
        <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {steps.map((text, i) => (
            <li key={text} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', fontSize: 16, lineHeight: 1.6, color: C.body }}>
              <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', border: `1.5px solid ${C.accent}`, color: C.accent, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {i + 1}
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ol>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <a
            href="/make-ai-work-cohort-2.ics"
            download
            onClick={() => track('add_to_calendar_click')}
            style={{
              display: 'inline-flex', alignItems: 'center', background: C.accent, color: C.white,
              padding: '15px 28px', borderRadius: 12, fontSize: 14, fontWeight: 800,
              textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
            }}
          >
            Add to calendar
          </a>
          <a href={WA_QUESTIONS} target="_blank" rel="noopener noreferrer" style={{ color: C.white, fontSize: 14.5, fontWeight: 600 }}>
            Questions? Message me
          </a>
        </div>
      </div>
    </div>
  )
}
