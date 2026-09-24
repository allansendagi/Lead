import type { Metadata } from 'next'
import Script from 'next/script'
import { Fraunces, Inter } from 'next/font/google'
import Countdown from '@/components/Countdown'
import ScrollScaleVideo from '@/components/ScrollScaleVideo'
import MobileNav from '@/components/MobileNav'
import { faqSchema } from '@/lib/schema'

const fraunces = Fraunces({ subsets: ['latin'], weight: ['600', '700', '900'], style: ['normal', 'italic'] })
const inter = Inter({ subsets: ['latin'] })
const bodyFont = inter.style.fontFamily

export const metadata: Metadata = {
  title: 'The AI Value Creation Sandbox — Live Workshop',
  description:
    'A hands-on workshop for turning your highest-potential AI idea into a precise, buildable specification — using the AI Task Canvas. Hosted live by Allan Sendagi, author of The AI Roadmap.',
  alternates: { canonical: 'https://www.ainavsystem.com/' },
}

// ── Editable event details — fill these in once confirmed ──────────────────
const WORKSHOP_DATE = 'October 3, 2026'
const WORKSHOP_TIME = '10:00 AM Doha (GMT+3) / 11:00 AM Dubai (GMT+4)'
const WORKSHOP_DEADLINE = '2026-10-03T10:00:00+03:00'

// ── Editorial Authority palette — black kept, one deliberate accent ────────
const C = {
  bg: '#080808',
  card: '#161513',
  border: 'rgba(245,241,234,0.12)',
  accent: '#C2410C',
  accentSoft: '#E8823D',
  white: '#F5F1EA',
  muted: '#A39C90',
  body: '#D8D2C6',
}

const tickerItems = [
  'REAL BUSINESS TASK', "AI'S ROLE", 'HUMAN JUDGMENT',
  'REQUIRED DATA', 'FEEDBACK', 'MEASURABLE OUTCOME',
]

const stats = [
  { n: '1', label: 'LIVE WORKSHOP' },
  { n: '2.5', label: 'HOURS' },
  { n: '7', label: 'AI TASK ELEMENTS' },
  { n: '1+', label: 'COMPLETED CANVAS' },
  { n: '10', label: 'PARTICIPANTS' },
]

const personas = [
  {
    num: '01',
    tag: 'The AI Experimenter',
    title: "Your organisation is using AI, but you're not sure where it's creating value.",
    desc: 'Your teams are using ChatGPT, Copilot, agents and other AI tools. But usage is growing faster than your ability to identify which work should actually change.',
  },
  {
    num: '02',
    tag: 'The Strategy Leader',
    title: 'You need to move from AI ideas to specific organisational priorities.',
    desc: 'You hear AI use cases everywhere. What you need is a way to identify the actual tasks worth changing — and determine what success should look like.',
  },
  {
    num: '03',
    tag: 'The Transformation Leader',
    title: "You don't need another AI presentation. You need something you can work on.",
    desc: "You have a real process, task or workflow where AI could make a difference. You want to take one of them apart, define AI's role, and leave with something concrete.",
  },
]

const walkAwayItems = [
  { title: 'One real business task', desc: 'Clearly scoped and ready to work on.' },
  { title: 'One completed AI Task Canvas', desc: 'Mapping the action, prediction, judgment, inputs, training data, feedback, and outcome.' },
  { title: 'A defined role for AI', desc: 'What AI should do, what it should not do, and where human judgment remains.' },
  { title: 'A measurable outcome', desc: 'How you will know whether the intervention actually improves the work.' },
  { title: 'A next step', desc: 'What to test, with what data, and what to measure.' },
  { title: 'A build-ready specification', desc: 'Precise enough to brief a developer, vendor, or AI coding agent — without losing the business intent between strategy and build.' },
]

const canvasElements = [
  { n: '1', title: 'Action', def: 'The higher-level business activity this AI task supports.', example: 'e.g. "Send personalized follow-up messages after appointments."' },
  { n: '2', title: 'Prediction', def: 'The exact prediction, classification, or forecast the AI needs to make.', example: 'e.g. "Predict the likelihood a customer leaves feedback without a reminder."' },
  { n: '3', title: 'Judgment', def: 'The value of each outcome, the cost of each error, and the decision rule that follows.', example: 'e.g. "Send a reminder if predicted feedback likelihood is under 40%."' },
  { n: '4', title: 'Input', def: 'The real-time data the AI needs at the moment it makes the prediction.', example: 'e.g. "Customer ID, last visit date, service type, feedback history."' },
  { n: '5', title: 'Training Data', def: "The historical data needed to build, configure, or evaluate the AI's prediction.", example: 'e.g. "Past appointments, whether feedback was left, reminders sent."' },
  { n: '6', title: 'Feedback', def: 'How the system learns from real outcomes to improve future predictions.', example: 'e.g. "Track whether reminder recipients actually left feedback."' },
  { n: '7', title: 'Outcome', def: 'The measurable result that tells you whether the task is actually creating value.', example: 'e.g. "Increase feedback completion rate without increasing reminder volume."' },
]

const OUTPUT_TASK = 'Send personalized follow-up messages to patients after appointments.'

const outputExample = [
  { n: '01', title: 'Action', question: 'What are we trying to accomplish?', answer: 'Send personalized follow-up messages to patients after appointments.' },
  { n: '02', title: 'Prediction', question: 'What does AI need to predict?', answer: 'Predict the likelihood that a patient will leave feedback without a reminder.' },
  { n: '03', title: 'Judgment', question: 'How does the prediction change the decision?', answer: 'Send a reminder if predicted feedback likelihood is below 40%.' },
  { n: '04', title: 'Input', question: 'What does AI need at the moment of prediction?', answer: 'Patient ID · Last appointment date · Service type · Prior feedback history' },
  { n: '05', title: 'Training Data', question: 'What does AI need to learn from?', answer: 'Past appointments · Feedback outcomes · Reminder history' },
  { n: '06', title: 'Feedback', question: 'How does the system learn from what actually happened?', answer: 'Track whether patients who received reminders subsequently left feedback.' },
  { n: '07', title: 'Outcome', question: 'How will we know it worked?', answer: 'Increase feedback completion while reducing unnecessary reminders.' },
]

const outputFlow = ['Action', 'Prediction', 'Judgment', 'Input', 'Training', 'Feedback', 'Outcome']

const sessionRows: { type?: 'break'; week: string; tag: string; title: string; desc: string; host: string; role: string }[] = [
  { week: 'Part 01', tag: 'The Framework · 40 min', title: 'All 7 Elements, With Real Examples', desc: 'Walk through the complete AI Task Canvas using examples from real business tasks across industries.', host: 'Allan Sendagi', role: 'Author, The AI Roadmap' },
  { type: 'break', week: '', tag: '', title: 'Break', desc: '5 minutes — stretch, refill your coffee.', host: '', role: '' },
  { week: 'Part 02', tag: 'Build Your Canvas · 70 min', title: 'Your Canvas, Live', desc: 'Apply the canvas to your own priority AI task, element by element, with live guidance from Allan.', host: 'Allan Sendagi', role: 'Author, The AI Roadmap' },
  { type: 'break', week: '', tag: '', title: 'Break', desc: '5 minutes — stretch, refill your coffee.', host: '', role: '' },
  { week: 'Part 03', tag: 'Pressure-Test · 30 min', title: 'Stress-Test Before You Build', desc: 'Pressure-test your Judgment rule, Input list, and Outcome before you build, brief a vendor, or commit resources.', host: 'Allan Sendagi', role: 'Author, The AI Roadmap' },
]

const seatIncludes = [
  'Live 2.5-hour workshop',
  'AI Task Canvas',
  'Defined AI intervention',
  'Measurable value hypothesis',
  'Direct working feedback',
  'Completed Canvas',
  'Clear next step',
]


const faqs: { q: string; a: string; aRich?: React.ReactNode }[] = [
  {
    q: 'Do I need to be technical to do this?',
    a: 'No. This is not a coding workshop and you do not need to know how to build AI systems. You bring a real business task and work through the AI Task Canvas with guided instruction. The goal is to define the work clearly enough that the technical implementation becomes easier to understand, evaluate, and build.',
  },
  {
    q: 'What will I actually have at the end?',
    a: 'You will have one completed AI Task Canvas for a real task from your work. You will have defined the action, prediction, judgment, input, training data, feedback, and outcome — along with a clear AI intervention and measurable value hypothesis.',
  },
  {
    q: "What if I don't have a specific AI idea yet?",
    a: "That's fine. You do not need to arrive with a fully formed AI use case. You need a real business task that could be improved. We will help you identify and sharpen the task before working through the Canvas.",
  },
  {
    q: 'How is this different from asking ChatGPT to plan my AI project?',
    a: "ChatGPT can generate strategies, ideas, and recommendations. But a generated answer is not a specification of what your organisation intends to change. The AI Task Canvas forces your organisation to make the decisions that matter: what task is being changed, what AI must predict, what judgment follows, what information and training data are required, how the system receives feedback, and what business outcome defines success. The result is specific to your task, your workflow, your decisions, your data, and your definition of value — not a generic answer that could be given to another organisation. ChatGPT can help generate the ideas. The Canvas makes the organisation specify what it actually intends to build.",
    aRich: (
      <>
        ChatGPT can generate strategies, ideas, and recommendations. But a generated answer is not a
        specification of what your organisation intends to change.
        <br /><br />
        The AI Task Canvas forces your organisation to make the decisions that matter:{' '}
        <strong style={{ color: '#F5F1EA' }}>
          what task is being changed, what AI must predict, what judgment follows, what information and
          training data are required, how the system receives feedback, and what business outcome
          defines success.
        </strong>
        <br /><br />
        The result is specific to{' '}
        <strong style={{ color: '#F5F1EA' }}>
          your task, your workflow, your decisions, your data, and your definition of value
        </strong>
        {' '}— not a generic answer that could be given to another organisation.
        <br /><br />
        <strong style={{ color: '#F5F1EA' }}>
          ChatGPT can help generate the ideas. The Canvas makes the organisation specify what it actually
          intends to build.
        </strong>
      </>
    ),
  },
  {
    q: 'What should I bring?',
    a: 'Bring one real business task you are responsible for — something repetitive, analytical, decision-heavy, or difficult to scale. Bring whatever you already know about how that task works. You do not need to prepare a technical specification beforehand.',
  },
  {
    q: 'Is the Canvas a strategy tool or a technical specification?',
    a: 'Both. The AI Task Canvas combines the strategic and development decisions needed to define an AI intervention. It connects the business task and the value it should create with the prediction, judgment, inputs, training data, feedback, and outcomes needed to develop and evaluate it. You are not creating a strategy document and then translating it into a technical specification. The Canvas does both in one framework.',
    aRich: (
      <>
        <strong style={{ color: '#F5F1EA' }}>Both.</strong>
        <br /><br />
        The AI Task Canvas combines the strategic and development decisions needed to define an AI
        intervention. It connects the business task and the value it should create with the prediction,
        judgment, inputs, training data, feedback, and outcomes needed to develop and evaluate it.
        <br /><br />
        You are not creating a strategy document and then translating it into a technical specification.{' '}
        <strong style={{ color: '#F5F1EA' }}>The Canvas does both in one framework.</strong>
      </>
    ),
  },
]

const funnelSteps = ['AI IDEA', 'REAL BUSINESS TASK', '7-ELEMENT CANVAS', 'AI INTERVENTION', 'MEASURABLE OUTCOME']

const navLinks = [
  { label: 'PROGRAM', href: '#program' },
  { label: 'ABOUT ALLAN', href: '#about' },
  { label: 'ENROLLMENT', href: '#enrollment' },
  { label: 'FAQ', href: '#faq' },
]

const testimonial = {
  quote: "Allan Sendagi delivers a clear, real-world framework for AI implementation that bridges the gap between strategy and execution. Highly recommended for leaders ready to move beyond the hype and deploy AI with precision.",
  name: 'Akmaral Shamenova',
  role: 'Operations Leader (20 yrs); M.Sc. Blockchain & Digital Currencies',
}

export default function WorkshopPage() {
  const faqJsonLd = faqSchema(faqs)

  return (
    <>
      <Script
        id="workshop-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className={fraunces.className} style={{ background: C.bg, color: C.white, overflowX: 'hidden' }}>

        {/* ── Announcement bar ── */}
        <div style={{ background: C.accent, color: C.white, textAlign: 'center', padding: '10px 16px', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', fontFamily: bodyFont }}>
          LAUNCH COHORT &middot; 10 PARTICIPANTS
        </div>

        {/* ── Nav ── */}
        <nav className="site-nav" style={{
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '22px 40px', gap: 24, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
            <div style={{ lineHeight: 0.95 }}>
              <div style={{
                fontSize: 'clamp(30px, 4.2vw, 44px)', fontWeight: 700, fontStyle: 'italic', color: C.white,
                letterSpacing: '-0.01em', display: 'inline-block',
              }}>
                AI Value
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                <span style={{
                  fontSize: 14, fontWeight: 700, color: C.accent, letterSpacing: '0.2em',
                  fontFamily: bodyFont,
                }}>
                  SANDBOX
                </span>
                <span style={{ width: 36, height: 2, flexShrink: 0, background: C.accent }} />
              </div>
            </div>

            <div className="site-nav-menu" style={{ display: 'flex', alignItems: 'center', gap: 28, fontFamily: bodyFont }}>
              {navLinks.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                    textDecoration: 'none', whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <a
            href="/assessment"
            target="_blank"
            rel="noopener noreferrer"
            className="site-nav-quiz-link"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              border: `1px solid ${C.border}`, borderRadius: 10, padding: '9px 16px',
              color: C.white, fontSize: 13, fontWeight: 700, textDecoration: 'none',
              fontFamily: bodyFont, textTransform: 'none', whiteSpace: 'nowrap',
            }}
          >
            Not sure yet? Take the AI Readiness Quiz →
          </a>

          <MobileNav items={navLinks} />
        </nav>

        {/* ── Hero ── */}
        <section style={{ maxWidth: 1000, margin: '0 auto', padding: '72px 24px 40px', textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.muted, letterSpacing: '0.12em', margin: '0 0 24px', fontFamily: bodyFont }}>
            <span className="live-dot" aria-hidden="true" /><span style={{ color: C.accent }}>LIVE</span> WORKSHOP · HOSTED BY <span style={{ color: C.white }}>ALLAN SENDAGI</span>
          </p>
          <h1 style={{ fontSize: 'clamp(2.8rem, 8vw, 5.5rem)', fontWeight: 900, lineHeight: 1.04, margin: '0 0 20px', textTransform: 'uppercase' }}>
            Make AI <span style={{ color: C.accent }}>Work</span>
          </h1>
          <p style={{ fontSize: 'clamp(1.2rem, 2.4vw, 1.6rem)', fontWeight: 700, color: C.white, lineHeight: 1.35, margin: '0 auto 20px', maxWidth: 720, textTransform: 'uppercase' }}>
            From AI Adoption To AI Value
          </p>
          <p className="hero-oneline" style={{ fontSize: 18, color: C.muted, lineHeight: 1.75, margin: '0 auto 20px', maxWidth: 'none', whiteSpace: 'nowrap', fontFamily: bodyFont }}>
            Take one real business task and define exactly how AI can improve it — and how you&apos;ll measure the result.
          </p>
          <p style={{ fontSize: 18, color: C.white, fontWeight: 700, lineHeight: 1.6, margin: '0 auto 36px', maxWidth: 680, fontFamily: bodyFont }}>
            Bring one task. Leave with a defined AI intervention.
          </p>

          <a
            href="/checkout"
            style={{
              display: 'inline-flex', alignItems: 'center', background: C.accent, color: C.white,
              padding: '16px 48px', borderRadius: 15, fontSize: 14, fontWeight: 800,
              textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
            }}
          >
            Join The Launch Cohort
          </a>
        </section>

        {/* ── Ticker marquee ── */}
        <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, overflow: 'hidden', padding: '14px 0' }}>
          <div className="ticker-track" style={{ display: 'flex', width: 'max-content', fontFamily: bodyFont }}>
            {[...tickerItems, ...tickerItems, ...tickerItems].map((t, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', color: C.accent, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', whiteSpace: 'nowrap', padding: '0 20px' }}>
                {t} <span style={{ color: C.muted, marginLeft: 20 }}>•</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── Key metrics ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{ padding: '0 24px', borderLeft: i > 0 ? `1px solid ${C.border}` : 'none' }}>
                <p style={{ fontSize: 44, fontWeight: 900, color: C.accent, margin: '0 0 6px' }}>{s.n}</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: '0.06em', margin: 0, fontFamily: bodyFont }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Who this is for ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 44 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', margin: 0, whiteSpace: 'nowrap' }}>
              THIS IS FOR YOU IF...
            </p>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {personas.map(p => (
              <div key={p.num} style={{ position: 'relative', background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '28px 24px', overflow: 'hidden' }}>
                <span style={{ position: 'absolute', top: -10, right: 4, fontSize: 96, fontWeight: 900, color: 'rgba(255,255,255,0.05)', lineHeight: 1 }}>{p.num}</span>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: '0.08em', margin: '0 0 12px', position: 'relative' }}>{p.tag.toUpperCase()}</p>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 12px', position: 'relative', textTransform: 'none' }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: C.muted, margin: 0, lineHeight: 1.65, position: 'relative', fontFamily: bodyFont }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Video ── */}
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 72px' }}>
          <ScrollScaleVideo src="/workshop-preview.mp4" border={C.border} />
        </section>

        {/* ── What you walk away with ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 40, flexWrap: 'wrap', marginBottom: 0 }}>
            <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 900, lineHeight: 1.05, margin: 0 }}>
              What you walk<br />
              <span style={{ color: C.accent }}>away with.</span>
            </h2>
            <p style={{ flex: '1 1 320px', maxWidth: 460, color: C.muted, fontSize: 16, lineHeight: 1.7, margin: 0, fontFamily: bodyFont, textTransform: 'none' }}>
              Not another list of AI ideas. A defined starting point for <strong style={{ color: C.white }}>putting AI to work.</strong>
            </p>
          </div>

          <div style={{ height: 3, background: C.accent, marginTop: 40 }} />

          <div className="walkaway-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
            border: `1px solid ${C.border}`, borderTop: 'none',
          }}>
            {walkAwayItems.map((item, i) => (
              <div
                key={item.title}
                style={{
                  padding: '40px 36px',
                  borderRight: i % 2 === 0 && i !== walkAwayItems.length - 1 ? `1px solid ${C.border}` : 'none',
                  borderBottom: i !== walkAwayItems.length - 1 ? `1px solid ${C.border}` : 'none',
                  gridColumn: i === walkAwayItems.length - 1 && walkAwayItems.length % 2 === 1 ? '1 / -1' : undefined,
                }}
              >
                <div style={{
                  width: 32, height: 32, border: `1.5px solid ${C.accent}`, borderRadius: 4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: C.accent, fontSize: 14, fontWeight: 700, marginBottom: 20,
                }}>
                  ✓
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 700, margin: '0 0 10px', textTransform: 'none' }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: C.muted, margin: 0, lineHeight: 1.7, fontFamily: bodyFont, textTransform: 'none' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <a
              href="/checkout"
              style={{
                display: 'inline-flex', alignItems: 'center', background: C.accent, color: C.white,
                padding: '16px 48px', borderRadius: 15, fontSize: 14, fontWeight: 800,
                textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
              }}
            >
              I Want a Defined AI Intervention
            </a>
          </div>
        </section>

        {/* ── The framework ── */}
        <section id="program" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 40px', scrollMarginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', margin: 0, whiteSpace: 'nowrap' }}>
              THE AI TASK CANVAS
            </p>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, margin: 0, flex: '1 1 320px', textTransform: 'uppercase' }}>
              7 elements.<br /><span style={{ color: C.accent }}>One session.</span>
            </h2>
            <p style={{ flex: '1 1 280px', color: C.muted, fontSize: 15, lineHeight: 1.75, margin: 0, fontFamily: bodyFont, textTransform: 'none' }}>
              Every element forces one more decision you can&apos;t leave undefined — what AI should predict, what
              data it needs, where human judgment remains, and how you&apos;ll know it worked. You leave with
              all seven answered for your own task.
              <br /><br />
              The Canvas combines the strategic and development decisions needed to define an AI intervention.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {canvasElements.map(el => (
              <div key={el.n} className="canvas-card" style={{ background: C.card, border: '1px solid transparent', borderRadius: 10, padding: '24px 22px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: '0.08em', margin: '0 0 8px' }}>
                  ELEMENT {el.n}
                </p>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px', textTransform: 'none' }}>{el.title}</h3>
                <p style={{ fontSize: 14, color: C.body, margin: '0 0 10px', lineHeight: 1.6, fontFamily: bodyFont, textTransform: 'none' }}>{el.def}</p>
                <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.5, fontFamily: bodyFont, textTransform: 'none' }}>{el.example}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── The Output ── */}
        <section style={{ padding: '20px 24px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.14em', margin: '0 0 20px' }}>
              THE OUTPUT
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, lineHeight: 1.15, margin: '0 0 20px', textTransform: 'none' }}>
              One task. Seven decisions.
            </h2>
            <p style={{ color: C.muted, fontSize: 16, margin: '0 auto 14px', maxWidth: 600, lineHeight: 1.7, fontFamily: bodyFont, textTransform: 'none' }}>
              The AI Task Canvas turns a vague AI opportunity into a specification for what the intervention should do, what it requires, and how its value will be measured.
            </p>
            <p style={{ fontSize: 16, fontWeight: 700, color: C.white, margin: 0, fontFamily: bodyFont, textTransform: 'none' }}>
              This is the artifact you leave with.
            </p>
          </div>

          <div className="output-card" style={{
            maxWidth: 760, margin: '0 auto', background: '#fbfaf7', borderRadius: 14,
            boxShadow: '0 20px 50px rgba(0,0,0,0.35)', overflow: 'hidden',
          }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #e5e2d9', background: '#f2efe7' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9a9483', letterSpacing: '0.08em', margin: '0 0 10px' }}>AI TASK CANVAS</p>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9a9483', letterSpacing: '0.08em', margin: '0 0 6px' }}>REAL BUSINESS TASK</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: 0, lineHeight: 1.5 }}>{OUTPUT_TASK}</p>
            </div>
            <div>
              {outputExample.map((el, i) => (
                <div key={el.n} style={{
                  padding: '22px 32px', borderBottom: i !== outputExample.length - 1 ? '1px solid #e5e2d9' : 'none',
                }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#9a6b00', letterSpacing: '0.06em', margin: '0 0 8px' }}>
                    {el.n} &middot; {el.title.toUpperCase()}
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px' }}>{el.question}</p>
                  <p style={{ fontSize: 14, color: '#4b4638', margin: 0, lineHeight: 1.6 }}>{el.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.14em', margin: '0 0 20px' }}>
              FROM HIGH POTENTIAL TO HIGH CLARITY
            </p>
            <p style={{ color: C.muted, fontSize: 15, margin: '0 auto 16px', maxWidth: 560, lineHeight: 1.75, fontFamily: bodyFont, textTransform: 'none' }}>
              You start with a business task. The Canvas forces the decisions that turn it into something
              that can actually be built, tested, and measured.
            </p>
            <p style={{ color: C.white, fontSize: 15, fontWeight: 700, margin: '0 auto 32px', maxWidth: 560, lineHeight: 1.6, fontFamily: bodyFont, textTransform: 'none' }}>
              STRATEGY <span style={{ color: C.accentSoft }}>&harr;</span> AI TASK CANVAS <span style={{ color: C.accentSoft }}>&harr;</span> DEVELOPMENT
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {outputFlow.map((step, i) => (
                <span key={step} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 14px',
                    fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', color: C.white,
                    fontFamily: bodyFont, whiteSpace: 'nowrap',
                  }}>
                    {step}
                  </span>
                  {i < outputFlow.length - 1 && <span style={{ color: C.muted, fontSize: 13 }}>→</span>}
                </span>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <a
                href="/checkout"
                style={{
                  display: 'inline-flex', alignItems: 'center', background: C.accent, color: C.white,
                  padding: '16px 48px', borderRadius: 15, fontSize: 14, fontWeight: 800,
                  textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
                }}
              >
                Turn My Task Into an AI Specification
              </a>
              <p style={{ margin: '16px 0 0' }}>
                <a
                  href="/pick-your-task"
                  style={{ color: C.muted, fontSize: 13.5, textDecoration: 'underline', fontFamily: bodyFont }}
                >
                  Not sure your task is ready? Try the 5-minute task picker &rarr;
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* ── Session breakdown ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', margin: 0, whiteSpace: 'nowrap' }}>
              SESSION BREAKDOWN
            </p>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
            {sessionRows.map((r, i) => (
              r.type === 'break' ? (
                <div key={`break-${i}`} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 24px', borderTop: `1px solid ${C.border}`,
                  background: 'transparent',
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: bodyFont }}>
                    {r.title}
                  </span>
                  <span style={{ fontSize: 13, color: C.muted, fontFamily: bodyFont, textTransform: 'none' }}>{r.desc}</span>
                </div>
              ) : (
                <div key={r.week} className="session-row" style={{
                  display: 'grid', gridTemplateColumns: '140px 1fr 200px', gap: 24,
                  padding: '28px 24px', borderTop: i > 0 ? `1px solid ${C.border}` : 'none',
                  background: i % 2 === 0 ? C.card : 'transparent',
                }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: '0.08em', margin: 0 }}>{r.week.toUpperCase()}</p>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: '0.06em', margin: '0 0 8px', fontFamily: bodyFont }}>{r.tag.toUpperCase()}</p>
                    <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px', textTransform: 'none' }}>{r.title}</h3>
                    <p style={{ fontSize: 14, color: C.muted, margin: 0, lineHeight: 1.65, fontFamily: bodyFont, textTransform: 'none' }}>{r.desc}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px', textTransform: 'none' }}>{r.host}</p>
                    <p style={{ fontSize: 12, color: C.muted, margin: 0, fontFamily: bodyFont, textTransform: 'none' }}>Author, <em style={{ fontStyle: 'normal' }}>The AI Roadmap</em></p>
                  </div>
                </div>
              )
            ))}
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="enrollment" style={{ maxWidth: 640, margin: '0 auto', padding: '80px 24px', scrollMarginTop: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.14em', textAlign: 'center', margin: '0 0 12px' }}>
            LAUNCH COHORT PRICING
          </p>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 700, color: C.white, textAlign: 'center', margin: '0 0 32px', textTransform: 'none' }}>
            The first live cohort of AI Value / Sandbox
          </h2>

          <div style={{
            border: `1.5px solid ${C.accent}`, borderRadius: 14, padding: '40px 36px',
            background: '#0c0c0c', boxShadow: '0 0 40px rgba(194,65,12,0.1)', textAlign: 'center',
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 24px', fontFamily: bodyFont }}>
              10 Participants &middot; 1 Working Session
            </p>

            <Countdown target={WORKSHOP_DEADLINE} accent={C.accent} label="Cohort begins in" closedLabel="The cohort has begun" />

            <div style={{ borderTop: `1px solid ${C.border}`, margin: '24px 0' }} />

            <p style={{ fontSize: 'clamp(2.4rem, 6vw, 3.2rem)', fontWeight: 900, color: C.white, margin: '0 0 4px' }}>
              QAR 550
            </p>
            <p style={{ fontSize: 14, color: C.muted, margin: '0 0 8px', fontFamily: bodyFont }}>
              &asymp; AED 554
            </p>
            <p style={{ fontSize: 14, color: C.muted, margin: '0 0 24px', fontFamily: bodyFont }}>
              Saturday, {WORKSHOP_DATE.replace(', 2026', '')} &middot; {WORKSHOP_TIME} &middot; 2.5 hours &middot; Live online
            </p>
            <p style={{ fontSize: 15, color: C.body, lineHeight: 1.7, margin: '0 0 32px', fontFamily: bodyFont, textAlign: 'left' }}>
              This launch cohort is limited to <strong style={{ color: C.white }}>10 participants</strong> so
              the session remains a working environment rather than a lecture.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
              {seatIncludes.map(item => (
                <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.6, fontFamily: bodyFont }}>
                  <span style={{ color: C.accent, flexShrink: 0, fontWeight: 700 }}>&rarr;</span>
                  <span style={{ color: C.body }}>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="/checkout"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: C.accent, color: C.white, padding: '16px 24px', borderRadius: 12,
                fontSize: 14, fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
              }}
            >
              Reserve Your Seat
            </a>
            <p style={{ fontSize: 12, color: C.muted, textAlign: 'center', margin: '14px 0 0' }}>
              10 participants maximum. Launch cohort pricing applies to this cohort.
            </p>
          </div>

          <p style={{ textAlign: 'center', color: C.muted, fontSize: 13, margin: '32px 0 0', fontFamily: bodyFont, textTransform: 'none' }}>
            <strong style={{ color: C.white }}>What you&apos;ll need:</strong> One real business task to work on. No technical background required.
          </p>
        </section>

        {/* ── Instructor ── */}
        <section id="about" style={{ borderTop: `1px solid ${C.border}`, background: '#0c0c0c', padding: '80px 24px', scrollMarginTop: 24 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 56 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.14em', margin: 0, whiteSpace: 'nowrap' }}>
                YOUR HOST &amp; INSTRUCTOR
              </p>
              <div style={{ flex: 1, height: 1, background: C.border }} />
            </div>

            <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 48, alignItems: 'center' }}>
              <div>
                <h2 style={{
                  fontSize: 'clamp(2.6rem, 5.5vw, 4rem)', fontWeight: 700, color: C.white,
                  display: 'inline-block', margin: '0 0 20px',
                  textTransform: 'none', letterSpacing: '-0.01em', lineHeight: 1,
                }}>
                  Allan Sendagi
                </h2>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.08em', margin: '0 0 28px', fontFamily: bodyFont }}>
                  AUTHOR, THE AI ROADMAP &middot; FOUNDER, SAFEHAVEN AI &middot; BUILDER, NOMOS PROTOCOL
                </p>
                <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, margin: '0 0 20px', fontFamily: bodyFont, textTransform: 'none' }}>
                  Allan Sendagi is the author of <em style={{ fontStyle: 'normal' }}>The AI Roadmap: Implement AI Profitably in 10 Steps</em> and
                  creator of the <strong style={{ color: C.white }}>AI Navigator System</strong>, the methodology
                  behind the AI Task Canvas used in this workshop.
                </p>
                <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, margin: '0 0 20px', fontFamily: bodyFont, textTransform: 'none' }}>
                  He founded <strong style={{ color: C.white }}>SafeHaven AI</strong> and co-founded{' '}
                  <strong style={{ color: C.white }}>Shapr</strong>, an applied AI agency based in Dubai. At SafeHaven,
                  he built <strong style={{ color: C.white }}>NOMOS Protocol</strong>, an infrastructure specification
                  for machine-verifiable institutional authority, and developed{' '}
                  <strong style={{ color: C.white }}>Computable Authority</strong>, a proposed runtime architecture
                  for binding institutional authority to machine-executed action — put forward through the
                  OECD&apos;s 2026 public consultation on Law as Code.
                </p>
                <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, margin: '0 0 28px', fontFamily: bodyFont, textTransform: 'none' }}>
                  His work focuses on turning <strong style={{ color: C.white }}>AI opportunities into specific,
                  buildable interventions</strong> — and developing the frameworks and infrastructure required to
                  implement AI with greater precision.
                </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
                <a
                  href="https://a.co/d/0fUXBdCD"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="The AI Roadmap book cover — available at Amazon"
                  style={{ display: 'block', width: 64, height: 96, borderRadius: 5, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', flexShrink: 0 }}
                >
                  <img src="/ai-roadmap-cover.png" alt="The AI Roadmap book cover" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </a>

                <a
                  href="https://a.co/d/0fUXBdCD"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, height: 48, padding: '0 20px',
                    borderRadius: 8, border: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.03)',
                    textDecoration: 'none', flexShrink: 0,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M4 15.5c3.5 2.5 12.5 2.5 16 0" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M6 12V6.5C6 5 7 4 8.5 4h7C17 4 18 5 18 6.5V12" stroke={C.muted} strokeWidth="1.6" />
                  </svg>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.white, whiteSpace: 'nowrap', fontFamily: bodyFont }}>Available on Amazon</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/allansendagi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Allan Sendagi on LinkedIn"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 8, border: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.03)', color: C.white, flexShrink: 0 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div style={{
              position: 'relative', width: '100%', maxWidth: 420, aspectRatio: '1 / 1',
              margin: '32px auto 0', background: '#0c0c0c',
            }}>
              <img
                src="/allan-headshot.jpeg"
                alt="Allan Sendagi"
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  WebkitMaskImage: 'radial-gradient(ellipse 46% 40% at 50% 42%, black 35%, transparent 100%)',
                  maskImage: 'radial-gradient(ellipse 46% 40% at 50% 42%, black 35%, transparent 100%)',
                }}
              />
            </div>
          </div>
          </div>
        </section>

        {/* ── Testimonial ── */}
        <section style={{ padding: '100px 24px', textAlign: 'center', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.16em', margin: '0 0 40px' }}>
            WHAT OTHERS SEE IN THE FRAMEWORK
          </p>

          <p style={{
            fontSize: 'clamp(2.2rem, 6vw, 4.4rem)', fontWeight: 700,
            lineHeight: 1.15, color: C.white, maxWidth: 900, margin: '0 auto 32px',
          }}>
            &ldquo;A clear, real-world framework that bridges strategy and execution.&rdquo;
          </p>

          <p style={{ fontSize: 15, fontWeight: 700, color: C.white, margin: '0 0 2px', fontFamily: bodyFont }}>{testimonial.name}</p>
          <p style={{ fontSize: 13, color: C.muted, margin: '0 0 40px', fontFamily: bodyFont }}>{testimonial.role}</p>

          <div style={{ width: 48, height: 2, background: C.border, margin: '0 auto 40px' }} />

          <p style={{
            fontSize: 15, lineHeight: 1.8, color: C.muted,
            maxWidth: 560, margin: '0 auto', fontFamily: bodyFont,
          }}>
            &ldquo;{testimonial.quote}&rdquo;
          </p>
          <p style={{ fontSize: 13, color: C.muted, margin: '20px 0 0', fontFamily: bodyFont, fontStyle: 'normal' }}>
            On <em style={{ fontStyle: 'normal' }}>The AI Roadmap</em> — the book behind this workshop&apos;s framework.
          </p>
        </section>

        {/* ── The Promise + FAQ ── */}
        <section id="faq" style={{ borderTop: `1px solid ${C.border}`, background: '#0c0c0c', padding: '80px 24px', scrollMarginTop: 24 }}>
          <div className="promise-faq-grid" style={{
            maxWidth: 1100, margin: '0 auto', display: 'grid',
            gridTemplateColumns: 'minmax(260px, 1fr) minmax(320px, 1.7fr)', gap: 60,
          }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.14em', margin: '0 0 24px' }}>
                THE PROMISE
              </p>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)', fontWeight: 900, color: '#f2f0ea', margin: '0 0 20px', textTransform: 'none', lineHeight: 1.25 }}>
                You are not buying 2.5 hours.
              </h2>
              <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.75, margin: 0, fontFamily: bodyFont, textTransform: 'none' }}>
                You&apos;re buying a completed specification for one real AI task — and a method you can use on the next one.
              </p>
            </div>

            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.14em', margin: '0 0 28px' }}>
                SIX QUESTIONS YOU MAY BE ASKING
              </p>
              {faqs.map((f, i) => (
                <div key={f.q} style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 16, padding: '20px 0', borderTop: i !== 0 ? `1px solid ${C.border}` : 'none' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, margin: 0 }}>{String(i + 1).padStart(2, '0')}</p>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 700, color: C.white, margin: '0 0 8px', textTransform: 'none' }}>{f.q}</p>
                    <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, margin: 0, fontFamily: bodyFont, textTransform: 'none' }}>{f.aRich ?? f.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section style={{ padding: '96px 24px 64px', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 56 }}>
            {funnelSteps.map((step, i) => (
              <span key={step} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 16px',
                  fontSize: 12, fontWeight: 700, letterSpacing: '0.05em',
                  color: i === funnelSteps.length - 1 ? C.accent : C.white, fontFamily: bodyFont, whiteSpace: 'nowrap',
                }}>
                  {step}
                </span>
                {i < funnelSteps.length - 1 && <span style={{ color: C.muted, fontSize: 14 }}>→</span>}
              </span>
            ))}
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, margin: '0 0 14px', lineHeight: 1.15, textTransform: 'none' }}>
            You walked in with an AI idea.
          </h2>
          <p style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 700, color: C.accent, margin: '0 0 14px' }}>
            Leave with an AI intervention you can actually specify.
          </p>
          <p style={{ fontSize: 15, color: C.muted, margin: '0 auto 36px', maxWidth: 520, lineHeight: 1.7, fontFamily: bodyFont, textTransform: 'none' }}>
            From there, you can test it, brief development, engage a vendor, or take it into your wider AI roadmap.
          </p>

          <a
            href="/checkout"
            style={{
              display: 'inline-flex', alignItems: 'center', background: C.accent, color: C.white,
              padding: '16px 48px', borderRadius: 15, fontSize: 14, fontWeight: 800,
              textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
            }}
          >
            I Want to Make AI Work
          </a>
          <p style={{ fontSize: 13, color: C.muted, margin: '18px 0 0', fontFamily: bodyFont, textTransform: 'none' }}>
            10 seats · Enrollment is first come, first served
          </p>
        </section>

        {/* ── Meta / event details recap ── */}
        <div style={{ borderTop: `1px solid ${C.border}`, padding: '20px 24px', textAlign: 'center', fontFamily: bodyFont, textTransform: 'none' }}>
          <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>
            &copy; {new Date().getFullYear()} SafeHaven LLC &middot; Lusail Boulevard. All rights reserved.
            {' '}&middot;{' '}
            <a href="/terms" style={{ color: C.muted, textDecoration: 'underline' }}>Terms</a>
            {' '}&middot;{' '}
            <a href="/privacy" style={{ color: C.muted, textDecoration: 'underline' }}>Privacy</a>
            {' '}&middot;{' '}
            <a
              href={`https://wa.me/97450176561?text=${encodeURIComponent("Hi Allan, we're interested in team training using the AI Value Sandbox workshop")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: C.muted, textDecoration: 'underline' }}
            >
              Training for Teams
            </a>
          </p>
        </div>

        <style>{`
          @keyframes tickerScroll {
            from { transform: translateX(0); }
            to { transform: translateX(-33.333%); }
          }
          @keyframes livePulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.25; }
          }
          .live-dot {
            display: inline-block; width: 7px; height: 7px; border-radius: 50%;
            background: ${C.accent}; margin-right: 7px; vertical-align: middle;
            animation: livePulse 1.4s ease-in-out infinite;
          }
          .ticker-track {
            animation: tickerScroll 30s linear infinite;
          }
          .canvas-card {
            transition: border-color 200ms;
          }
          .canvas-card:hover {
            border-color: ${C.accent};
          }
          .mobile-nav { display: none; }
          @media (max-width: 860px) {
            .site-nav-menu { display: none !important; }
            .site-nav-quiz-link { display: none !important; }
            .site-nav { padding: 18px 20px !important; }
            .mobile-nav { display: block; }
          }
          @media (max-width: 700px) {
            .walkaway-grid { grid-template-columns: 1fr !important; }
            .walkaway-grid > div { border-right: none !important; }
            .promise-faq-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
            .about-grid { grid-template-columns: 1fr !important; }
            .about-grid > div:last-child { order: -1; }
            .hero-oneline { white-space: normal !important; }
            .session-row { grid-template-columns: 1fr !important; gap: 8px !important; }
            .session-row > div:last-child { margin-top: 4px; }
            .walkaway-grid > div { padding: 28px 22px !important; }
            .output-card > div { padding-left: 20px !important; padding-right: 20px !important; }
          }
        `}</style>
      </div>
    </>
  )
}
