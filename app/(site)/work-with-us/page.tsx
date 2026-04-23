import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work With Allan — AI Navigator Engagements',
  description:
    'AI Navigator engagements for SMEs in Qatar and the GCC. Three structured tiers: AI Readiness Assessment + Roadmap, Tier 1 Deployment, and Enterprise. Starting at $997.',
  alternates: { canonical: 'https://www.ainavsystem.com/work-with-us/' },
}

const tiers = [
  {
    name: 'Starter',
    price: '$997',
    description: 'AI Readiness Assessment + 90-Day Implementation Roadmap',
    includes: [
      'Full AI Readiness Assessment — five-dimension scoring across workflow type, decision complexity, data availability, process volume, and team size',
      'Prioritised use case list — your top 3–5 AI opportunities ranked by impact and implementation complexity',
      '90-day implementation roadmap — sequenced by tier, with week-by-week milestones',
      'AI Task Canvas for your top use case — the exact specification document used to brief any developer or AI tool vendor',
      'Data inventory review — what data you have, what you need, and what gaps to fill before Tier 2',
      '60-minute strategy session with Allan',
    ],
    cta: 'Start with the Assessment',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$2,497',
    description: 'Full Tier 1 Deployment — 4 to 8 Weeks',
    includes: [
      'Everything in Starter',
      'Full Tier 1 AI deployment — all highest-priority use cases live and generating data',
      'Vendor selection and procurement support — Allan reviews tool options and recommends the right fit for your business, budget, and data context',
      'Implementation oversight — weekly check-ins throughout the deployment phase',
      'Team training — your team knows how to use, monitor, and maintain the systems deployed',
      'Post-deployment review — 30 days after go-live, Allan reviews outcomes and adjusts the Tier 2 roadmap accordingly',
    ],
    cta: 'Book a Discovery Call',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Multi-system AI Implementation for Larger Organisations',
    includes: [
      'Everything in Growth',
      'Multi-department AI roadmap — coordinated across teams and systems',
      'Arabic-language AI system support — for businesses serving Arabic-speaking customers',
      'Data sovereignty architecture review — PDPPL compliance (Qatar), UAE PDPL, Saudi PDPL as applicable',
      'Ongoing advisory retainer — monthly strategic oversight as your AI systems mature into Tier 2 and Tier 3',
      'Dedicated engagement manager',
    ],
    cta: 'Enquire via WhatsApp',
    highlight: false,
  },
]

export default function WorkWithUsPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '97450176561'
  const waLink = `https://wa.me/${waNumber}?text=Hi%20Allan%2C%20I%27m%20interested%20in%20the%20AI%20Navigator%20framework`
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || '#'

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 'clamp(26px,4vw,36px)', marginBottom: 16 }}>Work With Allan</h1>
      <p style={{ fontSize: 18, lineHeight: 1.7, color: '#374151', marginBottom: 48 }}>
        Every AI Navigator engagement is structured around the same methodology: assess first, plan
        second, deploy third. No tool is selected before a use case is defined. No use case is
        deployed before a data review. No data review is complete without a compliance check. The
        result is an AI implementation that works — and compounds in value over time.
      </p>

      {/* Pricing tiers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 56 }}>
        {tiers.map(tier => (
          <div
            key={tier.name}
            style={{
              border: tier.highlight ? '2px solid #1C1714' : '1px solid #e5e7eb',
              borderRadius: 16,
              padding: 32,
              background: tier.highlight ? '#fafaf9' : '#fff',
              position: 'relative',
            }}
          >
            {tier.highlight && (
              <span
                style={{
                  position: 'absolute',
                  top: -12,
                  left: 24,
                  background: '#1C1714',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: 20,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Most Popular
              </span>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{tier.name}</h2>
                <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: 15 }}>
                  {tier.description}
                </p>
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#1C1714' }}>{tier.price}</div>
            </div>
            <ul style={{ paddingLeft: 20, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tier.includes.map((item, i) => (
                <li key={i} style={{ fontSize: 15, lineHeight: 1.6, color: '#374151' }}>
                  {item}
                </li>
              ))}
            </ul>
            {tier.name === 'Starter' ? (
              <a
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#1C1714',
                  color: '#fff',
                  padding: '13px 24px',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {tier.cta} →
              </a>
            ) : tier.name === 'Growth' ? (
              <a
                href={calendlyUrl}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#1C1714',
                  color: '#fff',
                  padding: '13px 24px',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {tier.cta} →
              </a>
            ) : (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#25D366',
                  color: '#fff',
                  padding: '13px 24px',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {tier.cta} →
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Book section */}
      <div
        style={{
          background: '#f9fafb',
          borderRadius: 16,
          padding: 32,
          marginBottom: 40,
        }}
      >
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>The AI Roadmap — Free to Read</h2>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: '#374151', marginBottom: 16 }}>
          Before booking an engagement, read the book. <em>The AI Roadmap</em> covers the full AI
          Navigator framework — the three-tier use case model, the AI Task Canvas, the data
          readiness checklist, and the compliance architecture for GCC businesses. It is the same
          methodology used in every engagement, written for business owners with no technical
          background.
        </p>
        <a
          href="https://allansendagi.gumroad.com/l/ainavigatorsystem"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#1C1714',
            color: '#fff',
            padding: '12px 22px',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Get The AI Roadmap →
        </a>
      </div>

      {/* Discovery call */}
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>Still Have Questions?</h2>
        <p style={{ fontSize: 16, color: '#374151', marginBottom: 20 }}>
          Book a free 15-minute discovery call. No sales pitch — just a direct conversation about
          whether an AI Navigator engagement is the right fit for your business right now.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href={calendlyUrl}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#1C1714',
              color: '#fff',
              padding: '13px 24px',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Book a free 15-minute call →
          </a>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#25D366',
              color: '#fff',
              padding: '13px 24px',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
