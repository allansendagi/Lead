import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Resources for Qatar & GCC Businesses',
  description:
    'Practical guides to AI implementation for SMEs in Qatar and the GCC — how to start, what it costs, industry-specific use cases, and the AI Navigator framework.',
  alternates: { canonical: 'https://www.ainavsystem.com/resources/' },
}

const groups = [
  {
    heading: 'Getting Started',
    pages: [
      { slug: 'how-to-implement-ai-in-business-qatar', title: 'How to Implement AI in Your Business in Qatar' },
      { slug: 'is-my-business-ready-for-ai', title: 'Is My Business Ready for AI?' },
      { slug: 'ai-implementation-plan-sme', title: 'What Is an AI Implementation Plan for an SME?' },
    ],
  },
  {
    heading: 'The Framework',
    pages: [
      { slug: 'ai-navigator-framework', title: 'The AI Navigator Framework — A Complete Guide' },
      { slug: 'ai-strategy-vs-ai-implementation', title: 'AI Strategy vs AI Implementation' },
      { slug: 'how-long-does-ai-implementation-take', title: 'How Long Does AI Implementation Take?' },
    ],
  },
  {
    heading: 'For Your Business',
    pages: [
      { slug: 'ai-consulting-cost-qatar', title: 'How Much Does AI Consulting Cost in Qatar?' },
      { slug: 'how-to-choose-an-ai-consultant-qatar', title: 'How to Choose an AI Consultant in Qatar' },
      { slug: 'ai-tools-for-small-business-qatar', title: 'AI Tools for Small Businesses in Qatar' },
      { slug: 'will-ai-replace-my-employees', title: 'Will AI Replace My Employees?' },
      { slug: 'data-protection-ai-qatar-pdppl', title: 'Data Protection and AI in Qatar — PDPPL Guide' },
    ],
  },
  {
    heading: 'By Industry',
    pages: [
      { slug: 'ai-for-retail-qatar', title: 'AI for Retail Businesses in Qatar' },
      { slug: 'ai-for-luxury-brands-gcc', title: 'AI for Luxury & Jewellery Brands in the GCC' },
      { slug: 'ai-for-logistics-qatar', title: 'AI for Logistics & Supply Chain in Qatar' },
      { slug: 'ai-for-real-estate-qatar', title: 'AI for Real Estate Businesses in Qatar' },
      { slug: 'ai-for-legal-firms-qatar', title: 'AI for Legal Firms in Qatar' },
      { slug: 'ai-for-healthcare-qatar', title: 'AI for Healthcare & Clinics in Qatar' },
      { slug: 'ai-for-financial-services-qatar', title: 'AI for Financial Services in Qatar' },
      { slug: 'ai-for-hospitality-qatar', title: 'AI for Hospitality & Hotels in Qatar' },
      { slug: 'ai-for-restaurants-qatar', title: 'AI for Restaurants & F&B in Qatar' },
    ],
  },
]

export default function ResourcesIndex() {
  return (
    <div className="article-wrap">
      <h1>AI Resources for Qatar &amp; GCC Businesses</h1>
      <p style={{ fontSize: 18, lineHeight: 1.7, color: '#374151', marginBottom: 40 }}>
        Practical guides to AI implementation — written for business owners and managers who need
        real answers, not jargon. Every guide is based on the AI Navigator framework developed by
        Allan Sendagi and used in client engagements across Qatar and the GCC.
      </p>

      {groups.map(group => (
        <section key={group.heading} style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>{group.heading}</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {group.pages.map(p => (
              <li key={p.slug} style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: 14, marginBottom: 14 }}>
                <a
                  href={`/resources/${p.slug}/`}
                  style={{ fontSize: 17, fontWeight: 500, color: '#1C1714', textDecoration: 'none' }}
                >
                  {p.title} →
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div className="cta-box">
        <h2 style={{ marginTop: 0 }}>Not sure where to start?</h2>
        <p>
          Take the free AI Readiness Assessment. It takes three minutes and gives you a
          personalised score and recommended next steps based on your business type, data
          availability, and workflow complexity.
        </p>
        <a
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#1C1714',
            color: '#fff',
            padding: '15px 28px',
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Take the free AI Readiness Assessment →
        </a>
      </div>
    </div>
  )
}
