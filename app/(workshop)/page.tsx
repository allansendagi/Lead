import type { Metadata } from 'next'
import Script from 'next/script'
import { Fraunces, Inter } from 'next/font/google'
import ScrollScaleVideo from '@/components/ScrollScaleVideo'
import MobileNav from '@/components/MobileNav'
import CanvasBuilder from '@/components/CanvasBuilder'
import TrackedLink from '@/components/TrackedLink'
import { faqSchema } from '@/lib/schema'
import { COHORT_DESCRIPTION } from '@/lib/cohort2'

const fraunces = Fraunces({ subsets: ['latin'], weight: ['600', '700', '900'], style: ['normal', 'italic'] })
const inter = Inter({ subsets: ['latin'] })
const bodyFont = inter.style.fontFamily

export const metadata: Metadata = {
  // Root layout appends " | AI Navigator", giving "Make AI Work · Cohort 2, 24 October | AI Navigator".
  title: 'Make AI Work · Cohort 2, 24 October',
  description: COHORT_DESCRIPTION,
  alternates: { canonical: 'https://www.ainavsystem.com/' },
  openGraph: {
    title: 'Make AI Work · Cohort 2, 24 October | AI Navigator',
    description: COHORT_DESCRIPTION,
    url: 'https://www.ainavsystem.com/',
    type: 'website',
  },
}

// ── Editable event details — fill these in once confirmed ──────────────────
const WORKSHOP_DATE = 'October 24, 2026'
const WORKSHOP_TIME = '10:00 AM Doha (GMT+3) / 11:00 AM Dubai (GMT+4)'

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
  'YOUR WORKFLOW', 'EVERY STEP LABELLED', 'THE WORK FOR AGENTS',
  'WHERE THE AGENT STOPS', 'ONE-PAGE SPECIFICATION', 'A FIRST TEST',
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
    tag: 'A process eats your week',
    title: "A weekly process takes your team hours, and you know it shouldn't.",
    desc: 'Enquiries, quotes, reports, follow-ups: work that is repetitive, slow, and handled differently by every person on the team.',
  },
  {
    num: '02',
    tag: 'AI across the business',
    title: "You want AI across the business but don't know where to start.",
    desc: 'Everyone has an opinion on tools. What you need is one workflow taken apart, so you can see which work AI should do and which stays with people.',
  },
  {
    num: '03',
    tag: 'Tried it, nothing changed',
    title: "You've tried AI tools and nothing measurable changed.",
    desc: 'Subscriptions and experiments, but no result you can point to. You want a specific task, a clear role for AI, and a number that tells you if it worked.',
  },
]

const walkAwayItems = [
  { title: 'Your workflow, mapped', desc: 'Every step labelled: AI assists · AI performs · Agent runs it · Stays human · Not worth changing.' },
  { title: 'A one-page AI Task Specification', desc: 'Precise enough to hand to a developer or vendor, without losing the business intent between strategy and build.' },
  { title: 'Agent design', desc: 'Which steps an agent takes on, the systems it uses, its hand-offs, and what it must never do.' },
  { title: 'A first test to run', desc: 'What to try in the next two weeks, with what data, and what to measure.' },
  { title: 'A measurable outcome', desc: 'How you will know whether the intervention actually improves the work.' },
]

const canvasHeader = [
  { title: 'Owner', def: 'Who owns the task and uses the output?' },
  { title: 'Baseline', def: 'How does the task perform today?' },
  { title: 'Target', def: 'What needs to change?' },
]

const canvasElements = [
  { n: '1', title: 'Action', def: 'What business activity are you improving?', example: 'e.g. "Send personalized follow-up messages after appointments."' },
  { n: '2', title: "AI's Job", def: 'What should AI predict, classify, generate, or act on?', example: 'e.g. "Predict the likelihood a customer leaves feedback without a reminder."' },
  { n: '3', title: 'Judgment & Authority', def: 'What decision follows, and who or what is authorised to make it?', example: 'e.g. "Send a reminder if predicted feedback likelihood is under 40%."', extra: 'Every condition falls into one of four classes: machine can check · machine can check with proof · needs a person’s judgment · needs more authority' },
  { n: '4', title: 'Input', def: 'What does AI need to see at the moment it acts?', example: 'e.g. "Customer ID, last visit date, service type, feedback history."' },
  { n: '5', title: 'Training Data & Context', def: 'What examples, documents, instructions, or context does AI need?', example: 'e.g. "Past appointments, whether feedback was left, reminders sent."' },
  { n: '6', title: 'Feedback & Record', def: 'How does the system learn what happened, and what record is kept?', example: 'e.g. "Track whether reminder recipients actually left feedback."' },
  { n: '7', title: 'Outcome', def: 'What measurable change tells you the intervention created value?', example: 'e.g. "Increase feedback completion rate without increasing reminder volume."' },
]

const OUTPUT_LABEL = 'HYPOTHETICAL EXAMPLE · PATIENT FEEDBACK'
const OUTPUT_TASK = 'Send personalized follow-up messages to patients after appointments.'
const OUTPUT_OWNER = 'Patient experience lead. Front-desk team handles referred cases.'
const OUTPUT_BASELINE = 'Today, staff send reminders manually to everyone. About 1 in 5 patients leaves feedback.'
const OUTPUT_TARGET = 'Raise the feedback rate without messaging patients more often, and resolve every referred case within two working days.'
const OUTPUT_IDEA = 'Use AI to improve patient follow-up.'
const OUTPUT_FLOW_LINE = 'AI predicts → AI checks authority conditions → AI acts on routine cases → AI refers exceptions → outcome is measured'
const OUTPUT_INTERVENTION = 'Predict which patients are unlikely to leave feedback, automatically remind the ones who are eligible, refer any case that needs judgment or authority, and measure the effect against today’s baseline.'

const canvasStages = [
  { n: '01', title: 'Action', summary: 'Collect more patient feedback after appointments, without over-messaging patients.' },
  { n: '02', title: "AI's Job", summary: 'Predict the likelihood that a patient will leave feedback without a reminder.' },
  {
    n: '03', title: 'Judgment & Authority',
    summary: 'Define exactly what AI can decide on its own, and where it has to stop.',
    rule: { ifLines: ['likelihood < 40%', 'no opt-out', 'no open complaint'], then: 'send reminder' },
    classes: [
      { tag: 'Machine can check', note: 'Likelihood below 40% — AI acts.' },
      { tag: 'Machine can check with proof', note: 'Opt-out confirmed against the consent record — AI acts.' },
      { tag: 'Needs a person’s judgment', note: 'Open complaint — AI refers to the patient experience lead.' },
      { tag: 'Needs more authority', note: 'Safety issue — AI escalates to the clinical lead.' },
    ],
  },
  { n: '04', title: 'Input', summary: 'Patient ID · Last appointment date · Service type · Prior feedback history · Consent status · Open complaint flag.' },
  { n: '05', title: 'Training Data & Context', summary: 'Learns from past appointments, feedback outcomes, and reminder history. It’s given approved message templates, tone guidelines, and a clear definition of what counts as feedback.' },
  { n: '06', title: 'Feedback & Record', summary: 'Tracks whether reminded patients left feedback, and logs every case — sent automatically or referred, under which rule, on which facts.' },
  { n: '07', title: 'Outcome', summary: 'Feedback rate rises from the baseline, while reminders sent per patient fall. Referred cases stay a small share and are all handled within two working days.' },
]

const outputFlow = ['Action', "AI's Job", 'Judgment & Authority', 'Input', 'Training', 'Feedback & Record', 'Outcome']

const sessionRows: { week: string; tag: string; title: string; desc: string; host: string; role: string }[] = [
  { week: 'Part 01', tag: 'Worked Example · 15 min', title: 'One Workflow, Start to Finish', desc: 'A worked example, taken from messy workflow to finished specification, so you see where the session is heading.', host: 'Allan Sendagi', role: 'Author, The AI Roadmap' },
  { week: 'Part 02', tag: 'Map and Label · 25 min', title: 'Map and Label Your Workflow', desc: 'Lay out your workflow in 6–10 steps and label each one: AI assists · AI performs · Agent runs it · Stays human · Not worth changing.', host: 'Allan Sendagi', role: 'Author, The AI Roadmap' },
  { week: 'Part 03', tag: 'Choose · 10 min', title: 'Pick One Task', desc: 'Choose the single step worth changing first.', host: 'Allan Sendagi', role: 'Author, The AI Roadmap' },
  { week: 'Part 04', tag: 'Build · 55 min (includes a 5-min break)', title: 'Build the Canvas, With Live Challenge', desc: 'Work through the AI Task Canvas for your task. Vague answers get questioned live until they are specific.', host: 'Allan Sendagi', role: 'Author, The AI Roadmap' },
  { week: 'Part 05', tag: 'Agent Design · 25 min', title: 'Agent Design and Pressure Test', desc: "Define the agent's steps, systems, hand-offs, and what it must never do. Then pressure-test the whole design.", host: 'Allan Sendagi', role: 'Author, The AI Roadmap' },
  { week: 'Part 06', tag: 'Specify · 20 min', title: 'Write Your Specification', desc: 'Finish with a one-page AI Task Specification you can hand to a developer or vendor.', host: 'Allan Sendagi', role: 'Author, The AI Roadmap' },
]

const seatIncludes = [
  'Live 2.5-hour working session',
  'Your workflow mapped and labelled',
  'Completed AI Task Canvas',
  'One-page AI Task Specification',
  'Agent design: steps, systems and limits',
  'A first test to run',
  'Direct working feedback',
]


const faqs: { q: string; a: string; aRich?: React.ReactNode }[] = [
  {
    q: 'Do I need to be technical to do this?',
    a: 'No. This is not a coding workshop and you do not need to know how to build AI systems. You bring a real business task and work through the AI Task Canvas with guided instruction. The goal is to define the work clearly enough that the technical implementation becomes easier to understand, evaluate, and build.',
  },
  {
    q: 'How is this different from asking ChatGPT to plan my AI project?',
    a: "ChatGPT can generate strategies, ideas, and recommendations. But a generated answer is not a specification of what your organisation intends to change. The AI Task Canvas forces your organisation to make the decisions that matter: what task is being changed, what AI's job is, what judgment follows, what information, training data, and context are required, how the system receives feedback, and what business outcome defines success. The result is specific to your task, your workflow, your decisions, your data, and your definition of value — not a generic answer that could be given to another organisation. ChatGPT can help generate the ideas. The Canvas makes the organisation specify what it actually intends to build.",
    aRich: (
      <>
        ChatGPT can generate strategies, ideas, and recommendations. But a generated answer is not a
        specification of what your organisation intends to change.
        <br /><br />
        The AI Task Canvas forces your organisation to make the decisions that matter:{' '}
        <strong style={{ color: '#F5F1EA' }}>
          what task is being changed, what AI&apos;s job is, what judgment follows, what information,
          training data, and context are required, how the system receives feedback, and what business
          outcome defines success.
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
    q: 'What will I actually have at the end?',
    a: "Your workflow mapped with every step labelled, one completed AI Task Canvas for the task you picked, and a one-page AI Task Specification you can hand to a developer or vendor. You also leave with the agent design for your workflow and a first test to run in the next two weeks.",
  },
  {
    q: "What if I don't have a specific AI idea yet?",
    a: "That's fine. You do not need to arrive with a fully formed AI use case. You need a real business task that could be improved. We will help you identify and sharpen the task before working through the Canvas. Not sure which process to bring? Try the 5-minute Pick Your Process exercise.",
    aRich: (
      <>
        That&apos;s fine. You do not need to arrive with a fully formed AI use case. You need a real business task that
        could be improved. We will help you identify and sharpen the task before working through the Canvas.{' '}
        Not sure which process to bring?{' '}
        <a href="/pick-your-task" style={{ color: '#F5F1EA', fontWeight: 700 }}>
          Try the 5-minute Pick Your Process exercise &rarr;
        </a>
      </>
    ),
  },
  {
    q: 'What should I bring?',
    a: "Bring one workflow you are responsible for, ideally one that eats your team's time. After you register you will get a short pre-work email to help you list its steps (6–10 is ideal). You do not need to prepare a technical specification.",
  },
  {
    q: 'Is the Canvas a strategy tool or a technical specification?',
    a: "Both. The AI Task Canvas combines the strategic and development decisions needed to define an AI intervention. It connects the business task and the value it should create with AI's job, judgment & authority, inputs, training data & context, feedback & record, and outcomes needed to develop and evaluate it. You are not creating a strategy document and then translating it into a technical specification. The Canvas does both in one framework.",
    aRich: (
      <>
        <strong style={{ color: '#F5F1EA' }}>Both.</strong>
        <br /><br />
        The AI Task Canvas combines the strategic and development decisions needed to define an AI
        intervention. It connects the business task and the value it should create with AI&apos;s job,
        judgment &amp; authority, inputs, training data &amp; context, feedback &amp; record, and outcomes needed to develop and evaluate it.
        <br /><br />
        You are not creating a strategy document and then translating it into a technical specification.{' '}
        <strong style={{ color: '#F5F1EA' }}>The Canvas does both in one framework.</strong>
      </>
    ),
  },
  {
    q: 'I want AI across my whole business. Will this help?',
    a: 'Yes. We map one workflow and specify the highest-value task in it. The same method then applies to the rest of the business, one workflow at a time.',
  },
  {
    q: 'Does this cover AI agents?',
    a: "Yes. Every step of your workflow is checked for agent work, and you leave with the agent's steps, systems, hand-offs, and what it must never do.",
  },
  {
    q: 'How do I pay?',
    a: 'By card, or ask for an invoice. Price is $275 per seat (AED 1,000 or QAR 990).',
  },
  {
    q: 'What if it is not useful?',
    a: "Full refund if you don't leave with a specification you'd use.",
  },
]

const funnelSteps = ['AI IDEA', 'REAL BUSINESS TASK', '7-ELEMENT CANVAS', 'AI INTERVENTION', 'MEASURABLE OUTCOME']

const navLinks = [
  { label: 'PROGRAM', href: '#program' },
  { label: 'ABOUT ALLAN', href: '#about' },
  { label: 'ENROLLMENT', href: '#enrollment' },
  { label: 'FAQ', href: '#faq' },
]

// Fill in after Cohort 1. The section stays hidden while this is empty.
const launchParticipantQuotes: { quote: string; name: string; role: string }[] = []

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

        {/* Announcement bar now lives in the root layout (components/SiteBanner.tsx) */}

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
          <p style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.4rem)', fontWeight: 700, color: C.white, lineHeight: 1.5, margin: '0 auto 16px', maxWidth: 760, fontFamily: bodyFont, textWrap: 'balance' }}>
            Go from AI experiments to one AI task you can build next week.
          </p>
          <p style={{ fontSize: 16, color: C.body, lineHeight: 1.65, margin: '0 auto 36px', maxWidth: 640, fontFamily: bodyFont, textWrap: 'balance' }}>
            Bring the process that eats your week. In 2.5 hours, find the work AI and agents should do in it, and leave with a one-page specification.
          </p>

          <TrackedLink
            href="/checkout"
            location="hero"
            style={{
              display: 'inline-flex', alignItems: 'center', background: C.accent, color: C.white,
              padding: '16px 48px', borderRadius: 15, fontSize: 14, fontWeight: 800,
              textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
            }}
          >
            Join Cohort 2
          </TrackedLink>
          <p style={{ margin: '18px 0 0' }}>
            <a href="#session-breakdown" style={{ color: C.muted, fontSize: 13.5, textDecoration: 'underline', fontFamily: bodyFont }}>
              See how it works &darr;
            </a>
          </p>
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
              Not another list of AI ideas. One workflow mapped, and one task <strong style={{ color: C.white }}>specified well enough to build.</strong>
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
            <TrackedLink
              href="/checkout"
              location="walkaway_section"
              style={{
                display: 'inline-flex', alignItems: 'center', background: C.accent, color: C.white,
                padding: '16px 48px', borderRadius: 15, fontSize: 14, fontWeight: 800,
                textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
              }}
            >
              I Want a Defined AI Intervention
            </TrackedLink>
          </div>
        </section>

        {/* ── The framework ── */}
        <section id="program" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 40px', scrollMarginTop: 64 }}>
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
              Every element forces one more decision you can&apos;t leave undefined — what AI&apos;s job is, what
              data it needs, where authority sits, and how you&apos;ll know it worked. You leave with
              all seven answered for your own task.
              <br /><br />
              The Canvas combines the strategic and development decisions needed to define an AI intervention.
              <br /><br />
              <strong style={{ color: C.white }}>An AI idea describes a possibility. An AI Task Canvas specifies an intervention.</strong>
            </p>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20,
            marginBottom: 20, padding: '18px 22px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
          }}>
            {canvasHeader.map(h => (
              <div key={h.title}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: '0.08em', margin: '0 0 4px' }}>
                  {h.title.toUpperCase()}
                </p>
                <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.5, fontFamily: bodyFont }}>{h.def}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {canvasElements.map(el => (
              <div key={el.n} className="canvas-card" style={{ background: C.card, border: '1px solid transparent', borderRadius: 10, padding: '24px 22px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: '0.08em', margin: '0 0 8px' }}>
                  ELEMENT {el.n}
                </p>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px', textTransform: 'none' }}>{el.title}</h3>
                <p style={{ fontSize: 14, color: C.body, margin: '0 0 10px', lineHeight: 1.6, fontFamily: bodyFont, textTransform: 'none' }}>{el.def}</p>
                <p style={{ fontSize: 13, color: C.muted, margin: el.extra ? '0 0 10px' : 0, lineHeight: 1.5, fontFamily: bodyFont, textTransform: 'none' }}>{el.example}</p>
                {el.extra && (
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, margin: 0, lineHeight: 1.5, letterSpacing: '0.01em' }}>{el.extra}</p>
                )}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: C.muted, textAlign: 'center', margin: '28px 0 0', fontFamily: bodyFont, lineHeight: 1.7 }}>
            Based on the AI Canvas by Ajay Agrawal, Joshua Gans and Avi Goldfarb, <em style={{ fontStyle: 'normal' }}>Prediction
            Machines</em>.
          </p>
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

          <CanvasBuilder
            label={OUTPUT_LABEL}
            task={OUTPUT_TASK}
            owner={OUTPUT_OWNER}
            baseline={OUTPUT_BASELINE}
            target={OUTPUT_TARGET}
            ideaQuote={OUTPUT_IDEA}
            stages={canvasStages}
            flowLine={OUTPUT_FLOW_LINE}
            interventionSummary={OUTPUT_INTERVENTION}
            accent={C.accent}
          />

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
              <TrackedLink
                href="/checkout"
                location="canvas_output_section"
                style={{
                  display: 'inline-flex', alignItems: 'center', background: C.accent, color: C.white,
                  padding: '16px 48px', borderRadius: 15, fontSize: 14, fontWeight: 800,
                  textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
                }}
              >
                Turn My Task Into an AI Specification
              </TrackedLink>
            </div>
          </div>
        </section>

        {/* ── Session breakdown ── */}
        <section id="session-breakdown" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px', scrollMarginTop: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', margin: 0, whiteSpace: 'nowrap' }}>
              SESSION BREAKDOWN
            </p>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
            {sessionRows.map((r, i) => (
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
            ))}
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="enrollment" style={{ maxWidth: 640, margin: '0 auto', padding: '80px 24px', scrollMarginTop: 64 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.14em', textAlign: 'center', margin: '0 0 12px' }}>
            COHORT 2 PRICING
          </p>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 700, color: C.white, textAlign: 'center', margin: '0 0 32px', textTransform: 'none' }}>
            Cohort 2 of AI Value / Sandbox
          </h2>

          <div style={{
            border: `1.5px solid ${C.accent}`, borderRadius: 14, padding: '40px 36px',
            background: '#0c0c0c', boxShadow: '0 0 40px rgba(194,65,12,0.1)', textAlign: 'center',
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 24px', fontFamily: bodyFont }}>
              10 Seats &middot; 1 Working Session
            </p>

            <p style={{ fontSize: 'clamp(2.4rem, 6vw, 3.2rem)', fontWeight: 900, color: C.white, margin: '0 0 4px' }}>
              $275
            </p>
            <p style={{ fontSize: 14, color: C.muted, margin: '0 0 8px', fontFamily: bodyFont }}>
              AED 1,000 &middot; QAR 990
            </p>
            <p style={{ fontSize: 14, color: C.muted, margin: '0 0 24px', fontFamily: bodyFont }}>
              Saturday, {WORKSHOP_DATE.replace(', 2026', '')} &middot; {WORKSHOP_TIME} &middot; 2.5 hours &middot; Live online
            </p>
            <p style={{ fontSize: 15, color: C.body, lineHeight: 1.7, margin: '0 0 32px', fontFamily: bodyFont, textAlign: 'left' }}>
              Limited to <strong style={{ color: C.white }}>10 seats</strong> so I can work on your actual workflow
              with you, not a hypothetical one. This is a working session, not a webinar.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
              {seatIncludes.map(item => (
                <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.6, fontFamily: bodyFont }}>
                  <span style={{ color: C.accent, flexShrink: 0, fontWeight: 700 }}>&rarr;</span>
                  <span style={{ color: C.body }}>{item}</span>
                </li>
              ))}
            </ul>

            <TrackedLink
              href="/checkout"
              location="pricing"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: C.accent, color: C.white, padding: '16px 24px', borderRadius: 12,
                fontSize: 14, fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
              }}
            >
              Reserve Your Seat
            </TrackedLink>
            <p style={{ fontSize: 13, color: C.body, textAlign: 'center', margin: '14px 0 0', fontFamily: bodyFont, lineHeight: 1.6 }}>
              <strong style={{ color: C.white }}>Full refund</strong> if you don&apos;t leave with a specification you&apos;d use.
            </p>
            <p style={{ fontSize: 13, color: C.muted, textAlign: 'center', margin: '8px 0 0', fontFamily: bodyFont }}>
              Pay by card, or ask for an invoice.
            </p>
          </div>

          <p style={{ textAlign: 'center', color: C.muted, fontSize: 13, margin: '32px 0 0', fontFamily: bodyFont, textTransform: 'none' }}>
            <strong style={{ color: C.white }}>What you&apos;ll need:</strong> One workflow to work on. No technical background required.
          </p>
        </section>

        {/* ── Instructor ── */}
        <section id="about" style={{ borderTop: `1px solid ${C.border}`, background: '#0c0c0c', padding: '80px 24px', scrollMarginTop: 64 }}>
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
                  he built{' '}
                  <a href="https://www.nomosprotocol.com/" target="_blank" rel="noopener noreferrer" style={{ color: C.white, fontWeight: 700, textDecoration: 'none' }}>NOMOS Protocol</a>, an infrastructure specification
                  for machine-verifiable institutional authority (how an organisation can prove an AI acted within
                  the authority it was given), and developed{' '}
                  <a href="https://www.computableauthority.com/" target="_blank" rel="noopener noreferrer" style={{ color: C.white, fontWeight: 700, textDecoration: 'none' }}>Computable Authority</a>, a proposed runtime architecture
                  for binding institutional authority to machine-executed action, put forward through the
                  OECD&apos;s 2026 public consultation on Law as Code.
                </p>
                <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, margin: '0 0 28px', fontFamily: bodyFont, textTransform: 'none' }}>
                  This workshop is the front end of that work. Before AI can be trusted with a decision, someone
                  has to define exactly what it should decide, with what information, and how its results will
                  be judged. That&apos;s what you&apos;ll do here, for one task of your own.
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

        {/* ── What launch participants said (hidden until filled) ── */}
        {launchParticipantQuotes.length > 0 && (
          <section style={{ padding: '80px 24px', textAlign: 'center', borderTop: `1px solid ${C.border}` }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.16em', margin: '0 0 40px' }}>
              WHAT LAUNCH PARTICIPANTS SAID
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
              {launchParticipantQuotes.map(q => (
                <div key={q.name} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '28px 24px', textAlign: 'left' }}>
                  <p style={{ fontSize: 16, lineHeight: 1.7, color: C.white, margin: '0 0 16px', fontFamily: bodyFont }}>&ldquo;{q.quote}&rdquo;</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: C.white, margin: '0 0 2px', fontFamily: bodyFont }}>{q.name}</p>
                  <p style={{ fontSize: 12, color: C.muted, margin: 0, fontFamily: bodyFont }}>{q.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

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
        <section id="faq" style={{ borderTop: `1px solid ${C.border}`, background: '#0c0c0c', padding: '80px 24px', scrollMarginTop: 64 }}>
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
                You leave knowing exactly where AI belongs in one real workflow: what it should do, where it stops, and how you&apos;ll know it worked.
              </p>
            </div>

            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.14em', margin: '0 0 28px' }}>
                QUESTIONS YOU MAY BE ASKING
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
            You walked in with a workflow.
          </h2>
          <p style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 700, color: C.accent, margin: '0 0 14px' }}>
            Leave with one task you can actually build.
          </p>
          <p style={{ fontSize: 15, color: C.muted, margin: '0 auto 36px', maxWidth: 520, lineHeight: 1.7, fontFamily: bodyFont, textTransform: 'none' }}>
            From there, you can test it, hand it to your developer next week, brief a vendor, or repeat the method on the next workflow.
          </p>

          <TrackedLink
            href="/checkout"
            location="closer_section"
            style={{
              display: 'inline-flex', alignItems: 'center', background: C.accent, color: C.white,
              padding: '16px 48px', borderRadius: 15, fontSize: 14, fontWeight: 800,
              textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
            }}
          >
            I Want to Make AI Work
          </TrackedLink>
          <p style={{ fontSize: 13, color: C.muted, margin: '18px 0 0', fontFamily: bodyFont, textTransform: 'none' }}>
            10 seats · Cohort 2 · Saturday 24 October
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
            <a href="/assessment" style={{ color: C.muted, textDecoration: 'underline' }}>AI Readiness Quiz</a>
            {' '}&middot;{' '}
            <a href="/pick-your-task" style={{ color: C.muted, textDecoration: 'underline' }}>Pick Your Process</a>
            {' '}&middot;{' '}
            <TrackedLink
              href={`https://wa.me/97450176561?text=${encodeURIComponent("Hi Allan, we're interested in team training using the AI Value Sandbox workshop")}`}
              location="footer_team_training"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: C.muted, textDecoration: 'underline' }}
            >
              Training for Teams
            </TrackedLink>
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
          @keyframes canvasEntryIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .canvas-builder-entry {
            animation: canvasEntryIn 0.25s ease-out;
          }
          @media (prefers-reduced-motion: reduce) {
            .canvas-builder-entry { animation: none; }
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
          html { scroll-behavior: smooth; }
          .mobile-nav { display: none; }
          @media (max-width: 860px) {
            .site-nav-menu { display: none !important; }
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
