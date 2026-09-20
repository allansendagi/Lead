'use client'
import { useState } from 'react'

interface NavItem { label: string; href: string }

const C = { bg: '#080808', border: 'rgba(245,241,234,0.12)', accent: '#C2410C', white: '#F5F1EA', muted: '#A39C90' }

export default function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mobile-nav">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
        aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 40, height: 40, borderRadius: 8, border: `1px solid ${C.border}`,
          background: 'none', color: C.white, cursor: 'pointer', flexShrink: 0,
        }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M2.5 5.5h15M2.5 10h15M2.5 14.5h15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 500,
          background: C.bg, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
          padding: '8px 20px 16px', display: 'flex', flexDirection: 'column',
        }}>
          {items.map(item => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{
                padding: '14px 0', borderBottom: `1px solid ${C.border}`,
                color: C.muted, fontSize: 14, fontWeight: 700, letterSpacing: '0.04em',
                textDecoration: 'none',
              }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="/assessment"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            style={{
              marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: C.accent, color: C.white, padding: '13px 20px', borderRadius: 10,
              fontSize: 13, fontWeight: 700, textDecoration: 'none', textAlign: 'center',
            }}
          >
            Not sure yet? Take the AI Readiness Quiz →
          </a>
        </div>
      )}
    </div>
  )
}
