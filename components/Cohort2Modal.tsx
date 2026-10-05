'use client'
import { useEffect, useState, type CSSProperties } from 'react'

const C = {
  bg: '#080808', card: '#161513', sunk: '#0c0c0c', border: 'rgba(245,241,234,0.12)',
  accent: '#C2410C', accentSoft: '#E8823D', white: '#F5F1EA', muted: '#A39C90', body: '#D8D2C6',
}

function track(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', event, params)
  }
}

type TriggerProps = {
  label?: string
  style?: CSSProperties
  variant?: 'link' | 'banner'
}

export default function Cohort2Waitlist({ label, style, variant = 'link' }: TriggerProps) {
  const [open, setOpen] = useState(false)

  if (variant === 'banner') {
    return (
      <>
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap',
            width: '100%', background: C.accent, color: C.white,
            padding: '10px 16px', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em',
            gap: '0.4em',
          }}
        >
          <span>
            NEXT COHORT: SATURDAY 24 OCTOBER &middot; 10 SEATS &middot; AED 1,000 &middot; FULL REFUND IF IT&apos;S NOT USEFUL
          </span>
          <span aria-hidden="true">&middot;</span>
          <button
            onClick={() => { track('cohort2_waitlist_open', { variant: 'banner' }); setOpen(true) }}
            style={{
              background: 'none', border: 'none', color: C.white, textDecoration: 'underline',
              cursor: 'pointer', padding: 0, font: 'inherit', letterSpacing: 'inherit',
            }}
          >
            BOOK A FIT CALL &rarr;
          </button>
        </div>
        <Cohort2Modal open={open} onClose={() => setOpen(false)} />
      </>
    )
  }

  return (
    <>
      <button
        onClick={() => { track('cohort2_waitlist_open', { variant: 'link' }); setOpen(true) }}
        style={{
          background: 'none', border: 'none', color: C.muted, fontSize: 13,
          textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit',
          ...style,
        }}
      >
        {label || "Can't make it? Book a fit call for Cohort 2"}
      </button>
      <Cohort2Modal open={open} onClose={() => setOpen(false)} />
    </>
  )
}

type Props = {
  open: boolean
  onClose: () => void
}

function Cohort2Modal({ open, onClose }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  async function submit() {
    if (!email.trim() || state === 'sending') return
    setState('sending')
    setError(null)
    try {
      const res = await fetch('/api/cohort2-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || undefined, source: 'workshop page' }),
      })
      if (!res.ok) {
        let message = 'Something went wrong — try again.'
        try {
          const data = await res.json()
          if (data?.fields?.email) message = "That email address doesn't look right — check it and try again."
        } catch { /* keep default message */ }
        setError(message)
        setState('error')
        return
      }
      setState('sent')
      track('cohort2_waitlist_submit')
    } catch {
      setError('Something went wrong — try again.')
      setState('error')
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative', maxWidth: 480, width: '100%', background: C.bg,
          border: `1px solid ${C.border}`, borderRadius: 16, padding: '40px 36px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%',
            background: 'none', border: `1px solid ${C.border}`, color: C.muted, fontSize: 16,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          &times;
        </button>

        <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 14px' }}>
          Cohort 2 &middot; 24 October
        </p>

        {state === 'sent' ? (
          <>
            <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 900, color: C.white, lineHeight: 1.2, margin: '0 0 12px' }}>
              You&apos;re on the list.
            </h2>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, margin: 0 }}>
              I&apos;ll reach out personally to set up your 10-minute fit call.
            </p>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 900, color: C.white, lineHeight: 1.2, margin: '0 0 12px' }}>
              Book a fit call
            </h2>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, margin: '0 0 24px' }}>
              Cohort 2 runs Saturday 24 October, 10:00 Doha / 11:00 Dubai, with 10 seats at AED 1,000 and a full refund if it&apos;s not useful. Leave your email and I&apos;ll reach out personally for a 10-minute fit call — no commitment until we&apos;ve talked.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 10 }}>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Name (optional)"
                style={{
                  padding: '13px 14px', borderRadius: 10,
                  background: C.sunk, border: `1px solid ${C.border}`, color: C.white, fontSize: 14.5,
                }}
              />
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                type="email"
                style={{
                  padding: '13px 14px', borderRadius: 10,
                  background: C.sunk, border: `1px solid ${C.border}`, color: C.white, fontSize: 14.5,
                }}
              />
              <button
                onClick={submit}
                disabled={!email.trim() || state === 'sending'}
                style={{
                  background: C.accent, color: C.white, border: 'none', borderRadius: 10,
                  padding: '14px 20px', fontSize: 14, fontWeight: 800, cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: '0.03em',
                  opacity: !email.trim() || state === 'sending' ? 0.5 : 1,
                }}
              >
                {state === 'sending' ? 'Sending…' : 'Book my fit call →'}
              </button>
            </div>
            {state === 'error' && (
              <p style={{ fontSize: 12.5, color: C.accentSoft, margin: '4px 0 0' }}>
                {error}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
