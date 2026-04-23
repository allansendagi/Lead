import type { MetadataRoute } from 'next'
import { getAllResourceSlugs } from '@/lib/resources-data'
import { industries, cities } from '@/lib/industries-dataset'

const BASE = 'https://www.ainavsystem.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/resources/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/industries/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/book/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/work-with-us/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]

  const resourcePages: MetadataRoute.Sitemap = getAllResourceSlugs().map(slug => ({
    url: `${BASE}/resources/${slug}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const industryPages: MetadataRoute.Sitemap = industries.flatMap(ind =>
    cities.map(city => ({
      url: `${BASE}/industries/${ind.slug}/${city.slug}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  return [...staticPages, ...resourcePages, ...industryPages]
}
