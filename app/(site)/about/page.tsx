import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Allan Sendagi — AI Navigator',
  description:
    'Allan Sendagi is the author of The AI Roadmap and founder of SafeHaven AI. He works with SMEs in Qatar and the GCC to build structured AI implementation plans.',
  alternates: { canonical: 'https://www.ainavsystem.com/about/' },
}

export default function AboutPage() {
  return (
    <div className="article-wrap">
      <h1>About Allan Sendagi</h1>

      <div
        style={{
          background: '#f9fafb',
          borderRadius: 12,
          padding: 24,
          marginBottom: 32,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: '#e5e7eb',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            color: '#9ca3af',
          }}
        >
          Photo
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 20, margin: '0 0 4px' }}>Allan Sendagi</p>
          <p style={{ color: '#6b7280', margin: '0 0 8px', fontSize: 15 }}>
            Founder, SafeHaven AI · Author, The AI Roadmap
          </p>
          <a
            href={process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/allansendagi/'}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 14, color: '#1C1714', fontWeight: 600 }}
          >
            LinkedIn Profile →
          </a>
        </div>
      </div>

      <p>
        Allan Sendagi is an AI implementation consultant based in Doha, Qatar. He works with
        business owners and senior managers across Qatar and the GCC who want to implement AI
        practically — with a clear plan, a structured sequence, and measurable outcomes — rather
        than experimenting with tools and hoping for the best.
      </p>

      <p>
        His work is structured around one framework: the AI Navigator. The framework addresses the
        most common reason AI projects fail — not the technology, but the absence of a plan before
        a tool. Every AI Navigator engagement begins with an AI Readiness Assessment, moves through
        a three-tier use case roadmap, and ends with a system that is live, generating data, and
        compounding in value over time.
      </p>

      <h2>The AI Roadmap</h2>

      <p>
        Allan is the author of <em>The AI Roadmap</em> — a practical guide to AI implementation
        for business owners who have no prior technical background. The book covers the AI
        Navigator framework in full: how to assess readiness, how to select use cases, how to
        sequence implementation, and how to measure outcomes. It is available on Gumroad.
      </p>

      <p>
        <a
          href="https://allansendagi.gumroad.com/l/ainavigatorsystem"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#1C1714', fontWeight: 600 }}
        >
          Get The AI Roadmap on Gumroad →
        </a>
      </p>

      <h2>SafeHaven AI</h2>

      <p>
        SafeHaven AI is the consulting practice through which Allan delivers AI Navigator
        engagements. The practice operates in Qatar and works with clients across the GCC. Every
        engagement is structured, documented, and delivered with a clear outcome — a functioning AI
        system, a trained team, and a roadmap for the next phase.
      </p>

      <h2>Work With Allan</h2>

      <p>
        If you are a business owner or manager in Qatar or the GCC and you are ready to implement
        AI with a structured plan rather than another experiment, the right starting point is the
        free AI Readiness Assessment. It takes three minutes and produces a personalised score with
        specific next steps.
      </p>

      <div className="cta-box">
        <h2 style={{ marginTop: 0 }}>Start with the AI Readiness Assessment</h2>
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
        <p style={{ marginTop: 12, fontSize: 15 }}>
          Or{' '}
          <a
            href={process.env.NEXT_PUBLIC_CALENDLY_URL || '#'}
            style={{ color: '#1C1714', fontWeight: 600 }}
          >
            book a free 15-minute discovery call
          </a>{' '}
          to discuss your specific situation.
        </p>
      </div>
    </div>
  )
}
