export function orgSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SafeHaven AI',
    url: 'https://www.ainavsystem.com',
    logo: 'https://www.ainavsystem.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English', 'Arabic'],
    },
    sameAs: ['https://www.linkedin.com/in/allansendagi/'],
  }
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function articleAuthorSchema(title: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    author: {
      '@type': 'Person',
      name: 'Allan Sendagi',
      url: 'https://www.ainavsystem.com/book/',
      sameAs: [
        'https://www.linkedin.com/in/allansendagi/',
        'https://allansendagi.gumroad.com/l/ainavigatorsystem',
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: 'SafeHaven AI',
      url: 'https://www.ainavsystem.com',
    },
    url,
  }
}
