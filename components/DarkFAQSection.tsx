'use client'
import { useState } from 'react'

interface FAQItem { q: string; a: string }

export default function DarkFAQSection({ faqs }: { faqs: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div>
      {faqs.map((faq, i) => (
        <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            style={{
              width: '100%', textAlign: 'left', background: 'none', border: 'none',
              padding: '20px 0', fontSize: 16, fontWeight: 700, color: '#fff',
              cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', gap: 12, fontFamily: 'inherit',
            }}
          >
            {faq.q}
            <svg
              width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"
              style={{ flexShrink: 0, transition: 'transform 200ms', transform: open === i ? 'rotate(45deg)' : 'none', color: '#FDEB01' }}
            >
              <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          {open === i && (
            <div style={{ fontSize: 15, lineHeight: 1.7, color: '#9CA3AF', paddingBottom: 20 }}>
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
