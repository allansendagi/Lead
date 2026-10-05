'use client'
import { useState } from 'react'

const C = {
  bg: '#080808', card: '#161513', sunk: '#0c0c0c', border: 'rgba(245,241,234,0.12)',
  accent: '#C2410C', accentSoft: '#E8823D', white: '#F5F1EA', muted: '#A39C90', body: '#D8D2C6',
}

const PROCESSES = ['Customer follow-up', 'Reporting', 'Invoice processing', 'Hiring', 'Something else']

const MIN_STEPS = 3
const START_ROWS = 6
const MAX_STEPS = 10
const WA_NUMBER = '97450176561'

type StepRow = { id: string; text: string }

type Criteria = { predictability: number; data: number; complexity: number; frequency: number }

const CRITERIA_META: { key: keyof Criteria; label: string; low: string; high: string; help: string }[] = [
  { key: 'predictability', label: 'Predictability', low: 'Needs judgment, exceptions', high: 'Same decision every time', help: 'Does roughly the same decision happen, over and over, the same way?' },
  { key: 'data', label: 'Data availability', low: "Doesn't exist yet, or messy", high: 'Structured and accessible', help: 'Do you already have the information this would need, in some usable form?' },
  { key: 'complexity', label: 'Complexity', low: 'Deep reasoning, lots of context', high: 'Simple lookup or classification', help: 'Is this a simple call, or does it need real judgment about a messy situation?' },
  { key: 'frequency', label: 'Frequency', low: 'Rare, occasional', high: 'Dozens of times a week', help: 'How often does this actually happen?' },
]

function band(avg: number): 'High' | 'Medium' | 'Low' {
  if (avg >= 4) return 'High'
  if (avg >= 2.5) return 'Medium'
  return 'Low'
}

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

function track(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', event, params)
  }
}

export default function TaskFitContents({ displayFont }: { displayFont: string }) {
  const [step, setStep] = useState<'intro' | 'process' | 'score' | 'steps' | 'result'>('intro')
  const [process, setProcess] = useState('')
  const [customProcess, setCustomProcess] = useState('')
  const [scores, setScores] = useState<Criteria>({ predictability: 3, data: 3, complexity: 3, frequency: 3 })
  const [classification, setClassification] = useState<'fixed' | 'estimate' | null>(null)
  const [rows, setRows] = useState<StepRow[]>(() => Array.from({ length: START_ROWS }, () => ({ id: uid(), text: '' })))
  const [annoyingId, setAnnoyingId] = useState<string | null>(null)
  const [captureName, setCaptureName] = useState('')
  const [captureEmail, setCaptureEmail] = useState('')
  const [captureState, setCaptureState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [captureError, setCaptureError] = useState<string | null>(null)

  const effectiveProcess = (process === 'Something else' ? customProcess : process).trim()
  const filledSteps = rows.filter(r => r.text.trim())
  const annoyingStep = filledSteps.find(r => r.id === annoyingId) || null

  const avg = (scores.predictability + scores.data + scores.complexity + scores.frequency) / 4
  const automationFit = band(avg)
  const aiPotential: 'High' | 'Medium' | 'Low' = classification === 'fixed' ? 'Low' : band(avg)

  const weakest = CRITERIA_META.reduce((min, c) => (scores[c.key] < scores[min.key] ? c : min), CRITERIA_META[0])

  function updateRow(id: string, text: string) {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, text } : r)))
  }
  function addRow() {
    setRows(prev => (prev.length < MAX_STEPS ? [...prev, { id: uid(), text: '' }] : prev))
  }
  function removeRow(id: string) {
    setRows(prev => (prev.length > MIN_STEPS ? prev.filter(r => r.id !== id) : prev))
    setAnnoyingId(cur => (cur === id ? null : cur))
  }
  function reset() {
    setStep('intro'); setProcess(''); setCustomProcess('')
    setScores({ predictability: 3, data: 3, complexity: 3, frequency: 3 }); setClassification(null)
    setRows(Array.from({ length: START_ROWS }, () => ({ id: uid(), text: '' }))); setAnnoyingId(null)
    setCaptureName(''); setCaptureEmail(''); setCaptureState('idle')
  }

  // WhatsApp message with the whole result pre-filled.
  const resultMessage = [
    "Hi Allan, here's my Pick Your Process result.",
    '',
    `Process: ${effectiveProcess}`,
    `Automation fit: ${automationFit} · AI potential: ${aiPotential}`,
    '',
    'Steps:',
    ...filledSteps.map((r, i) => `${i + 1}. ${r.text.trim()}${r.id === annoyingId ? '  <- annoys me most' : ''}`),
    '',
    "I'm interested in Cohort 2 on 24 October.",
  ].join('\n')
  const whatsappUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(resultMessage)}`

  async function submitCapture() {
    if (!annoyingStep || !classification || captureState === 'sending') return
    setCaptureState('sending')
    setCaptureError(null)
    try {
      const res = await fetch('/api/task-picker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: captureEmail,
          name: captureName || undefined,
          workflow: effectiveProcess,
          taskText: annoyingStep.text.trim(),
          steps: filledSteps.map(r => r.text.trim()),
          predictability: scores.predictability,
          dataAvailability: scores.data,
          complexity: scores.complexity,
          frequency: scores.frequency,
          classification,
          automationFit,
          aiPotential,
        }),
      })
      if (!res.ok) {
        let message = 'Something went wrong — try again, or use the buttons above.'
        try {
          const data = await res.json()
          if (data?.fields?.email) message = "That email address doesn't look right — check it and try again."
          else if (data?.fields?.name) message = 'That name is too long — shorten it and try again.'
          else if (data?.fields) message = "Something in that submission wasn't valid — try again, or use the buttons above."
        } catch { /* keep default message */ }
        setCaptureError(message)
        setCaptureState('error')
        return
      }
      setCaptureState('sent')
      track('task_picker_capture_submit', { ai_potential: aiPotential })
    } catch {
      setCaptureError('Something went wrong — try again, or use the buttons above.')
      setCaptureState('error')
    }
  }

  const steps: { key: typeof step; label: string }[] = [
    { key: 'process', label: 'Process' },
    { key: 'score', label: 'Score' },
    { key: 'steps', label: 'Steps' },
  ]
  const stepIndex = steps.findIndex(s => s.key === step)

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: 'var(--font)' }}>
      <div style={{ padding: '20px 24px' }}>
        <a href="/" style={{ color: C.white, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>&larr; Back to the workshop</a>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 24px 100px' }}>

        {step !== 'intro' && step !== 'result' && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 40 }}>
            {steps.map((s, i) => (
              <div key={s.key} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i <= stepIndex ? C.accent : C.border,
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
        )}

        {step === 'intro' && (
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 20px' }}>
              Pre-Work &middot; 5 Minutes
            </p>
            <h1 style={{ fontFamily: displayFont, fontSize: 'clamp(2.2rem, 6vw, 3rem)', fontWeight: 900, color: C.white, lineHeight: 1.08, margin: '0 0 20px', textWrap: 'balance' }}>
              Pick Your Process
            </h1>
            <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.7, maxWidth: 460, margin: '0 auto 12px' }}>
              Find the process worth fixing first, in 5 minutes.
            </p>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, maxWidth: 460, margin: '0 auto 36px' }}>
              This won&apos;t tell you what AI to buy. It&apos;s a structured way to think it through yourself — from Chapter 6 of <em style={{ fontStyle: 'normal', color: C.body }}>The AI Roadmap</em>.
            </p>
            <button onClick={() => setStep('process')} style={{
              display: 'inline-flex', alignItems: 'center', background: C.accent, color: C.white,
              padding: '16px 40px', borderRadius: 12, fontSize: 14, fontWeight: 800,
              border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              Start &rarr;
            </button>
          </div>
        )}

        {step === 'process' && (
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>Step 1</p>
            <h2 style={{ fontFamily: displayFont, fontSize: 'clamp(1.6rem, 4vw, 2.1rem)', fontWeight: 900, color: C.white, margin: '0 0 28px' }}>
              Which process needs fixing?
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {PROCESSES.map(w => (
                <button key={w} onClick={() => setProcess(w)} style={{
                  textAlign: 'left', padding: '16px 18px', borderRadius: 10, cursor: 'pointer',
                  background: process === w ? 'rgba(194,65,12,0.12)' : C.card,
                  border: `1.5px solid ${process === w ? C.accent : C.border}`,
                  color: C.white, fontSize: 15, fontWeight: process === w ? 700 : 500,
                }}>
                  {w}
                </button>
              ))}
            </div>
            {process === 'Something else' && (
              <input
                value={customProcess}
                onChange={e => setCustomProcess(e.target.value)}
                placeholder="e.g. Onboarding new suppliers"
                aria-label="Your process"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 10, marginBottom: 28,
                  background: C.sunk, border: `1px solid ${C.border}`, color: C.white, fontSize: 15,
                }}
              />
            )}
            <NavRow
              back={() => setStep('intro')}
              next={() => setStep('score')}
              nextDisabled={!effectiveProcess}
            />
          </div>
        )}

        {step === 'score' && (
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>Step 2</p>
            <h2 style={{ fontFamily: displayFont, fontSize: 'clamp(1.5rem, 3.6vw, 1.9rem)', fontWeight: 900, color: C.white, margin: '0 0 6px' }}>
              Score this process
            </h2>
            <p style={{ fontSize: 14, color: C.accentSoft, fontWeight: 600, margin: '0 0 28px' }}>
              &ldquo;{effectiveProcess}&rdquo;
            </p>

            {CRITERIA_META.map(c => (
              <div key={c.key} style={{ marginBottom: 26 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <span style={{ fontSize: 14.5, fontWeight: 700, color: C.white }}>{c.label}</span>
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, color: C.accentSoft, fontWeight: 700 }}>{scores[c.key]}/5</span>
                </div>
                <p style={{ fontSize: 12.5, color: C.muted, margin: '0 0 10px' }}>{c.help}</p>
                <input
                  type="range" min={1} max={5} step={1}
                  value={scores[c.key]}
                  onChange={e => setScores(prev => ({ ...prev, [c.key]: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: C.accent }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.muted, marginTop: 2 }}>
                  <span>{c.low}</span>
                  <span>{c.high}</span>
                </div>
              </div>
            ))}

            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, marginTop: 8, marginBottom: 28 }}>
              <p style={{ fontSize: 14.5, fontWeight: 700, color: C.white, margin: '0 0 12px' }}>
                One more question — the important one.
              </p>
              <p style={{ fontSize: 13.5, color: C.muted, margin: '0 0 14px', lineHeight: 1.6 }}>
                Is this the <strong style={{ color: C.body }}>same fixed response every time</strong>, or does it require <strong style={{ color: C.body }}>estimating something uncertain</strong>?
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={() => setClassification('fixed')} style={{
                  textAlign: 'left', padding: '14px 16px', borderRadius: 8, cursor: 'pointer',
                  background: classification === 'fixed' ? 'rgba(194,65,12,0.12)' : C.card,
                  border: `1.5px solid ${classification === 'fixed' ? C.accent : C.border}`,
                  color: C.white, fontSize: 14,
                }}>
                  A fixed rule — same trigger, same response, every time
                </button>
                <button onClick={() => setClassification('estimate')} style={{
                  textAlign: 'left', padding: '14px 16px', borderRadius: 8, cursor: 'pointer',
                  background: classification === 'estimate' ? 'rgba(194,65,12,0.12)' : C.card,
                  border: `1.5px solid ${classification === 'estimate' ? C.accent : C.border}`,
                  color: C.white, fontSize: 14,
                }}>
                  It requires judging or estimating something uncertain
                </button>
              </div>
            </div>

            <NavRow
              back={() => setStep('process')}
              next={() => setStep('steps')}
              nextDisabled={!classification}
            />
          </div>
        )}

        {step === 'steps' && (
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>Step 3</p>
            <h2 style={{ fontFamily: displayFont, fontSize: 'clamp(1.6rem, 4vw, 2.1rem)', fontWeight: 900, color: C.white, margin: '0 0 12px' }}>
              List it in 6&ndash;10 steps
            </h2>
            <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.6, margin: '0 0 8px' }}>
              What actually happens, step by step, inside &ldquo;{effectiveProcess}&rdquo;? One line each. Fewer than 6? Split a step in two.
            </p>
            <p style={{ fontSize: 14.5, color: C.body, lineHeight: 1.6, margin: '0 0 24px' }}>
              Then mark the step that annoys you most.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {rows.map((r, i) => (
                <div key={r.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: C.muted, width: 20, flexShrink: 0 }}>{i + 1}.</span>
                  <input
                    value={r.text}
                    onChange={e => updateRow(r.id, e.target.value)}
                    placeholder={i === 0 ? 'e.g. Customer enquiry arrives by email' : ''}
                    aria-label={`Step ${i + 1}`}
                    style={{
                      flex: 1, minWidth: 0, padding: '12px 14px', borderRadius: 8,
                      background: C.card, border: `1px solid ${annoyingId === r.id ? C.accent : C.border}`, color: C.white, fontSize: 14.5,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => r.text.trim() && setAnnoyingId(cur => (cur === r.id ? null : r.id))}
                    disabled={!r.text.trim()}
                    aria-pressed={annoyingId === r.id}
                    aria-label={`Mark step ${i + 1} as the one that annoys you most`}
                    title="Annoys me most"
                    style={{
                      flexShrink: 0, padding: '8px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 700,
                      letterSpacing: '0.03em', textTransform: 'uppercase', cursor: r.text.trim() ? 'pointer' : 'not-allowed',
                      background: annoyingId === r.id ? 'rgba(194,65,12,0.15)' : 'transparent',
                      border: `1px solid ${annoyingId === r.id ? C.accent : C.border}`,
                      color: annoyingId === r.id ? C.accentSoft : C.muted, opacity: r.text.trim() ? 1 : 0.4,
                    }}
                  >
                    {annoyingId === r.id ? 'Annoys me most' : 'Annoying?'}
                  </button>
                  {rows.length > MIN_STEPS && (
                    <button onClick={() => removeRow(r.id)} aria-label={`Remove step ${i + 1}`} style={{
                      background: 'none', border: 'none', color: C.muted, fontSize: 18, cursor: 'pointer', padding: 4,
                    }}>&times;</button>
                  )}
                </div>
              ))}
            </div>
            {rows.length < MAX_STEPS && (
              <button onClick={addRow} style={{
                background: 'none', border: `1px dashed ${C.border}`, color: C.accentSoft, fontSize: 13.5,
                fontWeight: 700, padding: '10px 16px', borderRadius: 8, cursor: 'pointer', marginBottom: 12,
              }}>
                + Add another step
              </button>
            )}
            <p style={{ fontSize: 12.5, color: C.muted, margin: '0 0 28px' }}>
              {filledSteps.length} of 6&ndash;10 steps{filledSteps.length > 0 && filledSteps.length < 6 ? ' (aim for 6 or more)' : ''}
              {annoyingStep ? '' : ' · mark the step that annoys you most to continue'}
            </p>
            <NavRow
              back={() => setStep('score')}
              next={() => {
                track('task_picker_result', { classification, automation_fit: automationFit, ai_potential: aiPotential, steps: filledSteps.length })
                setStep('result')
              }}
              nextDisabled={filledSteps.length < MIN_STEPS || !annoyingStep}
              nextLabel="See result"
            />
          </div>
        )}

        {step === 'result' && annoyingStep && (
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 20px' }}>Result</p>

            <div style={{
              background: '#fbfaf7', borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.35)', marginBottom: 28,
            }}>
              <div style={{ padding: '22px 26px', background: '#f2efe7', borderBottom: '1px solid #e5e2d9' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#9a9483', letterSpacing: '0.08em', margin: '0 0 8px' }}>YOUR PROCESS</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>{effectiveProcess}</p>
              </div>
              <div style={{ padding: '22px 26px', borderBottom: '1px solid #e5e2d9' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#9a9483', letterSpacing: '0.08em', margin: '0 0 12px' }}>YOUR STEPS</p>
                <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {filledSteps.map((r, i) => (
                    <li key={r.id} style={{ display: 'flex', gap: 10, alignItems: 'baseline', fontSize: 14, lineHeight: 1.5, color: '#1a1a1a', fontWeight: r.id === annoyingId ? 700 : 400 }}>
                      <span style={{ color: '#9a9483', width: 18, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{i + 1}.</span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        {r.text.trim()}
                        {r.id === annoyingId && (
                          <span style={{ marginLeft: 8, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#C2410C', whiteSpace: 'nowrap' }}>
                            Annoys you most
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
              <div style={{ padding: '22px 26px', display: 'flex', gap: 24, borderBottom: '1px solid #e5e2d9' }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#9a9483', letterSpacing: '0.06em', margin: '0 0 6px' }}>AUTOMATION FIT</p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>{automationFit}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#9a9483', letterSpacing: '0.06em', margin: '0 0 6px' }}>AI POTENTIAL</p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: aiPotential === 'Low' ? '#9a2e1f' : '#1a1a1a', margin: 0 }}>{aiPotential}</p>
                </div>
              </div>
              <div style={{ padding: '22px 26px' }}>
                <p style={{ fontSize: 13.5, color: '#4b4638', lineHeight: 1.65, margin: 0 }}>
                  {classification === 'fixed' ? (
                    <>This is a fixed rule, not a prediction — you don&apos;t need AI for it. A calendar or a simple script handles this fine. Try asking a probabilistic version of the same question instead: not &ldquo;did X happen?&rdquo; but &ldquo;how likely is X to happen without intervention?&rdquo; That reframing is usually where the real AI task is hiding.</>
                  ) : aiPotential === 'High' ? (
                    <>Strong candidate. It&apos;s predictable enough to learn, the data exists, it&apos;s not too complex, and it happens often enough to matter. This is worth bringing to the workshop.</>
                  ) : (
                    <>Possible, but not there yet — the blocker is <strong>{weakest.label.toLowerCase()}</strong> ({weakest.low.toLowerCase()}). Worth bringing anyway: the workshop can help you see exactly what would need to change, which is a legitimate outcome on its own.</>
                  )}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
              <a
                href="/checkout"
                onClick={() => {
                  track('cta_click', { location: 'task_picker_result', ai_potential: aiPotential })
                  track('join_click', { location: 'task_picker_result' })
                }}
                style={{
                  display: 'inline-flex', alignItems: 'center', background: C.accent, color: C.white,
                  padding: '15px 30px', borderRadius: 12, fontSize: 14, fontWeight: 800,
                  textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
                }}
              >
                Bring this to Cohort 2 on 24 October &rarr;
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('send_result_click', { ai_potential: aiPotential })}
                style={{
                  display: 'inline-flex', alignItems: 'center', background: 'none', color: C.white,
                  border: `1px solid ${C.accent}`, padding: '15px 30px', borderRadius: 12, fontSize: 14, fontWeight: 800,
                  textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
                }}
              >
                Send me your result
              </a>
            </div>
            <p style={{ margin: '0 0 40px' }}>
              <button onClick={() => { setStep('process'); setProcess(''); setCustomProcess('') }} style={{
                background: 'none', border: 'none', color: C.muted, fontSize: 13.5, textDecoration: 'underline', cursor: 'pointer', padding: 0,
              }}>
                Try another process
              </button>
            </p>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '20px 22px', marginBottom: 28 }}>
              {captureState === 'sent' ? (
                <p style={{ fontSize: 14, color: C.white, margin: 0 }}>
                  Saved — we&apos;ll follow up before 24 October if it&apos;s useful.
                </p>
              ) : (
                <>
                  <p style={{ fontSize: 14, fontWeight: 700, color: C.white, margin: '0 0 4px' }}>
                    Want us to save this and follow up before 24 October?
                  </p>
                  <p style={{ fontSize: 12.5, color: C.muted, margin: '0 0 14px' }}>
                    Optional. The buttons above work without this.
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <input
                      value={captureName}
                      onChange={e => setCaptureName(e.target.value)}
                      placeholder="Name (optional)"
                      style={{
                        flex: '1 1 140px', padding: '11px 12px', borderRadius: 8,
                        background: C.sunk, border: `1px solid ${C.border}`, color: C.white, fontSize: 13.5,
                      }}
                    />
                    <input
                      value={captureEmail}
                      onChange={e => setCaptureEmail(e.target.value)}
                      placeholder="you@company.com"
                      type="email"
                      style={{
                        flex: '2 1 200px', padding: '11px 12px', borderRadius: 8,
                        background: C.sunk, border: `1px solid ${C.border}`, color: C.white, fontSize: 13.5,
                      }}
                    />
                    <button
                      onClick={submitCapture}
                      disabled={!captureEmail.trim() || captureState === 'sending'}
                      style={{
                        background: C.accent, color: C.white, border: 'none', borderRadius: 8,
                        padding: '11px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        opacity: !captureEmail.trim() || captureState === 'sending' ? 0.5 : 1,
                        flexShrink: 0,
                      }}
                    >
                      {captureState === 'sending' ? 'Saving…' : 'Save it'}
                    </button>
                  </div>
                  {captureState === 'error' && (
                    <p style={{ fontSize: 12.5, color: C.accentSoft, margin: '10px 0 0' }}>
                      {captureError || 'Something went wrong — try again, or just register directly above.'}
                    </p>
                  )}
                </>
              )}
            </div>

            <button onClick={reset} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 13, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>
              Start over with a different process
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function NavRow({ back, next, nextDisabled, nextLabel }: { back: () => void; next: () => void; nextDisabled?: boolean; nextLabel?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <button onClick={back} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 14, cursor: 'pointer', padding: '10px 0' }}>
        &larr; Back
      </button>
      <button onClick={next} disabled={nextDisabled} style={{
        display: 'inline-flex', alignItems: 'center', background: nextDisabled ? C.card : C.accent,
        color: nextDisabled ? C.muted : C.white, padding: '14px 30px', borderRadius: 10,
        fontSize: 14, fontWeight: 800, border: 'none', cursor: nextDisabled ? 'not-allowed' : 'pointer',
        textTransform: 'uppercase', letterSpacing: '0.04em', opacity: nextDisabled ? 0.6 : 1,
      }}>
        {nextLabel || 'Continue'} &rarr;
      </button>
    </div>
  )
}
