import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The AI Roadmap — Book by Allan Sendagi',
  description:
    'Implement AI profitably in 10 steps. Practical guidance for SMEs with downloadable templates and 30-day access to the AI Navigator app. Available on Amazon.',
  alternates: { canonical: 'https://www.ainavsystem.com/book/' },
}

const amazonUrl = process.env.NEXT_PUBLIC_AMAZON_BOOK_URL || 'https://www.amazon.com/dp/B0F3SY3CVK'

const differentiators = [
  {
    title: 'Built for SMEs',
    desc: 'Every example, checklist, and metric is sized for real-world budgets and teams — not enterprise IT departments.',
  },
  {
    title: '10-Step Navigator System',
    desc: 'A proven sequence that moves you from vague intent to a phased implementation plan you can execute tomorrow.',
  },
  {
    title: 'Workflows before widgets',
    desc: 'Streamline your processes first, then add AI exactly where it delivers measurable ROI.',
  },
  {
    title: 'Tools without the hype',
    desc: 'A 2×2 matrix cuts through the noise and shows exactly which category of AI software your situation calls for.',
  },
  {
    title: 'Action-ready templates',
    desc: 'Strategic Vision Canvas, AI Task Canvas, Implementation Plan, and more — all in the 30-day companion app.',
  },
]

const learnings = [
  'Define a business-aligned AI vision in plain English.',
  'Assess your true readiness across data, people, and processes.',
  'Choose an Evolutionary or Revolutionary strategy for your risk tolerance.',
  'Deconstruct workflows, score AI potential, and prioritise quick wins.',
  'Map an optimised process that keeps humans in the loop where it counts.',
  'Select the right AI tools with clear criteria — no buzzword bingo.',
  'Build a phased implementation plan with budgets, metrics, and risk mitigations.',
  'Launch, monitor, and iterate for continuous value creation.',
]

const audiences = [
  { title: 'CEOs, COOs & Founders', desc: 'Of small & mid-sized businesses ready to move beyond the hype.' },
  { title: 'Functional Leaders', desc: 'Tasked with "figuring out the AI part" for your department.' },
  { title: 'Consultants & Advisors', desc: 'Who need a repeatable, client-ready AI implementation framework.' },
  { title: 'MBA & Executive Students', desc: 'Seeking a pragmatic playbook grounded in real business outcomes.' },
]

const phases = [
  {
    label: 'Phase 1 — Readiness',
    steps: ['Define your AI vision', 'Assess readiness across data, people & process', 'Choose your implementation strategy'],
  },
  {
    label: 'Phase 2 — Design',
    steps: ['Deconstruct your workflows', 'Score AI potential & prioritise', 'Map the optimised future-state process', 'Select the right AI tools'],
  },
  {
    label: 'Phase 3 — Deploy',
    steps: ['Build your phased implementation plan', 'Launch with budgets, metrics & risk controls', 'Monitor, iterate, and compound value over time'],
  },
]

export default function BookPage() {
  return (
    <div style={{ color: '#111827' }}>

      {/* ── Hero ── */}
      <section style={{ maxWidth: 1060, margin: '0 auto', padding: '64px 24px 72px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 56, flexWrap: 'wrap' }}>

          {/* Cover */}
          <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', width: '100%', maxWidth: 300 }}>
            <img
              src="/book-cover.png"
              alt="The AI Roadmap book cover"
              style={{
                width: 260,
                maxWidth: '100%',
                borderRadius: 6,
                boxShadow: '0 24px 48px rgba(0,0,0,0.18), 0 6px 16px rgba(0,0,0,0.1)',
                transform: 'rotateY(-6deg) rotateX(1deg)',
                display: 'block',
              }}
            />
          </div>

          {/* Copy */}
          <div style={{ flex: '1 1 300px' }}>
            <span style={{
              display: 'inline-block',
              background: '#EFF6FF',
              color: '#2563EB',
              fontSize: 12,
              fontWeight: 600,
              padding: '4px 12px',
              borderRadius: 20,
              marginBottom: 20,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              Now on Amazon
            </span>

            <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', fontWeight: 800, lineHeight: 1.1, margin: '0 0 10px' }}>
              The AI Roadmap
            </h1>
            <p style={{ fontSize: 17, fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>
              Implement AI Profitably in 10 Steps with the AI Navigator System
            </p>
            <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 28px' }}>
              Practical Guidance for Small &amp; Mid-Sized Businesses
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
              <span style={{ color: '#F59E0B', fontSize: 18, letterSpacing: 2 }}>★★★★★</span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>5.0</span>
              <a
                href={amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 13, color: '#6b7280', textDecoration: 'underline' }}
              >
                (1 review on Amazon)
              </a>
            </div>

            <a
              href={amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: '#1C1714',
                color: '#fff',
                padding: '14px 28px',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: 'none',
                marginBottom: 12,
              }}
            >
              Buy on Amazon →
            </a>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
              Includes 30-day access to the AI Navigator companion app
            </p>
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section style={{ borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '52px 24px', background: '#FAFAFA' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 56, lineHeight: 1, color: '#2563EB', marginBottom: 2, fontFamily: 'Georgia, serif' }}>"</div>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', lineHeight: 1.8, color: '#374151', fontStyle: 'italic', margin: '0 0 20px' }}>
            Allan Sendagi delivers a clear, real-world framework for AI implementation that bridges
            the gap between strategy and execution. Highly recommended for leaders ready to move
            beyond the hype and deploy AI with precision.
          </p>
          <p style={{ fontWeight: 700, fontSize: 14, margin: '0 0 2px' }}>Akmaral Shamenova</p>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Operations Leader (20 yrs) · M.Sc. Blockchain &amp; Digital Currencies</p>
        </div>
      </section>

      {/* ── What makes it different ── */}
      <section style={{ maxWidth: 1060, margin: '0 auto', padding: '72px 24px' }}>
        <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', fontWeight: 800, textAlign: 'center', margin: '0 0 12px' }}>
          What makes it different
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 15, margin: '0 0 48px' }}>
          Most AI books are written for enterprises with unlimited budgets. This one is not.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {differentiators.map(d => (
            <div key={d.title} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '24px 20px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px' }}>{d.title}</h3>
              <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.65 }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── The 10-Step Framework ── */}
      <section style={{ borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '72px 24px', background: '#FAFAFA' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', fontWeight: 800, textAlign: 'center', margin: '0 0 12px' }}>
            The 10-Step Navigator System
          </h2>
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 15, margin: '0 0 48px' }}>
            A structured sequence from zero clarity to a live AI system — in three phases.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {phases.map((phase, i) => (
              <div key={phase.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '28px 24px', borderTop: `3px solid #2563EB` }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
                  Phase {i + 1}
                </p>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>{phase.label.split('— ')[1]}</h3>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {phase.steps.map(step => (
                    <li key={step} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ flexShrink: 0, width: 18, height: 18, background: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', fontSize: 10, fontWeight: 700, marginTop: 2 }}>✓</span>
                      <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.55 }}>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What you'll learn ── */}
      <section style={{ maxWidth: 1060, margin: '0 auto', padding: '72px 24px' }}>
        <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', fontWeight: 800, textAlign: 'center', margin: '0 0 48px' }}>
          What you&apos;ll learn
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px 40px' }}>
          {learnings.map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ flexShrink: 0, width: 20, height: 20, background: '#1C1714', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700, marginTop: 3 }}>✓</span>
              <p style={{ fontSize: 15, color: '#374151', margin: 0, lineHeight: 1.65 }}>{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section style={{ borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '72px 24px', background: '#FAFAFA' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', fontWeight: 800, textAlign: 'center', margin: '0 0 48px' }}>
            Who this book is for
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {audiences.map(a => (
              <div key={a.title} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '24px 20px', background: '#fff' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px' }}>{a.title}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.65 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ background: '#1C1714', padding: '72px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', fontWeight: 800, color: '#fff', margin: '0 0 10px' }}>
          Ready to build your AI roadmap?
        </h2>
        <p style={{ color: '#9ca3af', fontSize: 15, margin: '0 0 36px' }}>
          If you can follow a roadmap, you can lead your business into the future — profitably.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href={amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: '#fff', color: '#1C1714', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}
          >
            Buy on Amazon →
          </a>
          <a
            href="/"
            style={{ background: 'transparent', color: '#fff', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.25)' }}
          >
            Take the free AI Readiness Assessment →
          </a>
        </div>
      </section>

    </div>
  )
}
