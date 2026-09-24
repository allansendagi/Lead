'use client'
import { useState } from 'react'

const C = {
  bg: '#080808', card: '#161513', sunk: '#0c0c0c', border: 'rgba(245,241,234,0.12)',
  accent: '#C2410C', accentSoft: '#E8823D', white: '#F5F1EA', muted: '#A39C90', body: '#D8D2C6',
}

const WORKFLOWS = ['Customer follow-up', 'Reporting', 'Invoice processing', 'Hiring', 'Something else']

type TaskRow = { id: string; text: string; keep: boolean }

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

export default function TaskFitContents({ displayFont }: { displayFont: string }) {
  const [step, setStep] = useState<'intro' | 'workflow' | 'tasks' | 'delete' | 'pick' | 'score' | 'result'>('intro')
  const [workflow, setWorkflow] = useState('')
  const [customWorkflow, setCustomWorkflow] = useState('')
  const [tasks, setTasks] = useState<TaskRow[]>([{ id: uid(), text: '', keep: true }])
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [scores, setScores] = useState<Criteria>({ predictability: 3, data: 3, complexity: 3, frequency: 3 })
  const [classification, setClassification] = useState<'fixed' | 'estimate' | null>(null)

  const effectiveWorkflow = workflow === 'Something else' ? customWorkflow : workflow
  const keptTasks = tasks.filter(t => t.keep && t.text.trim())
  const selectedTask = keptTasks.find(t => t.id === selectedTaskId) || null

  const avg = (scores.predictability + scores.data + scores.complexity + scores.frequency) / 4
  const automationFit = band(avg)
  const aiPotential: 'High' | 'Medium' | 'Low' = classification === 'fixed' ? 'Low' : band(avg)

  const weakest = CRITERIA_META.reduce((min, c) => (scores[c.key] < scores[min.key] ? c : min), CRITERIA_META[0])

  function updateTask(id: string, text: string) {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, text } : t)))
  }
  function toggleKeep(id: string) {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, keep: !t.keep } : t)))
  }
  function addTask() {
    setTasks(prev => [...prev, { id: uid(), text: '', keep: true }])
  }
  function removeTaskRow(id: string) {
    setTasks(prev => (prev.length > 1 ? prev.filter(t => t.id !== id) : prev))
  }
  function selectTask(id: string | null) {
    setSelectedTaskId(id)
    setScores({ predictability: 3, data: 3, complexity: 3, frequency: 3 })
    setClassification(null)
  }
  function reset() {
    setStep('intro'); setWorkflow(''); setCustomWorkflow('')
    setTasks([{ id: uid(), text: '', keep: true }]); setSelectedTaskId(null)
    setScores({ predictability: 3, data: 3, complexity: 3, frequency: 3 }); setClassification(null)
  }

  const steps: { key: typeof step; label: string }[] = [
    { key: 'workflow', label: 'Workflow' },
    { key: 'tasks', label: 'Tasks' },
    { key: 'delete', label: 'Keep / Remove' },
    { key: 'pick', label: 'Pick one' },
    { key: 'score', label: 'Score' },
  ]
  const stepIndex = steps.findIndex(s => s.key === step)

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: 'var(--font)' }}>
      <div style={{ background: C.accent, color: C.white, textAlign: 'center', padding: '10px 16px', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>
        LAUNCH COHORT &middot; 10 PARTICIPANTS
      </div>
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
              Pick Your Task
            </h1>
            <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.7, maxWidth: 460, margin: '0 auto 12px' }}>
              Find one business task worth pressure-testing — before you spend 2.5 hours building the wrong Canvas.
            </p>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, maxWidth: 460, margin: '0 auto 36px' }}>
              This won&apos;t tell you what AI to buy. It&apos;s a structured way to think it through yourself — from Chapter 6 of <em style={{ fontStyle: 'normal', color: C.body }}>The AI Roadmap</em>.
            </p>
            <button onClick={() => setStep('workflow')} style={{
              display: 'inline-flex', alignItems: 'center', background: C.accent, color: C.white,
              padding: '16px 40px', borderRadius: 12, fontSize: 14, fontWeight: 800,
              border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              Start &rarr;
            </button>
          </div>
        )}

        {step === 'workflow' && (
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>Step 1</p>
            <h2 style={{ fontFamily: displayFont, fontSize: 'clamp(1.6rem, 4vw, 2.1rem)', fontWeight: 900, color: C.white, margin: '0 0 28px' }}>
              What workflow needs improving?
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {WORKFLOWS.map(w => (
                <button key={w} onClick={() => setWorkflow(w)} style={{
                  textAlign: 'left', padding: '16px 18px', borderRadius: 10, cursor: 'pointer',
                  background: workflow === w ? 'rgba(194,65,12,0.12)' : C.card,
                  border: `1.5px solid ${workflow === w ? C.accent : C.border}`,
                  color: C.white, fontSize: 15, fontWeight: workflow === w ? 700 : 500,
                }}>
                  {w}
                </button>
              ))}
            </div>
            {workflow === 'Something else' && (
              <input
                value={customWorkflow}
                onChange={e => setCustomWorkflow(e.target.value)}
                placeholder="e.g. Onboarding new suppliers"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 10, marginBottom: 28,
                  background: C.sunk, border: `1px solid ${C.border}`, color: C.white, fontSize: 15,
                }}
              />
            )}
            <NavRow
              back={() => setStep('intro')}
              next={() => setStep('tasks')}
              nextDisabled={!effectiveWorkflow.trim()}
            />
          </div>
        )}

        {step === 'tasks' && (
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>Step 2</p>
            <h2 style={{ fontFamily: displayFont, fontSize: 'clamp(1.6rem, 4vw, 2.1rem)', fontWeight: 900, color: C.white, margin: '0 0 12px' }}>
              Break it into tasks
            </h2>
            <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.6, margin: '0 0 24px' }}>
              What actually happens, step by step, inside &ldquo;{effectiveWorkflow || 'this workflow'}&rdquo;? One action per line.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {tasks.map((t, i) => (
                <div key={t.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: C.muted, width: 20, flexShrink: 0 }}>{i + 1}.</span>
                  <input
                    value={t.text}
                    onChange={e => updateTask(t.id, e.target.value)}
                    placeholder="e.g. Send reminder if not completed"
                    style={{
                      flex: 1, padding: '12px 14px', borderRadius: 8,
                      background: C.card, border: `1px solid ${C.border}`, color: C.white, fontSize: 14.5,
                    }}
                  />
                  {tasks.length > 1 && (
                    <button onClick={() => removeTaskRow(t.id)} aria-label="Remove" style={{
                      background: 'none', border: 'none', color: C.muted, fontSize: 18, cursor: 'pointer', padding: 4,
                    }}>&times;</button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={addTask} style={{
              background: 'none', border: `1px dashed ${C.border}`, color: C.accentSoft, fontSize: 13.5,
              fontWeight: 700, padding: '10px 16px', borderRadius: 8, cursor: 'pointer', marginBottom: 28,
            }}>
              + Add another task
            </button>
            <NavRow
              back={() => setStep('workflow')}
              next={() => setStep('delete')}
              nextDisabled={tasks.filter(t => t.text.trim()).length === 0}
            />
          </div>
        )}

        {step === 'delete' && (
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>Step 3</p>
            <h2 style={{ fontFamily: displayFont, fontSize: 'clamp(1.6rem, 4vw, 2.1rem)', fontWeight: 900, color: C.white, margin: '0 0 12px' }}>
              Remove what doesn&apos;t belong
            </h2>
            <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.6, margin: '0 0 24px' }}>
              For each one — is this task actually necessary? Don&apos;t score anything that shouldn&apos;t exist in the first place.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
              {tasks.filter(t => t.text.trim()).map(t => (
                <div key={t.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 16px', borderRadius: 8, background: C.card, border: `1px solid ${C.border}`,
                  opacity: t.keep ? 1 : 0.45,
                }}>
                  <span style={{ fontSize: 14.5, color: C.white, textDecoration: t.keep ? 'none' : 'line-through' }}>{t.text}</span>
                  <button onClick={() => toggleKeep(t.id)} style={{
                    background: t.keep ? 'rgba(194,65,12,0.15)' : 'transparent',
                    border: `1px solid ${t.keep ? C.accent : C.border}`,
                    color: t.keep ? C.accentSoft : C.muted, fontSize: 11.5, fontWeight: 700,
                    letterSpacing: '0.04em', textTransform: 'uppercase', padding: '6px 12px',
                    borderRadius: 20, cursor: 'pointer', flexShrink: 0, marginLeft: 12,
                  }}>
                    {t.keep ? 'Keep' : 'Removed'}
                  </button>
                </div>
              ))}
            </div>
            <NavRow
              back={() => setStep('tasks')}
              next={() => { selectTask(keptTasks[0]?.id ?? null); setStep(keptTasks.length > 1 ? 'pick' : 'score') }}
              nextDisabled={keptTasks.length === 0}
            />
          </div>
        )}

        {step === 'pick' && (
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>Step 4</p>
            <h2 style={{ fontFamily: displayFont, fontSize: 'clamp(1.6rem, 4vw, 2.1rem)', fontWeight: 900, color: C.white, margin: '0 0 12px' }}>
              Which one first?
            </h2>
            <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.6, margin: '0 0 24px' }}>
              You kept {keptTasks.length}. Score them one at a time — pick the one you&apos;re most curious about.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {keptTasks.map(t => (
                <button key={t.id} onClick={() => selectTask(t.id)} style={{
                  textAlign: 'left', padding: '16px 18px', borderRadius: 10, cursor: 'pointer',
                  background: selectedTaskId === t.id ? 'rgba(194,65,12,0.12)' : C.card,
                  border: `1.5px solid ${selectedTaskId === t.id ? C.accent : C.border}`,
                  color: C.white, fontSize: 15, fontWeight: selectedTaskId === t.id ? 700 : 500,
                }}>
                  {t.text}
                </button>
              ))}
            </div>
            <NavRow back={() => setStep('delete')} next={() => setStep('score')} nextDisabled={!selectedTaskId} />
          </div>
        )}

        {step === 'score' && (
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>Step 5</p>
            <h2 style={{ fontFamily: displayFont, fontSize: 'clamp(1.5rem, 3.6vw, 1.9rem)', fontWeight: 900, color: C.white, margin: '0 0 6px' }}>
              Score it
            </h2>
            <p style={{ fontSize: 14, color: C.accentSoft, fontWeight: 600, margin: '0 0 28px' }}>
              &ldquo;{selectedTask?.text}&rdquo;
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
              back={() => setStep(keptTasks.length > 1 ? 'pick' : 'delete')}
              next={() => setStep('result')}
              nextDisabled={!classification}
              nextLabel="See result"
            />
          </div>
        )}

        {step === 'result' && selectedTask && (
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 20px' }}>Result</p>

            <div style={{
              background: '#fbfaf7', borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.35)', marginBottom: 28,
            }}>
              <div style={{ padding: '22px 26px', background: '#f2efe7', borderBottom: '1px solid #e5e2d9' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#9a9483', letterSpacing: '0.08em', margin: '0 0 8px' }}>YOUR TASK</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>{selectedTask.text}</p>
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

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 40 }}>
              <a href="/checkout" style={{
                display: 'inline-flex', alignItems: 'center', background: C.accent, color: C.white,
                padding: '15px 30px', borderRadius: 12, fontSize: 14, fontWeight: 800,
                textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
              }}>
                Bring this task to the workshop &rarr;
              </a>
              <button onClick={() => { selectTask(null); setStep(keptTasks.length > 1 ? 'pick' : 'delete') }} style={{
                background: 'none', border: `1px solid ${C.border}`, color: C.muted,
                padding: '15px 24px', borderRadius: 12, fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
              }}>
                Try another task
              </button>
            </div>

            <button onClick={reset} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 13, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>
              Start over with a different workflow
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
