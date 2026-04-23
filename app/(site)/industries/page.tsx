import type { Metadata } from 'next'
import { industries, cities } from '@/lib/industries-dataset'

export const metadata: Metadata = {
  title: 'AI for Every Industry in Qatar & the GCC',
  description:
    'Practical AI implementation guides for 15 industries across Qatar, Dubai, Abu Dhabi, Riyadh, and the wider GCC — use cases, timelines, and compliance guidance.',
  alternates: { canonical: 'https://www.ainavsystem.com/industries/' },
}

export default function IndustriesIndex() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 'clamp(26px,4vw,36px)', marginBottom: 16 }}>
        AI for Every Industry in Qatar &amp; the GCC
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.7, color: '#374151', marginBottom: 40 }}>
        Each industry page covers the highest-value AI use cases for that sector, a phased
        implementation roadmap, data and compliance requirements, and a FAQ section — specific to
        the city and market context. Select your industry and city below.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20,
        }}
      >
        {industries.map(ind => (
          <div
            key={ind.slug}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: 20,
              background: '#fff',
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{ind.display}</h2>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
              Top use case: {ind.topT1UseCase}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {cities.slice(0, 4).map(city => (
                <li key={city.slug}>
                  <a
                    href={`/industries/${ind.slug}/${city.slug}/`}
                    style={{ fontSize: 14, color: '#1C1714', textDecoration: 'none', fontWeight: 500 }}
                  >
                    {ind.display} in {city.shortDisplay} →
                  </a>
                </li>
              ))}
              <li>
                <details style={{ fontSize: 14, color: '#6b7280' }}>
                  <summary style={{ cursor: 'pointer', color: '#6b7280', listStyle: 'none' }}>
                    + {cities.length - 4} more cities
                  </summary>
                  <ul style={{ listStyle: 'none', padding: '8px 0 0', margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {cities.slice(4).map(city => (
                      <li key={city.slug}>
                        <a
                          href={`/industries/${ind.slug}/${city.slug}/`}
                          style={{ fontSize: 14, color: '#1C1714', textDecoration: 'none', fontWeight: 500 }}
                        >
                          {ind.display} in {city.shortDisplay} →
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            </ul>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 48,
          background: '#f3f4f6',
          borderRadius: 12,
          padding: 32,
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>
          Not sure which use cases apply to your business?
        </h2>
        <p style={{ fontSize: 17, color: '#374151', marginBottom: 20 }}>
          The free AI Readiness Assessment identifies your highest-priority use cases based on your
          specific business type, data availability, and workflow complexity. Three minutes.
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
