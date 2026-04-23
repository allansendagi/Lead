import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Script from 'next/script'
import CTAButton from '@/components/CTAButton'
import FAQSection from '@/components/FAQSection'
import {
  getAllIndustryCityCombinations,
  getIndustry,
  getCity,
  getComplianceText,
  generateIndustryFAQs,
  industries,
} from '@/lib/industries-dataset'
import { faqSchema } from '@/lib/schema'

export function generateStaticParams() {
  return getAllIndustryCityCombinations().map(({ industry, city }) => ({ industry, city }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string; city: string }>
}): Promise<Metadata> {
  const { industry: indSlug, city: citySlug } = await params
  const ind = getIndustry(indSlug)
  const city = getCity(citySlug)
  if (!ind || !city) return {}
  const title = `How ${ind.display} Businesses in ${city.display} Can Use AI in 2026`
  const description = `A practical guide to AI for ${ind.display} businesses in ${city.display} — the highest-value use cases, what each requires, and how to start. Based on the AI Navigator framework by Allan Sendagi.`
  const url = `https://www.ainavsystem.com/industries/${indSlug}/${citySlug}/`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
  }
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ industry: string; city: string }>
}) {
  const { industry: indSlug, city: citySlug } = await params
  const ind = getIndustry(indSlug)
  const city = getCity(citySlug)
  if (!ind || !city) notFound()

  const faqs = generateIndustryFAQs(ind, city)
  const faqJsonLd = faqSchema(faqs)
  const pageUrl = `https://www.ainavsystem.com/industries/${indSlug}/${citySlug}/`

  const otherIndustries = industries.filter(i => i.slug !== indSlug).slice(0, 8)

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '40px 24px',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 40,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) 260px',
            gap: 48,
            alignItems: 'start',
          }}
          className="industry-layout"
        >
          {/* Main content */}
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span aria-hidden="true"> › </span>
              <a href="/industries/">Industries</a>
              <span aria-hidden="true"> › </span>
              <a href={`/industries/${indSlug}/doha/`}>{ind.display}</a>
              <span aria-hidden="true"> › </span>
              <span>{city.shortDisplay}</span>
            </nav>

            <h1 style={{ fontSize: 'clamp(24px,4vw,32px)', lineHeight: 1.25, marginBottom: 24 }}>
              How {ind.display} Businesses in {city.display} Can Use AI in 2026
            </h1>

            {/* Section 1 — Local context */}
            <p style={{ fontSize: 18, lineHeight: 1.7 }}>
              {city.display}&apos;s {ind.display.toLowerCase()} sector operates in a distinctive
              environment. {city.localContext} For businesses in this sector, the pressure to adopt
              AI is real — and the window to establish a competitive advantage through early
              adoption is open right now.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.7 }}>
              This guide covers the highest-value AI opportunities available to {ind.display}{' '}
              businesses in {city.display} today — what each use case does, what it requires to
              implement, and how to sequence them correctly so each phase builds on the last.
            </p>

            {/* Section 2 — Highest value opportunity */}
            <h2>
              The Highest-Value AI Opportunity for {ind.display} Businesses in {city.display}
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.7 }}>
              The single most impactful AI use case for most {ind.display} businesses is{' '}
              {ind.topT1UseCase}. This use case addresses the {ind.primaryWorkflow} workflow — one
              of the highest-frequency, most time-consuming processes in {ind.display.toLowerCase()}{' '}
              operations — and it can be deployed without any historical data, making it available
              from day one.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.7 }}>
              {ind.keyBenchmark}. For a {ind.display} business in {city.display} operating in a
              market with {city.localContextShort}, the commercial case is direct: the time saved on{' '}
              {ind.primaryWorkflow} is time redirected to the higher-value work that drives revenue
              and customer loyalty.
            </p>

            <div className="cta-box" style={{ margin: '32px 0' }}>
              <CTAButton href="/" location={`industry_mid_${indSlug}_${citySlug}`} />
            </div>

            {/* Section 3 — Three tiers */}
            <h2>
              A Phased AI Roadmap for {ind.display} in {city.display}
            </h2>

            <h3>Tier 1 — Deploy at Launch, No Historical Data Required</h3>
            <p style={{ fontSize: 18, lineHeight: 1.7 }}>
              Tier 1 use cases are deployable immediately, regardless of how long your business has
              been operating digitally. They require no historical transaction data — only your
              current operational information and a structured implementation plan.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.7 }}>
              For {ind.display} businesses in {city.display}, the highest-priority Tier 1 use cases
              are: {ind.t1.join(', ')}. Each of these addresses a workflow that is currently
              consuming staff time on tasks that are highly repetitive, rule-based, and directly
              connected to customer experience or operational efficiency.
            </p>

            <h3>Tier 2 — Months 2–4, Builds on Initial Operational Data</h3>
            <p style={{ fontSize: 18, lineHeight: 1.7 }}>
              Once your business has 30 to 60 days of operational data — customer interactions,
              transaction records, or operational metrics depending on your sector — Tier 2 use
              cases become available. These use cases deliver measurably higher value than Tier 1
              because they learn from your specific business patterns rather than operating on
              general rules.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.7 }}>
              For {ind.display} businesses in {city.display}, the priority Tier 2 use cases are:{' '}
              {ind.t2.join(' and ')}. Both use cases require the data infrastructure established
              during Tier 1 deployment and produce results that compound as more data accumulates.
            </p>

            <h3>Tier 3 — Months 5–12, Deep Data Required</h3>
            <p style={{ fontSize: 18, lineHeight: 1.7 }}>
              Tier 3 use cases require 6 to 12 months of structured operational history. They
              deliver the highest long-term value — predictive capabilities that create competitive
              advantages that are genuinely difficult to replicate quickly.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.7 }}>
              For {ind.display} businesses in {city.display}, the Tier 3 use cases worth building
              toward are: {ind.t3.join(' and ')}.
            </p>

            {/* Section 4 — Compliance */}
            <h2>
              Data and Compliance Considerations for {ind.display} Businesses in {city.display}
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.7 }}>
              {getComplianceText(city, ind.display)}
            </p>

            {/* Section 5 — What this requires */}
            <h2>What This Requires From Your {ind.display} Business</h2>
            <p style={{ fontSize: 18, lineHeight: 1.7 }}>
              Three things determine whether AI delivers real value for a {ind.display} business in{' '}
              {city.display} or joins the list of expensive experiments that did not pan out.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.7 }}>
              <strong>Structured operational data.</strong> The quality of AI outcomes is
              proportional to the quality of the data it runs on. Before implementing any Tier 2 or
              Tier 3 use case, the data it requires must exist in accessible, structured form.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.7 }}>
              <strong>A plan before a tool.</strong> The most common AI mistake is selecting tools
              before defining use cases. The AI Navigator framework ensures every tool selection is
              preceded by a documented business goal, a workflow analysis, and an AI Task Canvas
              that specifies exactly what the system needs to do.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.7 }}>
              <strong>A structured implementation sequence.</strong> Tier 1 generates the data Tier
              2 needs. Tier 2 generates the data Tier 3 needs. Each phase builds on the last. A
              business that tries to implement Tier 3 capabilities before Tier 1 is live is
              attempting to run before it can walk.
            </p>

            {/* Section 6 — CTA */}
            <div className="cta-box">
              <h2 style={{ marginTop: 0 }}>
                Assess Your {ind.display} Business&apos;s AI Readiness
              </h2>
              <p>
                The AI Readiness Assessment evaluates your business across five dimensions —
                workflow type, decision complexity, data availability, process volume, and team size
                — and gives you a personalised score with specific recommended next steps. It takes
                three minutes and is built on the same methodology used in every AI Navigator
                engagement.
              </p>
              <CTAButton href="/" location={`industry_cta_${indSlug}_${citySlug}`} />
            </div>

            {/* Section 7 — FAQ */}
            <section>
              <h2>Frequently Asked Questions</h2>
              <FAQSection faqs={faqs} />
            </section>

            {/* Section 8 — Internal links */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 24, marginTop: 32 }}>
              <p style={{ fontWeight: 600, marginBottom: 12 }}>Related guides</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li><a href="/resources/how-to-implement-ai-in-business-qatar/">How to implement AI in your business</a></li>
                <li><a href="/resources/ai-implementation-plan-sme/">What is an AI implementation plan?</a></li>
                <li><a href="/resources/ai-consulting-cost-qatar/">How much does AI consulting cost in Qatar?</a></li>
                <li><a href="/resources/ai-navigator-framework/">The AI Navigator framework</a></li>
                <li><a href="/resources/is-my-business-ready-for-ai/">Is my business ready for AI?</a></li>
                {ind.resourceSlug && (
                  <li>
                    <a href={`/resources/${ind.resourceSlug}/`}>
                      AI for {ind.display} — in-depth guide
                    </a>
                  </li>
                )}
                <li><a href="/resources/data-protection-ai-qatar-pdppl/">Data protection and AI in Qatar</a></li>
              </ul>
            </div>

            {/* Section 9 — Author bio */}
            <div className="author-bio">
              <p>
                <strong>Allan Sendagi</strong> is the author of <em>The AI Roadmap</em> and founder
                of SafeHaven AI. He works with {ind.display} businesses in {city.display} and
                across the GCC to build structured AI implementation plans using the AI Navigator
                framework.
              </p>
              <p style={{ marginTop: 8 }}>
                <a href="/" style={{ color: 'var(--brand)', fontWeight: 600 }}>
                  Take the free AI Readiness Assessment
                </a>
                {' · '}
                <a
                  href={process.env.NEXT_PUBLIC_CALENDLY_URL || '#'}
                  style={{ color: 'var(--brand)', fontWeight: 600 }}
                >
                  Book a discovery call
                </a>
              </p>
            </div>
          </div>

          {/* Sidebar — desktop only */}
          <aside
            style={{
              position: 'sticky',
              top: 88,
              background: '#f9fafb',
              borderRadius: 12,
              padding: 24,
            }}
          >
            <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Also in {city.shortDisplay}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {otherIndustries.map(i => (
                <li key={i.slug}>
                  <a
                    href={`/industries/${i.slug}/${citySlug}/`}
                    style={{ fontSize: 14, color: '#374151', textDecoration: 'none' }}
                  >
                    {i.display}
                  </a>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 24 }}>
              <a
                href="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#1C1714',
                  color: '#fff',
                  padding: '12px 16px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: 'none',
                  textAlign: 'center',
                  lineHeight: 1.4,
                }}
              >
                Take the AI Readiness Assessment →
              </a>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .industry-layout {
            grid-template-columns: 1fr !important;
          }
          .industry-layout aside {
            display: none;
          }
        }
      `}</style>
    </>
  )
}
