'use client'
import { useEffect, useRef, useState } from 'react'
import { track } from '@/lib/analytics'
import {
  FIT_CALL_URL, COHORT_DATE_LONG, COHORT_TIME_DOHA, COHORT_TIME_DUBAI,
  PRICE_AED, PRICE_QAR_APPROX, PAYPAL_CURRENCY, MAX_SEATS, BANK, paypalTotal,
} from '@/lib/cohort2'

const C = { bg: '#080808', card: '#161513', border: 'rgba(245,241,234,0.12)', accent: '#C2410C', white: '#F5F1EA', muted: '#A39C90', body: '#d8d2c6' }

const WA_NUMBER = '97450176561'

const included = [
  'Live 2.5-hour working session',
  'Your workflow mapped and labelled',
  'Completed AI Task Canvas',
  'One-page AI Task Specification',
  'Agent steps and limits, if relevant',
  'A first test to run',
  'Direct working feedback',
]

const terms = [
  "Full refund if you don't leave with a specification you'd use. Ask by email within 48 hours of the session.",
  "Can't make it? Cancel up to 7 days before for a full refund, or move your seat to the next cohort at any time.",
  "If the session doesn't go ahead, you get a full refund.",
]

const bankDetails = [
  { label: 'Bank', value: BANK.bank },
  { label: 'Account name', value: BANK.accountName },
  { label: 'Account number', value: BANK.accountNumber },
  { label: 'IBAN', value: BANK.iban },
  { label: 'SWIFT / BIC', value: BANK.swift },
  { label: 'Currency', value: BANK.currency },
]

type Form = {
  name: string; email: string; whatsapp: string; company: string; role: string; workflow: string; billingAddress: string
}
const empty: Form = { name: '', email: '', whatsapp: '', company: '', role: '', workflow: '', billingAddress: '' }

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
}

const inputStyle = (invalid: boolean) => ({
  width: '100%', padding: '13px 16px', borderRadius: 10, background: C.card,
  border: `1px solid ${invalid ? C.accent : C.border}`,
  color: C.white, fontSize: 14, fontFamily: 'inherit', outline: 'none',
} as const)

const primaryButton = (dim: boolean) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',
  background: C.accent, color: C.white, padding: '16px 24px', borderRadius: 12,
  fontSize: 14, fontWeight: 800, border: 'none', cursor: 'pointer',
  textTransform: 'uppercase', letterSpacing: '0.04em', opacity: dim ? 0.6 : 1,
} as const)

export default function CheckoutContents({ paypalClientId }: { paypalClientId: string }) {
  const [form, setForm] = useState<Form>(empty)
  const [hp, setHp] = useState('')
  const [seats, setSeats] = useState(1)
  const [method, setMethod] = useState<'paypal' | 'bank' | 'whatsapp'>('paypal')
  const [touched, setTouched] = useState(false)
  const [paypalError, setPaypalError] = useState<string | null>(null)
  const [invoiceState, setInvoiceState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [paying, setPaying] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const totalAed = seats * PRICE_AED
  const totalQar = seats * PRICE_QAR_APPROX
  const totalUsd = paypalTotal(seats)
  const seatWord = seats > 1 ? 'seats' : 'seat'

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const valid = {
    name: form.name.trim().length >= 2,
    email: isValidEmail(form.email),
    whatsapp: form.whatsapp.trim().length >= 5,
    company: form.company.trim().length >= 1,
    role: form.role.trim().length >= 1,
    workflow: form.workflow.trim().length >= 3,
  }
  const detailsValid = Object.values(valid).every(Boolean)

  function copy(label: string, value: string) {
    navigator.clipboard?.writeText(value).then(() => {
      setCopiedField(label)
      setTimeout(() => setCopiedField(f => (f === label ? null : f)), 1500)
    })
  }

  // GA4 begin_checkout when the page loads.
  useEffect(() => {
    track('begin_checkout', {
      value: PRICE_AED, currency: 'AED',
      items: [{ item_name: 'Make AI Work · Cohort 2', quantity: 1, price: PRICE_AED }],
    })
  }, [])

  const details = () => ({
    name: form.name.trim(), email: form.email.trim(), whatsapp: form.whatsapp.trim(),
    company: form.company.trim(), role: form.role.trim(), workflow: form.workflow.trim(),
    billingAddress: form.billingAddress.trim(),
  })

  // ── WhatsApp / bank transfer ───────────────────────────────────────
  const reserveUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    [
      `Hi Allan, I'd like to reserve ${seats} ${seatWord} for Make AI Work · Cohort 2 (24 October).`,
      ``,
      `Name: ${form.name.trim()}`,
      `Total: AED ${totalAed.toLocaleString('en-US')}`,
    ].join('\n')
  )}`
  const paidUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    [
      `Hi Allan, I've just made a bank transfer of AED ${totalAed.toLocaleString('en-US')} for ${seats} ${seatWord} in Make AI Work · Cohort 2.`,
      ``,
      `Name: ${form.name.trim()}`,
      `Sending proof of payment now.`,
    ].join('\n')
  )}`

  async function handleAction(action: 'reserve' | 'paid') {
    setTouched(true)
    if (!detailsValid) return

    track(action === 'paid' ? 'bank_transfer_paid_click' : 'reserve_whatsapp_click', {
      seats, value: totalAed, currency: 'AED',
    })

    const waUrl = action === 'paid' ? paidUrl : reserveUrl
    const win = window.open(waUrl, '_blank', 'noopener,noreferrer')

    setSendState('sending')
    try {
      await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...details(), seats, method: method === 'bank' ? 'bank_transfer' : 'whatsapp', waUrl }),
      })
    } catch {
      // Non-blocking — the WhatsApp tab is already open regardless.
    } finally {
      setSendState('sent')
    }

    if (!win) window.location.href = waUrl
  }

  // ── PayPal ──────────────────────────────────────────────────────────
  // Buttons render once the SDK loads and the details are valid. A ref keeps
  // the latest form values so callbacks (created once) never read stale state.
  const paypalContainerRef = useRef<HTMLDivElement>(null)
  const paypalRenderedRef = useRef(false)
  const formRef = useRef({ form, seats })
  useEffect(() => { formRef.current = { form, seats } }, [form, seats])

  useEffect(() => {
    if (method !== 'paypal' || !detailsValid || !paypalClientId || paypalRenderedRef.current) return

    function renderButtons() {
      const paypal = (window as any).paypal
      if (!paypal || !paypalContainerRef.current || paypalRenderedRef.current) return
      paypalRenderedRef.current = true
      paypal.Buttons({
        style: { color: 'gold', shape: 'rect', label: 'paypal', height: 45 },
        createOrder: async () => {
          setPaypalError(null)
          const res = await fetch('/api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ seats: formRef.current.seats }),
          })
          const data = await res.json()
          if (!res.ok || !data.id) throw new Error(data.error || 'Could not start PayPal checkout')
          return data.id
        },
        onApprove: async (data: { orderID: string }) => {
          setPaying(true)
          const { form: f, seats: n } = formRef.current
          try {
            const res = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderID: data.orderID, seats: n,
                name: f.name.trim(), email: f.email.trim(), whatsapp: f.whatsapp.trim(),
                company: f.company.trim(), role: f.role.trim(), workflow: f.workflow.trim(),
                billingAddress: f.billingAddress.trim(),
              }),
            })
            const result = await res.json()
            if (result.success) {
              window.location.href = `/checkout/success?order=${encodeURIComponent(data.orderID)}&seats=${n}`
              return
            }
            throw new Error('capture failed')
          } catch {
            setPaying(false)
            setPaypalError('Payment could not be confirmed. Please message Allan on WhatsApp with your PayPal receipt.')
            track('paypal_capture_failed', { order_id: data.orderID })
          }
        },
        onError: () => {
          setPaypalError('PayPal ran into a problem. Please try again, or use bank transfer or WhatsApp instead.')
          track('paypal_error')
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
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(paypalClientId)}&currency=${PAYPAL_CURRENCY}`
      script.addEventListener('load', renderButtons)
      document.body.appendChild(script)
    } else {
      script.addEventListener('load', renderButtons, { once: true })
    }
  }, [method, detailsValid, paypalClientId])

  async function sendInvoiceRequest() {
    setTouched(true)
    if (!detailsValid || invoiceState === 'sending') return
    setInvoiceState('sending')
    try {
      const res = await fetch('/api/invoice-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...details(), seats, hp }),
      })
      if (!res.ok) throw new Error('failed')
      setInvoiceState('sent')
      track('invoice_request', { value: totalAed, currency: 'AED' })
    } catch {
      setInvoiceState('error')
    }
  }

  const err = (ok: boolean, msg: string) =>
    touched && !ok ? <p style={{ fontSize: 12, color: C.accent, margin: '6px 0 0' }}>{msg}</p> : null
  const label = (text: string, optional = false) => (
    <span style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: '0.04em', margin: '0 0 6px' }}>
      {text}{optional ? ' (optional)' : ''}
    </span>
  )

  const tab = (key: 'paypal' | 'bank' | 'whatsapp', text: string) => (
    <button
      type="button"
      onClick={() => setMethod(key)}
      aria-pressed={method === key}
      style={{
        flex: 1, padding: '11px 8px', borderRadius: 9, border: 'none', cursor: 'pointer',
        background: method === key ? C.accent : 'transparent',
        color: method === key ? C.white : C.muted,
        fontSize: 13, fontWeight: 700, letterSpacing: '0.02em', transition: 'background 150ms, color 150ms',
      }}
    >
      {text}
    </button>
  )

  const stepButton = (aria: string, text: string, disabled: boolean, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={aria}
      style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${C.border}`, background: 'none', color: C.white, fontSize: 16, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1 }}
    >
      {text}
    </button>
  )

  return (
    <div className="checkout-grid" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 96px', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 56 }}>
      <div style={{ minWidth: 0 }}>
        <h1 style={{ fontSize: 'clamp(2rem, 4.2vw, 3rem)', fontWeight: 900, color: C.white, lineHeight: 1.1, margin: '0 0 16px' }}>
          Reserve your seat &middot; Cohort 2
        </h1>

        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: '0 0 28px' }}>
          Want to talk first?{' '}
          <a href={FIT_CALL_URL} target="_blank" rel="noopener noreferrer" onClick={() => track('fit_call_click', { location: 'checkout' })} style={{ color: C.white, fontWeight: 600 }}>
            Book a free 10-minute call &rarr;
          </a>
        </p>

        <div style={{ border: `1.5px solid ${C.accent}`, borderRadius: 14, padding: '28px', background: C.card, marginBottom: 36, boxShadow: '0 0 40px rgba(194,65,12,0.1)' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 16px' }}>
            Order summary
          </p>
          <p style={{ fontSize: 22, fontWeight: 800, color: C.white, margin: '0 0 10px' }}>Make AI Work &middot; Cohort 2</p>
          <p style={{ fontSize: 14.5, color: C.body, lineHeight: 1.7, margin: '0 0 4px' }}>
            {COHORT_DATE_LONG} &middot; {COHORT_TIME_DOHA} / {COHORT_TIME_DUBAI}
          </p>
          <p style={{ fontSize: 14.5, color: C.body, lineHeight: 1.7, margin: '0 0 18px' }}>
            Live online &middot; session link sent 24 hours before
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '16px 0', borderTop: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 14, color: C.white }}>Number of seats</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {stepButton('Remove a seat', '−', seats <= 1, () => setSeats(n => Math.max(1, n - 1)))}
              <span style={{ minWidth: 20, textAlign: 'center', fontSize: 15, fontWeight: 700, color: C.white }}>{seats}</span>
              {stepButton('Add a seat', '+', seats >= MAX_SEATS, () => setSeats(n => Math.min(MAX_SEATS, n + 1)))}
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, color: C.white }}>{seats} {seatWord} &middot; AED {PRICE_AED.toLocaleString('en-US')} each</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: C.white }}>
              AED {totalAed.toLocaleString('en-US')}{' '}
              <span style={{ fontSize: 14, fontWeight: 500, color: C.muted }}>(&asymp; QAR {totalQar})</span>
            </span>
          </div>
        </div>

        <h2 style={{ fontSize: 13, fontWeight: 700, color: C.white, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 18px' }}>
          Included
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {included.map(item => (
            <li key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 15, lineHeight: 1.6 }}>
              <span style={{ color: C.accent, flexShrink: 0, fontWeight: 700 }}>&rarr;</span>
              <span style={{ color: C.body }}>{item}</span>
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

      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: C.white, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 16px' }}>
          Your details
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          <div>
            <label htmlFor="co-name">{label('Full name')}</label>
            <input id="co-name" value={form.name} onChange={set('name')} autoComplete="name" style={inputStyle(touched && !valid.name)} />
            {err(valid.name, 'Enter your name.')}
          </div>
          <div>
            <label htmlFor="co-email">{label('Email')}</label>
            <input id="co-email" type="email" value={form.email} onChange={set('email')} autoComplete="email" style={inputStyle(touched && !valid.email)} />
            {err(valid.email, 'Enter a valid email. We send your confirmation here.')}
          </div>
          <div>
            <label htmlFor="co-whatsapp">{label('WhatsApp number')}</label>
            <input id="co-whatsapp" type="tel" value={form.whatsapp} onChange={set('whatsapp')} autoComplete="tel" placeholder="+974 5000 0000" style={inputStyle(touched && !valid.whatsapp)} />
            {err(valid.whatsapp, 'Enter your WhatsApp number, with country code.')}
          </div>
          <div>
            <label htmlFor="co-company">{label('Company')}</label>
            <input id="co-company" value={form.company} onChange={set('company')} autoComplete="organization" style={inputStyle(touched && !valid.company)} />
            {err(valid.company, 'Enter your company.')}
          </div>
          <div>
            <label htmlFor="co-role">{label('Role')}</label>
            <input id="co-role" value={form.role} onChange={set('role')} autoComplete="organization-title" style={inputStyle(touched && !valid.role)} />
            {err(valid.role, 'Enter your role.')}
          </div>
          <div>
            <label htmlFor="co-workflow">{label("The workflow you'll bring, in one line")}</label>
            <input id="co-workflow" value={form.workflow} onChange={set('workflow')} placeholder="e.g. Turning customer enquiries into quotes" style={inputStyle(touched && !valid.workflow)} />
            {err(valid.workflow, 'Describe the workflow in one line.')}
          </div>
          <div>
            <label htmlFor="co-billing">{label('Billing address', true)}</label>
            <textarea id="co-billing" value={form.billingAddress} onChange={set('billingAddress')} rows={3} autoComplete="street-address" placeholder="For invoices" style={{ ...inputStyle(false), resize: 'vertical' }} />
          </div>
          {/* Honeypot — real people never see or fill this */}
          <input value={hp} onChange={e => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
        </div>

        <p style={{ fontSize: 13, fontWeight: 700, color: C.white, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 16px' }}>
          Payment
        </p>

        <div style={{ display: 'flex', gap: 6, padding: 4, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 20 }}>
          {tab('paypal', 'Card or PayPal')}
          {tab('bank', 'Bank transfer')}
          {tab('whatsapp', 'WhatsApp')}
        </div>

        <div style={{ border: `1px solid ${C.border}`, background: C.card, borderRadius: 12, padding: '18px 20px', marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.white, margin: '0 0 10px' }}>Terms</p>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {terms.map(t => (
              <li key={t} style={{ fontSize: 13, color: C.body, lineHeight: 1.65 }}>{t}</li>
            ))}
          </ul>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, margin: '12px 0 0' }}>
            By paying you agree to our <a href="/terms" style={{ color: C.accent }}>Terms of Service</a> and{' '}
            <a href="/privacy" style={{ color: C.accent }}>Privacy Notice</a>.
          </p>
        </div>

        {method === 'paypal' && (
          <>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: '0 0 16px' }}>
              The price is <strong style={{ color: C.white }}>AED {totalAed.toLocaleString('en-US')}</strong>. Card and PayPal charge the
              exact equivalent in US dollars: <strong style={{ color: C.white }}>{PAYPAL_CURRENCY} {totalUsd}</strong> for {seats} {seatWord}.
              Payment is confirmed instantly.
            </p>
            {!detailsValid ? (
              <button
                type="button"
                onClick={() => setTouched(true)}
                style={{ width: '100%', padding: '16px 24px', borderRadius: 12, border: `1px solid ${C.border}`, background: 'none', color: C.muted, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
              >
                Complete your details above to pay
              </button>
            ) : paypalClientId ? (
              <div ref={paypalContainerRef} style={{ minHeight: 45 }} />
            ) : (
              <p style={{ fontSize: 13, color: C.accent, lineHeight: 1.7, margin: 0 }}>
                Card and PayPal payment is not set up on this site yet. Please use bank transfer or WhatsApp instead.
              </p>
            )}
            {paying && <p style={{ fontSize: 13, color: C.muted, margin: '12px 0 0' }}>Confirming your payment&hellip;</p>}
            {paypalError && <p style={{ fontSize: 13, color: C.accent, lineHeight: 1.7, margin: '12px 0 0' }}>{paypalError}</p>}
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
                    type="button"
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
              Transfer <strong style={{ color: C.white }}>AED {totalAed.toLocaleString('en-US')}</strong> (&asymp; QAR {totalQar}) using the details above.
              Bank transfers can take 1&ndash;2 business days to reflect. Once you&apos;ve paid, confirm your
              {' '}{seatWord} by sending proof of payment on WhatsApp.
            </p>

            <button type="button" onClick={() => handleAction('paid')} style={primaryButton(touched && !detailsValid)}>
              I&apos;ve Paid &mdash; Confirm via WhatsApp
            </button>

            <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 24, paddingTop: 20 }}>
              {invoiceState === 'sent' ? (
                <p style={{ fontSize: 15, color: C.white, lineHeight: 1.7, margin: 0 }}>
                  Thanks, I&apos;ll send your invoice within one working day.
                </p>
              ) : (
                <>
                  <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: '0 0 12px' }}>
                    Need an invoice first? I&apos;ll email one for <strong style={{ color: C.white }}>AED {totalAed.toLocaleString('en-US')}</strong> with
                    bank transfer details.
                  </p>
                  <button
                    type="button"
                    onClick={sendInvoiceRequest}
                    disabled={invoiceState === 'sending'}
                    style={{ ...primaryButton(invoiceState === 'sending' || (touched && !detailsValid)), background: 'none', border: `1px solid ${C.accent}`, color: C.white }}
                  >
                    {invoiceState === 'sending' ? 'Sending…' : 'Request an invoice'}
                  </button>
                  {invoiceState === 'error' && (
                    <p style={{ fontSize: 13, color: C.accent, lineHeight: 1.7, margin: '12px 0 0' }}>
                      The request did not go through. Please try again, or message Allan on WhatsApp.
                    </p>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {method === 'whatsapp' && (
          <>
            <button type="button" onClick={() => handleAction('reserve')} style={primaryButton(touched && !detailsValid)}>
              Reserve via WhatsApp
            </button>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: '16px 0 0' }}>
              No payment is taken on this page. Message Allan directly on WhatsApp to confirm your {seatWord} and arrange payment.
            </p>
          </>
        )}

        {sendState === 'sent' && method !== 'paypal' && (
          <p style={{ fontSize: 13, color: C.accent, margin: '14px 0 0' }}>
            &#10003; A confirmation email is on its way to {form.email}.
          </p>
        )}

        <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 24, paddingTop: 24 }}>
          <p style={{ fontSize: 14, color: C.muted, fontStyle: 'italic', margin: 0 }}>
            10 participants maximum. Enrollment is first come, first served.
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
