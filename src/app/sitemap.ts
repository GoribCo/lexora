import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'
import { getLanguagePairs, getLevels, getStages } from '@/lib/content'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lexora.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const pairs = getLanguagePairs()
  const levels = getLevels()
  const entries: MetadataRoute.Sitemap = []

  // Static pages
  entries.push(
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/courses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/review`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  )

  // Pair pages
  for (const pair of pairs) {
    entries.push({
      url: `${BASE_URL}/${pair.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    })

    // Level pages
    for (const level of levels) {
      const stages = getStages(pair.slug, level.code)
      if (stages.length === 0) continue

      entries.push({
        url: `${BASE_URL}/${pair.slug}/${level.code}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })

      // Stage pages
      for (const stage of stages) {
        entries.push({
          url: `${BASE_URL}/${pair.slug}/${level.code}/${stage.number}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    }
  }

  return entries
}
