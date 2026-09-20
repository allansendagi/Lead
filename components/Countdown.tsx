'use client'
import { useEffect, useState } from 'react'

function getRemaining(target: number) {
  const diff = Math.max(0, target - Date.now())
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  }
}

export default function Countdown({ target, accent }: { target: string; accent: string }) {
  const targetMs = new Date(target).getTime()
  // Start null so the server-rendered markup and the client's first render match exactly —
  // Date.now() differs between the two, which would otherwise cause a hydration mismatch.
  const [time, setTime] = useState<ReturnType<typeof getRemaining> | null>(null)

  useEffect(() => {
    setTime(getRemaining(targetMs))
    const id = setInterval(() => setTime(getRemaining(targetMs)), 1000)
    return () => clearInterval(id)
  }, [targetMs])

  const pad = (n: number) => String(n).padStart(2, '0')
  const segments = time
    ? [{ v: time.d, u: 'd' }, { v: time.h, u: 'h' }, { v: time.m, u: 'm' }, { v: time.s, u: 's' }]
    : [{ v: 0, u: 'd' }, { v: 0, u: 'h' }, { v: 0, u: 'm' }, { v: 0, u: 's' }]

  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, fontFamily: 'monospace', fontSize: 20, fontWeight: 800, visibility: time ? 'visible' : 'hidden' }}>
      {segments.map((seg, i) => (
        <span key={seg.u} style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2 }}>
          {i > 0 && <span style={{ color: '#6b7280', margin: '0 2px' }}>:</span>}
          <span style={{ color: accent }}>{pad(seg.v)}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280' }}>{seg.u}</span>
        </span>
      ))}
    </div>
  )
}
