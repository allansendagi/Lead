import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Script from 'next/script'
import CTAButton from '@/components/CTAButton'
import FAQSection from '@/components/FAQSection'
import { getAllResourceSlugs, getResourcePage } from '@/lib/resources-data'
import { faqSchema, articleAuthorSchema } from '@/lib/schema'

export function generateStaticParams() {
  return getAllResourceSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = getResourcePage(slug)
  if (!page) return {}
  const url = `https://www.ainavsystem.com/resources/${slug}/`
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url,
      type: 'article',
    },
  }
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = getResourcePage(slug)
  if (!page) notFound()

  const pageUrl = `https://www.ainavsystem.com/resources/${slug}/`
  const faqJsonLd = faqSchema(page.faqs)
  const authorJsonLd =
    slug === 'ai-navigator-framework'
      ? articleAuthorSchema(page.title, pageUrl)
      : null

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {authorJsonLd && (
        <Script
          id="author-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(authorJsonLd) }}
        />
      )}

      <div className="article-wrap">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span aria-hidden="true"> › </span>
          <a href="/resources/">Resources</a>
          <span aria-hidden="true"> › </span>
          <span>{page.h1}</span>
        </nav>

        <h1>{page.h1}</h1>

        {page.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        <div className="cta-box" style={{ margin: '32px 0' }}>
          <CTAButton href="/" location={`resource_mid_${slug}`} />
        </div>

        {page.sections.map((sec, i) => (
          <section key={i}>
            {sec.heading && <h2>{sec.heading}</h2>}
            {sec.subHeading && <h3>{sec.subHeading}</h3>}
            {sec.paragraphs.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
          </section>
        ))}

        {page.faqs.length > 0 && (
          <section>
            <h2>Frequently Asked Questions</h2>
            <FAQSection faqs={page.faqs} />
          </section>
        )}

        <div className="cta-box">
          <h2 style={{ marginTop: 0 }}>Ready to assess your AI readiness?</h2>
          <p>
            The AI Readiness Assessment evaluates your business across five dimensions — workflow
            type, decision complexity, data availability, process volume, and team size — and
            gives you a personalised score with specific recommended next steps. It takes three
            minutes.
          </p>
          <CTAButton href="/" location={`resource_bottom_${slug}`} />
        </div>

        {page.authorNote && (
          <div className="author-bio">
            <p>{page.authorNote}</p>
          </div>
        )}

        <div className="author-bio">
          <p>
            <strong>Allan Sendagi</strong> is the author of <em>The AI Roadmap</em> and founder of
            SafeHaven AI. He works with SMEs across Qatar and the GCC to build structured AI
            implementation plans using the AI Navigator framework.
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

        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 24, marginTop: 32 }}>
          <p style={{ fontWeight: 600, marginBottom: 12 }}>Related guides</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><a href="/resources/how-to-implement-ai-in-business-qatar/">How to implement AI in your business</a></li>
            <li><a href="/resources/ai-implementation-plan-sme/">What is an AI implementation plan?</a></li>
            <li><a href="/resources/ai-consulting-cost-qatar/">How much does AI consulting cost in Qatar?</a></li>
            <li><a href="/resources/ai-navigator-framework/">The AI Navigator framework</a></li>
            <li><a href="/resources/is-my-business-ready-for-ai/">Is my business ready for AI?</a></li>
            <li><a href="/resources/data-protection-ai-qatar-pdppl/">Data protection and AI in Qatar</a></li>
          </ul>
        </div>
      </div>
    </>
  )
}
