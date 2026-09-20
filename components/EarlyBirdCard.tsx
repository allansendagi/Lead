'use client'
import { useState } from 'react'
import Countdown from './Countdown'

const C = { accent: '#C2410C', border: 'rgba(245,241,234,0.12)', white: '#F5F1EA', muted: '#A39C90', body: '#D8D2C6' }

export default function EarlyBirdCard({
  waNumber,
  deadline,
  includes,
}: {
  waNumber: string
  deadline: string
  includes: string[]
}) {
  const [extraSeats, setExtraSeats] = useState(0)
  const totalSeats = 1 + extraSeats

  const waMsg = encodeURIComponent(
    `Hi Allan, I'd like to reserve ${totalSeats} seat${totalSeats > 1 ? 's' : ''} for the AI Value Sandbox workshop (First In Line pricing).`
  )
  const waUrl = `https://wa.me/${waNumber}?text=${waMsg}`

  return (
    <div style={{
      border: `1.5px solid ${C.accent}`, borderRadius: 14, padding: '32px 32px',
      background: '#0c0c0c', boxShadow: '0 0 40px rgba(194,65,12,0.1)',
    }}>
      <Countdown target={deadline} accent={C.accent} />

      <p style={{ fontSize: 22, fontWeight: 800, color: C.white, margin: '16px 0 6px' }}>
        First In Line Pricing
      </p>
      <p style={{ fontSize: 14, color: C.muted, fontStyle: 'italic', margin: '0 0 24px', lineHeight: 1.6 }}>
        This price holds until [DATE] at 12:00 AM, then the workshop moves to the next pricing tier.
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: `1px solid ${C.border}`, fontSize: 15 }}>
        <span style={{ color: C.white }}>AI Value Sandbox seat ×1</span>
        <span style={{ color: C.white, fontWeight: 700 }}>[EARLY PRICE]</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', borderBottom: `1px solid ${C.border}`, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontSize: 14, color: C.white, margin: '0 0 2px' }}>Additional seats</p>
          <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>[TEAM PRICE] each</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setExtraSeats(n => Math.max(0, n - 1))}
            aria-label="Remove a seat"
            style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${C.border}`, background: 'none', color: C.white, fontSize: 16, cursor: 'pointer' }}
          >
            −
          </button>
          <span style={{ minWidth: 20, textAlign: 'center', fontSize: 15, fontWeight: 700, color: C.white }}>{extraSeats}</span>
          <button
            onClick={() => setExtraSeats(n => n + 1)}
            aria-label="Add a seat"
            style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${C.border}`, background: 'none', color: C.white, fontSize: 16, cursor: 'pointer' }}
          >
            +
          </button>
        </div>
        <span style={{ color: C.white, fontWeight: 700, fontSize: 15 }}>
          {extraSeats > 0 ? `${extraSeats} × [TEAM PRICE]` : '$0'}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0 24px', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.white, margin: 0 }}>Total</p>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{totalSeats} seat{totalSeats > 1 ? 's' : ''} total</p>
        </div>
        <p style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
          <span style={{ color: C.muted, textDecoration: 'line-through', fontWeight: 500, marginRight: 8, fontSize: 15 }}>[REGULAR PRICE]</span>
          <span style={{ color: C.white }}>[EARLY PRICE]</span>
        </p>
      </div>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: C.accent, color: C.white, padding: '16px 24px', borderRadius: 12,
          fontSize: 14, fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
        }}
      >
        Reserve Your Seat
      </a>
      <p style={{ fontSize: 12, color: C.muted, textAlign: 'center', fontStyle: 'italic', margin: '14px 0 0' }}>
        Seats are limited. Enrollment is first come, first served.
      </p>

      <div style={{ borderTop: `1px solid ${C.border}`, margin: '28px 0 24px' }} />

      <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', margin: '0 0 16px' }}>
        WHAT YOUR SEAT INCLUDES
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {includes.map(item => {
          const [lead, ...rest] = item.split('|')
          return (
            <li key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.6 }}>
              <span style={{ color: C.accent, flexShrink: 0, fontWeight: 700 }}>→</span>
              <span style={{ color: C.body }}>
                <strong style={{ color: C.white }}>{lead}</strong>{rest.length > 0 ? ` — ${rest.join('|')}` : ''}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
