'use client'
import { useState } from 'react'

type Stage = {
  n: string
  title: string
  summary: string
  rule?: { ifLines: string[]; then: string }
  classes?: { tag: string; note: string }[]
}

type Props = {
  label: string
  task: string
  owner: string
  baseline: string
  target: string
  ideaQuote: string
  stages: Stage[]
  flowLine: string
  interventionSummary: string
  accent: string
}

const INK = '#1a1a1a'
const BODY = '#4b4638'
const MUTED = '#9a9483'
const GOLD = '#9a6b00'
const LINE = '#e5e2d9'
const CARD_BG = '#fbfaf7'
const HEADER_BG = '#f2efe7'

export default function CanvasBuilder({
  label, task, owner, baseline, target, ideaQuote, stages, flowLine, interventionSummary, accent,
}: Props) {
  const [started, setStarted] = useState(false)
  const [revealed, setRevealed] = useState(0)

  if (!started) {
    return (
      <div style={{
        maxWidth: 560, margin: '0 auto', background: CARD_BG, borderRadius: 14,
        boxShadow: '0 20px 50px rgba(0,0,0,0.35)', padding: '40px 36px', textAlign: 'center',
      }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.08em', margin: '0 0 18px' }}>
          START WITH AN AI IDEA
        </p>
        <p style={{ fontSize: 20, fontWeight: 700, color: INK, lineHeight: 1.5, margin: '0 0 28px', fontStyle: 'italic' }}>
          &ldquo;{ideaQuote}&rdquo;
        </p>
        <button
          onClick={() => setStarted(true)}
          style={{
            background: accent, color: '#fff', border: 'none', borderRadius: 10,
            padding: '14px 28px', fontSize: 14, fontWeight: 800, letterSpacing: '0.02em',
            textTransform: 'uppercase', cursor: 'pointer',
          }}
        >
          Build the Canvas &rarr;
        </button>
      </div>
    )
  }

  return (
    <div className="canvas-builder" style={{
      maxWidth: 760, margin: '0 auto', background: CARD_BG, borderRadius: 14,
      boxShadow: '0 20px 50px rgba(0,0,0,0.35)', overflow: 'hidden',
    }}>
      <div style={{ padding: '24px 32px', borderBottom: `1px solid ${LINE}`, background: HEADER_BG }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: '0.08em', margin: '0 0 14px' }}>
          {label}
        </p>
        <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.08em', margin: '0 0 6px' }}>
          START WITH THE TASK
        </p>
        <p style={{ fontSize: 16, fontWeight: 700, color: INK, margin: '0 0 18px', lineHeight: 1.5 }}>{task}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
          {[
            { l: 'Owner', v: owner },
            { l: 'Baseline', v: baseline },
            { l: 'Target', v: target },
          ].map(f => (
            <div key={f.l}>
              <p style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: '0.08em', margin: '0 0 3px' }}>{f.l.toUpperCase()}</p>
              <p style={{ fontSize: 13, color: BODY, margin: 0, lineHeight: 1.5 }}>{f.v}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '24px 32px 8px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.08em', margin: '0 0 14px' }}>
          BUILD THE CANVAS &mdash; CLICK EACH STAGE
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {stages.map((s, i) => {
            const active = i < revealed
            return (
              <button
                key={s.n}
                onClick={() => setRevealed(i + 1)}
                style={{
                  border: `1px solid ${active ? accent : LINE}`,
                  background: active ? accent : 'transparent',
                  color: active ? '#fff' : BODY,
                  borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.02em', cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'background 0.15s, color 0.15s, border-color 0.15s',
                }}
              >
                {s.n} &middot; {s.title}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ padding: revealed > 0 ? '8px 32px 24px' : '0 32px 24px' }}>
        {stages.slice(0, revealed).map((s, i) => (
          <div key={s.n} className="canvas-builder-entry" style={{ padding: '16px 0', borderTop: i === 0 ? 'none' : `1px solid ${LINE}` }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: '0.06em', margin: '0 0 8px' }}>
              {s.n} &middot; {s.title.toUpperCase()}
            </p>
            <p style={{ fontSize: 14, color: BODY, margin: 0, lineHeight: 1.6 }}>{s.summary}</p>
            {s.rule && (
              <div style={{
                marginTop: 12, background: '#fff', border: `1px solid ${LINE}`, borderRadius: 8,
                padding: '14px 16px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 13, color: INK, lineHeight: 1.8,
              }}>
                {s.rule.ifLines.map((line, li) => (
                  <div key={li}>
                    <strong style={{ color: accent }}>{li === 0 ? 'IF' : 'AND'}</strong> {line}
                  </div>
                ))}
                <div><strong style={{ color: accent }}>THEN</strong> {s.rule.then}</div>
              </div>
            )}
            {s.classes && (
              <div style={{
                marginTop: 12, paddingTop: 12, borderTop: `1px solid ${LINE}`,
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '4px 20px',
              }}>
                {s.classes.map(c => (
                  <p key={c.tag} style={{ fontSize: 12.5, color: BODY, margin: 0, lineHeight: 1.5 }}>
                    <strong style={{ color: INK }}>{c.tag}</strong> &mdash; {c.note}
                  </p>
                ))}
              </div>
            )}
            {i < revealed - 1 && (
              <p style={{ textAlign: 'center', color: MUTED, fontSize: 13, margin: '12px 0 0' }}>&darr;</p>
            )}
          </div>
        ))}
      </div>

      {revealed > 0 && (
        <div style={{ padding: '18px 32px', borderTop: `1px solid ${LINE}`, background: HEADER_BG }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: '0.08em', margin: '0 0 6px' }}>
            THE INTERVENTION
          </p>
          <p style={{ fontSize: 13, color: BODY, margin: 0, lineHeight: 1.7, fontWeight: 600 }}>{flowLine}</p>
        </div>
      )}

      {revealed === stages.length && (
        <div style={{ padding: '24px 32px', borderTop: `1px solid ${LINE}` }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: '0.08em', margin: '0 0 16px' }}>
            WHAT CHANGED?
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: '0.08em', margin: '0 0 6px' }}>BEFORE</p>
              <p style={{ fontSize: 14, color: BODY, fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>&ldquo;{ideaQuote}&rdquo;</p>
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: '0.08em', margin: '0 0 6px' }}>AFTER</p>
              <p style={{ fontSize: 14, color: INK, fontWeight: 600, margin: 0, lineHeight: 1.6 }}>{interventionSummary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
