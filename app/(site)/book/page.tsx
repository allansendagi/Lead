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
    icon: '🏢',
    title: 'Built for SMEs, not tech giants',
    desc: 'Every example, checklist, and metric is sized for real-world budgets and teams.',
  },
  {
    icon: '🗺️',
    title: '10-Step Navigator System',
    desc: 'A proven framework that moves you from vague ideas to a phased plan you can execute tomorrow.',
  },
  {
    icon: '⚙️',
    title: 'Workflows before widgets',
    desc: 'Streamline processes first, then add AI where it delivers measurable ROI.',
  },
  {
    icon: '🔍',
    title: 'Tools without the hype',
    desc: 'A 2×2 matrix shows exactly which AI software you need — and which shiny demos to ignore.',
  },
  {
    icon: '📋',
    title: 'Action-ready templates',
    desc: 'Strategic Vision Canvas, AI Task Canvas, Implementation Plan, and more — all in the companion app.',
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
  { title: 'Functional Leaders', desc: 'Tasked with "figuring out the AI part" for your department or organisation.' },
  { title: 'Consultants & Advisors', desc: 'Who need a repeatable, client-ready AI implementation framework.' },
  { title: 'MBA & Executive Students', desc: 'Seeking a pragmatic playbook grounded in real business outcomes.' },
]

export default function BookPage() {
  const linkedInUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/allansendagi/'

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '64px 24px 80px',
        display: 'flex',
        alignItems: 'center',
        gap: 60,
        flexWrap: 'wrap',
      }}>
        {/* Book cover */}
        <div style={{
          flex: '0 0 auto',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 320,
        }} className="book-cover-col">
          <div style={{
            perspective: '800px',
            display: 'inline-block',
          }}>
            <img
              src="/book-cover.png"
              alt="The AI Roadmap book cover"
              style={{
                width: 280,
                maxWidth: '100%',
                borderRadius: 6,
                boxShadow: '0 30px 60px rgba(0,0,0,0.22), 0 8px 20px rgba(0,0,0,0.12)',
                transform: 'rotateY(-8deg) rotateX(2deg)',
                display: 'block',
              }}
            />
          </div>
        </div>

        {/* Right copy */}
        <div style={{ flex: '1 1 320px' }}>
          <span style={{
            display: 'inline-block',
            background: '#EFF6FF',
            color: '#2563EB',
            fontSize: 13,
            fontWeight: 600,
            padding: '5px 12px',
            borderRadius: 20,
            marginBottom: 18,
            letterSpacing: '0.02em',
          }}>
            Now on Amazon
          </span>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.1, margin: '0 0 12px', color: '#111827' }}>
            The AI Roadmap
          </h1>
          <p style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>
            Implement AI Profitably in 10 Steps with the AI Navigator System
          </p>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 24px' }}>
            Practical Guidance for Small &amp; Mid-Sized Businesses
          </p>

          {/* Stars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
            <span style={{ color: '#F59E0B', fontSize: 20, letterSpacing: 2 }}>★★★★★</span>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>5.0</span>
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
              gap: 8,
              background: '#1C1714',
              color: '#fff',
              padding: '15px 28px',
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
              textDecoration: 'none',
              marginBottom: 14,
            }}
          >
            Buy on Amazon →
          </a>

          <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
            Includes 30-day access to the AI Navigator app
          </p>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section style={{
        background: '#F8FAFC',
        borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb',
        padding: '52px 24px',
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 64, lineHeight: 1, color: '#2563EB', marginBottom: 4, fontFamily: 'Georgia, serif' }}>"</div>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            lineHeight: 1.75,
            color: '#374151',
            fontStyle: 'italic',
            margin: '0 0 24px',
          }}>
            Allan Sendagi delivers a clear, real-world framework for AI implementation that bridges
            the gap between strategy and execution. Highly recommended for leaders ready to move
            beyond the hype and deploy AI with precision.
          </p>
          <p style={{ fontWeight: 700, fontSize: 15, color: '#111827', margin: '0 0 2px' }}>
            Akmaral Shamenova
          </p>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
            Operations Leader (20 yrs) · M.Sc. Blockchain &amp; Digital Currencies
          </p>
        </div>
      </section>

      {/* ── What makes it different ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 24px' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, textAlign: 'center', marginBottom: 8, color: '#111827' }}>
          What makes it different
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 16, marginBottom: 48 }}>
          Most AI books are written for enterprises with unlimited budgets. This one is not.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24,
        }}>
          {differentiators.map(d => (
            <div key={d.title} style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: '28px 24px',
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{d.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>{d.title}</h3>
              <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What you'll learn ── */}
      <section style={{ background: '#F8FAFC', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '72px 24px' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, textAlign: 'center', marginBottom: 48, color: '#111827' }}>
            What you&apos;ll learn
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px 40px',
          }}>
            {learnings.map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{
                  flexShrink: 0,
                  width: 22,
                  height: 22,
                  background: '#2563EB',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  marginTop: 2,
                }}>✓</span>
                <p style={{ fontSize: 15, color: '#374151', margin: 0, lineHeight: 1.6 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 24px' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, textAlign: 'center', marginBottom: 48, color: '#111827' }}>
          Who this book is for
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
        }}>
          {audiences.map(a => (
            <div key={a.title} style={{
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: '28px 24px',
              borderTop: '3px solid #2563EB',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 10px' }}>{a.title}</h3>
              <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Author bio ── */}
      <section style={{
        background: '#F8FAFC',
        borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb',
        padding: '72px 24px',
      }}>
        <div style={{
          maxWidth: 880,
          margin: '0 auto',
          display: 'flex',
          gap: 48,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}>
          <div style={{
            flexShrink: 0,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            color: '#9ca3af',
          }}>
            Photo
          </div>
          <div style={{ flex: '1 1 280px' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>About the author</p>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>Allan Sendagi</h2>
            <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.75, margin: '0 0 12px' }}>
              Allan Sendagi is the founder of SafeHaven, an organisation dedicated to helping
              businesses and society adapt effectively to the Intelligence Age. Through initiatives
              like AI TownSquare, SafeHaven develops insights and tools focused on practical
              readiness.
            </p>
            <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.75, margin: '0 0 20px' }}>
              Allan distils this work into actionable frameworks — including the AI Navigator System
              detailed in this book — used by entrepreneurs, SMEs, and executives globally to
              navigate AI disruption and implement solutions with clarity, confidence, and impact.
            </p>
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 14, color: '#1C1714', fontWeight: 600, textDecoration: 'none' }}
            >
              Connect on LinkedIn →
            </a>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{
        background: '#1C1714',
        padding: '72px 24px',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>
          Ready to build your AI roadmap?
        </h2>
        <p style={{ color: '#9ca3af', fontSize: 16, margin: '0 0 36px' }}>
          If you can follow a roadmap, you can lead your business into the future — profitably.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href={amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#fff',
              color: '#1C1714',
              padding: '15px 28px',
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Buy on Amazon →
          </a>
          <a
            href="/"
            style={{
              background: 'transparent',
              color: '#fff',
              padding: '15px 28px',
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: 'none',
              border: '1.5px solid rgba(255,255,255,0.3)',
            }}
          >
            Take the free AI Readiness Assessment →
          </a>
        </div>
      </section>
    </div>
  )
}
