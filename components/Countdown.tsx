'use client'
import { useEffect, useState } from 'react'

type Remaining = { d: number; h: number; m: number; s: number }

function getRemaining(target: string): Remaining | null {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function Countdown({
  target,
  accent,
  label = 'Enrollment closes in',
  closedLabel = 'Enrollment has closed',
}: {
  target: string
  accent: string
  label?: string
  closedLabel?: string
}) {
  const [remaining, setRemaining] = useState<Remaining | null | undefined>(undefined)

  useEffect(() => {
    setRemaining(getRemaining(target))
    const id = setInterval(() => setRemaining(getRemaining(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return (
    <div style={{ visibility: remaining === undefined ? 'hidden' : 'visible' }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#A39C90', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 8px' }}>
        {label}
      </p>
      {remaining ? (
        <p style={{ fontSize: 22, fontWeight: 800, color: accent, margin: 0, fontVariantNumeric: 'tabular-nums' }}>
          {pad(remaining.d)}d : {pad(remaining.h)}h : {pad(remaining.m)}m : {pad(remaining.s)}s
        </p>
      ) : (
        <p style={{ fontSize: 16, fontWeight: 700, color: accent, margin: 0 }}>{closedLabel}</p>
      )}
    </div>
  )
}
