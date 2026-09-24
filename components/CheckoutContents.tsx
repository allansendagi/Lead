'use client'
import { useEffect, useRef, useState } from 'react'
import Countdown from './Countdown'

const C = { bg: '#080808', card: '#161513', border: 'rgba(245,241,234,0.12)', accent: '#C2410C', white: '#F5F1EA', muted: '#A39C90' }

const WORKSHOP_DEADLINE = '2026-10-03T10:00:00+03:00'
const PRICE_PER_SEAT_QAR = 550
const PRICE_PER_SEAT_USD = 151
const PRICE_PER_SEAT_AED = 554
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

const bankDetails = [
  { label: 'Bank', value: 'Commercial Bank of Qatar' },
  { label: 'Account name', value: 'SAFEHAVEN LLC' },
  { label: 'Account number', value: '401031480031001' },
  { label: 'IBAN', value: 'QA31CBQA000000401031480031001' },
  { label: 'SWIFT / BIC', value: 'CBQAQAQA' },
  { label: 'Currency', value: 'QAR' },
]

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
}

export default function CheckoutContents({ waNumber, paypalClientId }: { waNumber: string; paypalClientId: string }) {
  const [seats, setSeats] = useState(1)
  const [method, setMethod] = useState<'whatsapp' | 'bank' | 'paypal'>('bank')
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [paypalError, setPaypalError] = useState<string | null>(null)
  const totalQar = seats * PRICE_PER_SEAT_QAR
  const totalUsd = seats * PRICE_PER_SEAT_USD

  const nameValid = name.trim().length >= 2
  const emailValid = isValidEmail(email)
  const detailsValid = nameValid && emailValid

  function copy(label: string, value: string) {
    navigator.clipboard?.writeText(value).then(() => {
      setCopiedField(label)
      setTimeout(() => setCopiedField(f => (f === label ? null : f)), 1500)
    })
  }

  const reserveMsg = encodeURIComponent(
    [
      `Hi Allan, I'd like to reserve ${seats} seat${seats > 1 ? 's' : ''} for the AI Value Sandbox workshop.`,
      ``,
      `Name: ${name.trim()}`,
      `Total: QAR ${totalQar}`,
    ].join('\n')
  )
  const paidMsg = encodeURIComponent(
    [
      `Hi Allan, I've just made a bank transfer of QAR ${totalQar} for ${seats} seat${seats > 1 ? 's' : ''} in the AI Value Sandbox workshop.`,
      ``,
      `Name: ${name.trim()}`,
      `Sending proof of payment now.`,
    ].join('\n')
  )
  const reserveUrl = `https://wa.me/${waNumber}?text=${reserveMsg}`
  const paidUrl = `https://wa.me/${waNumber}?text=${paidMsg}`

  async function handleAction(action: 'reserve' | 'paid') {
    setTouched(true)
    if (!detailsValid) return

    const waUrl = action === 'paid' ? paidUrl : reserveUrl
    const win = window.open(waUrl, '_blank', 'noopener,noreferrer')

    setSendState('sending')
    try {
      await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          seats,
          method: method === 'bank' ? 'bank_transfer' : 'whatsapp',
          waUrl,
        }),
      })
    } catch {
      // Non-blocking — the WhatsApp tab is already open regardless.
    } finally {
      setSendState('sent')
    }

    if (!win) window.location.href = waUrl
  }

  // ── PayPal ──────────────────────────────────────────────────────────
  // Buttons are rendered once the SDK loads and details are valid; a ref
  // keeps the latest seats/name/email so the callbacks (created once)
  // never read stale values from an earlier render.
  const paypalContainerRef = useRef<HTMLDivElement>(null)
  const paypalRenderedRef = useRef(false)
  const formStateRef = useRef({ seats, name, email, waUrl: reserveUrl })
  useEffect(() => {
    formStateRef.current = { seats, name, email, waUrl: reserveUrl }
  }, [seats, name, email, reserveUrl])

  useEffect(() => {
    if (method !== 'paypal' || !detailsValid || !paypalClientId || paypalRenderedRef.current) return

    function renderButtons() {
      const paypal = (window as any).paypal
      if (!paypal || !paypalContainerRef.current) return
      paypalRenderedRef.current = true
      paypal.Buttons({
        style: { color: 'gold', shape: 'rect', label: 'paypal', height: 45 },
        createOrder: async () => {
          setPaypalError(null)
          const res = await fetch('/api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ seats: formStateRef.current.seats }),
          })
          const data = await res.json()
          if (!res.ok || !data.id) throw new Error(data.error || 'Could not start PayPal checkout')
          return data.id
        },
        onApprove: async (data: { orderID: string }) => {
          setSendState('sending')
          try {
            const res = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderID: data.orderID,
                name: formStateRef.current.name.trim(),
                email: formStateRef.current.email.trim(),
                seats: formStateRef.current.seats,
                waUrl: formStateRef.current.waUrl,
              }),
            })
            const result = await res.json()
            if (result.success) {
              setSendState('sent')
            } else {
              setSendState('idle')
              setPaypalError('Payment could not be confirmed. Please contact Allan on WhatsApp with your PayPal receipt.')
            }
          } catch {
            setSendState('idle')
            setPaypalError('Payment could not be confirmed. Please contact Allan on WhatsApp with your PayPal receipt.')
          }
        },
        onError: () => {
          setPaypalError('PayPal ran into a problem. Please try again, or use bank transfer / WhatsApp instead.')
        },
      }).render(paypalContainerRef.current)
    }

    if ((window as any).paypal) {
      renderButtons()
      return
    }

    const scriptId = 'paypal-sdk'
    let script = document.getElementById(scriptId) as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(paypalClientId)}&currency=USD`
      script.addEventListener('load', renderButtons)
      document.body.appendChild(script)
    } else {
      script.addEventListener('load', renderButtons, { once: true })
    }
  }, [method, detailsValid, paypalClientId])

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
        <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, margin: '0 0 12px' }}>
          No technical background required. No coding required.
        </p>
        <a href="/pick-your-task" style={{ color: C.muted, fontSize: 13.5, textDecoration: 'underline' }}>
          Don&apos;t have one yet? Find one in 5 minutes &rarr;
        </a>
      </div>

      <div>
        <div style={{ border: `1.5px solid ${C.accent}`, borderRadius: 14, padding: '28px 28px', background: C.card, marginBottom: 24, boxShadow: '0 0 40px rgba(194,65,12,0.1)' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 20px' }}>
            Launch Cohort &middot; 10 Participants
          </p>

          <Countdown target={WORKSHOP_DEADLINE} accent={C.accent} />

          <div style={{ borderTop: `1px solid ${C.border}`, margin: '20px 0' }} />

          <p style={{ fontSize: 13, color: C.muted, margin: '0 0 6px' }}>AI Value / Sandbox</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: C.white, margin: '0 0 4px' }}>
            QAR {PRICE_PER_SEAT_QAR} <span style={{ fontSize: 14, fontWeight: 500, color: C.muted }}>/ seat</span>
          </p>
          <p style={{ fontSize: 13, color: C.muted, margin: '0 0 20px' }}>
            &asymp; AED {PRICE_PER_SEAT_AED} / seat
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
            <span style={{ fontSize: 20, fontWeight: 800, color: C.white }}>
              {method === 'paypal' ? `$${totalUsd}` : `QAR ${totalQar}`}
            </span>
          </div>
        </div>

        <p style={{ fontSize: 13, fontWeight: 700, color: C.white, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 16px' }}>
          Your details
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          <div>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Full name"
              aria-label="Full name"
              style={{
                width: '100%', padding: '13px 16px', borderRadius: 10, background: C.card,
                border: `1px solid ${touched && !nameValid ? C.accent : C.border}`,
                color: C.white, fontSize: 14, fontFamily: 'inherit', outline: 'none',
              }}
            />
            {touched && !nameValid && (
              <p style={{ fontSize: 12, color: C.accent, margin: '6px 0 0' }}>Enter your name.</p>
            )}
          </div>
          <div>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              aria-label="Email address"
              type="email"
              style={{
                width: '100%', padding: '13px 16px', borderRadius: 10, background: C.card,
                border: `1px solid ${touched && !emailValid ? C.accent : C.border}`,
                color: C.white, fontSize: 14, fontFamily: 'inherit', outline: 'none',
              }}
            />
            {touched && !emailValid && (
              <p style={{ fontSize: 12, color: C.accent, margin: '6px 0 0' }}>Enter a valid email &mdash; we&apos;ll send your confirmation here.</p>
            )}
          </div>
        </div>

        <p style={{ fontSize: 13, fontWeight: 700, color: C.white, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 16px' }}>
          Reserve Your Seats
        </p>

        {/* Method switch */}
        <div style={{ display: 'flex', gap: 6, padding: 4, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 20 }}>
          <button
            onClick={() => setMethod('bank')}
            style={{
              flex: 1, padding: '10px 10px', borderRadius: 9, border: 'none', cursor: 'pointer',
              background: method === 'bank' ? C.accent : 'transparent',
              color: method === 'bank' ? C.white : C.muted,
              fontSize: 13, fontWeight: 700, letterSpacing: '0.02em', transition: 'background 150ms, color 150ms',
            }}
          >
            Bank Transfer
          </button>
          <button
            onClick={() => setMethod('paypal')}
            style={{
              flex: 1, padding: '10px 10px', borderRadius: 9, border: 'none', cursor: 'pointer',
              background: method === 'paypal' ? C.accent : 'transparent',
              color: method === 'paypal' ? C.white : C.muted,
              fontSize: 13, fontWeight: 700, letterSpacing: '0.02em', transition: 'background 150ms, color 150ms',
            }}
          >
            PayPal
          </button>
          <button
            onClick={() => setMethod('whatsapp')}
            style={{
              flex: 1, padding: '10px 10px', borderRadius: 9, border: 'none', cursor: 'pointer',
              background: method === 'whatsapp' ? C.accent : 'transparent',
              color: method === 'whatsapp' ? C.white : C.muted,
              fontSize: 13, fontWeight: 700, letterSpacing: '0.02em', transition: 'background 150ms, color 150ms',
            }}
          >
            WhatsApp
          </button>
        </div>

        {method === 'whatsapp' && (
          <>
            <button
              onClick={() => handleAction('reserve')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',
                background: C.accent, color: C.white, padding: '16px 24px', borderRadius: 12,
                fontSize: 14, fontWeight: 800, border: 'none', cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.04em', opacity: touched && !detailsValid ? 0.6 : 1,
              }}
            >
              Reserve via WhatsApp
            </button>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: '16px 0 0' }}>
              No payment is taken on this page. Message Allan directly on WhatsApp to confirm your seat{seats > 1 ? 's' : ''} and arrange payment.
            </p>
          </>
        )}

        {method === 'bank' && (
          <>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, background: C.card, overflow: 'hidden' }}>
              {bankDetails.map((row, i) => (
                <div
                  key={row.label}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    padding: '14px 18px', borderTop: i === 0 ? 'none' : `1px solid ${C.border}`,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 2px' }}>
                      {row.label}
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: C.white, margin: 0, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', wordBreak: 'break-all' }}>
                      {row.value}
                    </p>
                  </div>
                  <button
                    onClick={() => copy(row.label, row.value)}
                    style={{
                      flexShrink: 0, padding: '7px 12px', borderRadius: 8, border: `1px solid ${C.border}`,
                      background: 'none', color: copiedField === row.label ? C.accent : C.muted,
                      fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    {copiedField === row.label ? 'Copied' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: '16px 0 20px' }}>
              Transfer <strong style={{ color: C.white }}>QAR {totalQar}</strong> using the details above.
              Bank transfers can take 1&ndash;2 business days to reflect. Once you&apos;ve paid, confirm your
              seat{seats > 1 ? 's' : ''} by sending proof of payment on WhatsApp.
            </p>

            <button
              onClick={() => handleAction('paid')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',
                background: C.accent, color: C.white, padding: '16px 24px', borderRadius: 12,
                fontSize: 14, fontWeight: 800, border: 'none', cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.04em', opacity: touched && !detailsValid ? 0.6 : 1,
              }}
            >
              I&apos;ve Paid &mdash; Confirm via WhatsApp
            </button>
          </>
        )}

        {method === 'paypal' && (
          <>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: '0 0 16px' }}>
              PayPal charges in US dollars &mdash; <strong style={{ color: C.white }}>${totalUsd}</strong> for{' '}
              {seats} seat{seats > 1 ? 's' : ''} (QAR {totalQar} at a fixed rate). Payment is confirmed instantly.
            </p>
            {!detailsValid ? (
              <button
                onClick={() => setTouched(true)}
                style={{
                  width: '100%', padding: '16px 24px', borderRadius: 12, border: `1px solid ${C.border}`,
                  background: 'none', color: C.muted, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}
              >
                Enter your name and email above to pay with PayPal
              </button>
            ) : (
              <div ref={paypalContainerRef} style={{ minHeight: 45 }} />
            )}
            {paypalError && (
              <p style={{ fontSize: 13, color: C.accent, lineHeight: 1.7, margin: '12px 0 0' }}>{paypalError}</p>
            )}
          </>
        )}

        {sendState === 'sent' && (
          <p style={{ fontSize: 13, color: C.accent, margin: '14px 0 0' }}>
            &#10003; A confirmation email is on its way to {email}.
          </p>
        )}

        <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 24, paddingTop: 24 }}>
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
