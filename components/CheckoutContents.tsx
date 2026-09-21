'use client'
import { useEffect, useRef, useState } from 'react'
import { initializePaddle, type Paddle } from '@paddle/paddle-js'
import Countdown from './Countdown'

const C = { bg: '#080808', card: '#161513', border: 'rgba(245,241,234,0.12)', accent: '#C2410C', white: '#F5F1EA', muted: '#A39C90' }

const WORKSHOP_DEADLINE = '2026-10-03T00:00:00'
const PRICE_PER_SEAT = 550
const MAX_SEATS = 10

const included = [
  { lead: '1 live 2.5-hour working session', rest: 'with Allan Sendagi. Bring one real business task and work through it from beginning to end.' },
  { lead: 'The AI Task Canvas', rest: 'a seven-element framework for specifying the task, prediction, judgment, inputs, training data, feedback, and outcome.' },
  { lead: 'A defined AI intervention', rest: 'specify exactly where AI participates in the work, what it needs to do, and where human judgment remains.' },
  { lead: 'A measurable value hypothesis', rest: 'define what should improve and how you will know whether the intervention creates value.' },
  { lead: 'Direct working feedback from Allan', rest: 'throughout the session.' },
  { lead: 'A completed Canvas', rest: 'you can use to brief a developer, vendor, internal team, or next-stage AI project.' },
  { lead: 'A clear next step', rest: 'identify what needs to be tested, what data is required, and what happens after the workshop.' },
]

export default function CheckoutContents({ waUrl }: { waUrl: string }) {
  const [paddle, setPaddle] = useState<Paddle | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'unconfigured' | 'error'>('loading')
  const [seats, setSeats] = useState(1)
  const updateThrottle = useRef<{ timer: ReturnType<typeof setTimeout> | null; pending: number | null }>({ timer: null, pending: null })

  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
  const env = process.env.NEXT_PUBLIC_PADDLE_ENV as 'sandbox' | 'production' | undefined
  const priceId = process.env.NEXT_PUBLIC_PADDLE_WORKSHOP_PRICE_ID

  useEffect(() => {
    if (paddle?.Initialized) return
    if (!token || !env || !priceId) {
      setStatus('unconfigured')
      return
    }

    initializePaddle({
      token,
      environment: env,
      checkout: {
        settings: {
          variant: 'one-page',
          displayMode: 'inline',
          theme: 'dark',
          frameTarget: 'paddle-checkout-frame',
          frameInitialHeight: 450,
          frameStyle: 'width: 100%; background-color: transparent; border: none',
          successUrl: '/checkout/success',
        },
      },
    }).then(p => {
      if (p) {
        setPaddle(p)
        p.Checkout.open({ items: [{ priceId, quantity: seats }] })
        setStatus('ready')
      } else {
        setStatus('error')
      }
    }).catch(() => setStatus('error'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paddle?.Initialized, token, env, priceId])

  // Throttled quantity sync — Paddle re-renders the checkout on every updateItems call.
  useEffect(() => {
    if (!paddle?.Initialized || !priceId) return
    const t = updateThrottle.current
    t.pending = seats
    if (t.timer) return
    t.timer = setTimeout(() => {
      if (t.pending !== null) paddle.Checkout.updateItems([{ priceId, quantity: t.pending }])
      t.timer = null
    }, 1000)
  }, [seats, paddle, priceId])

  return (
    <div className="checkout-grid" style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 24px 96px', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 56 }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.14em', margin: '0 0 20px' }}>
          AI VALUE SANDBOX &middot; LIVE WORKSHOP
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 4.2vw, 3rem)', fontWeight: 900, color: C.white, lineHeight: 1.1, margin: '0 0 10px' }}>
          Complete your enrollment.
        </h1>
        <p style={{ fontSize: 'clamp(1.2rem, 2.4vw, 1.6rem)', fontStyle: 'italic', fontWeight: 700, color: C.white, margin: '0 0 40px' }}>
          Your seat in AI Value Sandbox.
        </p>

        <h2 style={{ fontSize: 13, fontWeight: 700, color: C.white, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 20px' }}>
          What&apos;s included
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {included.map(item => (
            <li key={item.lead} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 15, lineHeight: 1.65 }}>
              <span style={{ color: C.accent, flexShrink: 0, fontWeight: 700 }}>&rarr;</span>
              <span style={{ color: '#d8d2c6' }}>
                <strong style={{ color: C.white }}>{item.lead}</strong> {item.rest}
              </span>
            </li>
          ))}
        </ul>

        <h2 style={{ fontSize: 13, fontWeight: 700, color: C.white, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>
          What you need
        </h2>
        <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, margin: '0 0 4px' }}>
          One real business task you want to improve with AI.
        </p>
        <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, margin: 0 }}>
          No technical background required. No coding required.
        </p>
      </div>

      <div>
        <div style={{ border: `1.5px solid ${C.accent}`, borderRadius: 14, padding: '28px 28px', background: C.card, marginBottom: 24, boxShadow: '0 0 40px rgba(194,65,12,0.1)' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 20px' }}>
            Launch Cohort &middot; 10 Participants
          </p>

          <Countdown target={WORKSHOP_DEADLINE} accent={C.accent} />

          <div style={{ borderTop: `1px solid ${C.border}`, margin: '20px 0' }} />

          <p style={{ fontSize: 13, color: C.muted, margin: '0 0 6px' }}>AI Value / Sandbox</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: C.white, margin: '0 0 20px' }}>
            QAR {PRICE_PER_SEAT} <span style={{ fontSize: 14, fontWeight: 500, color: C.muted }}>/ seat</span>
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 14, color: C.white }}>Number of seats</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => setSeats(n => Math.max(1, n - 1))}
                disabled={seats <= 1}
                aria-label="Remove a seat"
                style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${C.border}`, background: 'none', color: C.white, fontSize: 16, cursor: seats <= 1 ? 'not-allowed' : 'pointer', opacity: seats <= 1 ? 0.4 : 1 }}
              >
                &minus;
              </button>
              <span style={{ minWidth: 20, textAlign: 'center', fontSize: 15, fontWeight: 700, color: C.white }}>{seats}</span>
              <button
                onClick={() => setSeats(n => Math.min(MAX_SEATS, n + 1))}
                disabled={seats >= MAX_SEATS}
                aria-label="Add a seat"
                style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${C.border}`, background: 'none', color: C.white, fontSize: 16, cursor: seats >= MAX_SEATS ? 'not-allowed' : 'pointer', opacity: seats >= MAX_SEATS ? 0.4 : 1 }}
              >
                +
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0 0', borderTop: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.white }}>Total</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: C.white }}>QAR {seats * PRICE_PER_SEAT}</span>
          </div>
        </div>

        <p style={{ fontSize: 13, fontWeight: 700, color: C.white, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 16px' }}>
          Secure Your Seats
        </p>

        {status === 'unconfigured' && (
          <div style={{ border: `1.5px dashed ${C.border}`, borderRadius: 14, padding: '32px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, margin: '0 0 20px' }}>
              Card checkout is being finalized. In the meantime, reserve your seat directly with Allan.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', background: C.accent, color: C.white,
                padding: '14px 28px', borderRadius: 12, fontSize: 14, fontWeight: 800,
                textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
              }}
            >
              Reserve via WhatsApp
            </a>
          </div>
        )}

        {status === 'error' && (
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
            Checkout couldn&apos;t load. Please refresh, or{' '}
            <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{ color: C.accent }}>reserve via WhatsApp</a>.
          </p>
        )}

        {(status === 'loading' || status === 'ready') && (
          <div className="paddle-checkout-frame" style={{ minHeight: status === 'loading' ? 200 : undefined }} />
        )}

        <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 32, paddingTop: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.white, margin: '0 0 4px' }}>Secure payment</p>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: '0 0 8px' }}>One payment. No subscription.</p>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: '0 0 8px' }}>
            Your card details are securely handled by Paddle.
          </p>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0 }}>
            By registering, you agree to our{' '}
            <a href="/terms" style={{ color: C.accent }}>Terms of Service</a> and{' '}
            <a href="/privacy" style={{ color: C.accent }}>Privacy Notice</a>.
          </p>
        </div>

        <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 24, paddingTop: 24 }}>
          <p style={{ fontSize: 14, color: C.muted, fontStyle: 'italic', margin: 0 }}>
            10 participants maximum. Enrollment is first come, first served.
          </p>
        </div>

        <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 24, paddingTop: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.white, margin: '0 0 10px' }}>Refund policy</p>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0 }}>
            You may request a full refund up to 7 days before the workshop. Between 7 days and 48 hours
            before, refunds are available at 50%. Within 48 hours of the workshop, or after it has taken
            place, no refunds are issued — seats are limited to 10 participants and cannot be reallocated
            on short notice. To request a refund, email{' '}
            <a href="mailto:allan@safehavenai.world" style={{ color: C.accent }}>allan@safehavenai.world</a>{' '}
            before the applicable deadline, including your name and the email used to register. If the
            workshop is postponed or cancelled by SafeHaven AI, you will receive an automatic full refund.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .checkout-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </div>
  )
}
