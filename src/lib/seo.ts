import type { Metadata } from 'next'
import { getLanguagePairs, getLevels, getStage } from './content'

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lexora.app'

// Shared helper — builds the canonical+OG+Twitter block from title/description/url
function meta(
  title: string,
  description: string,
  url: string,
  type: 'website' | 'article' = 'website',
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type },
    twitter: { card: 'summary', title, description },
  }
}

export function getPairMeta(pair: string): Metadata {
  const pairData = getLanguagePairs().find(p => p.slug === pair)
  if (!pairData) return {}
  return meta(
    `Learn ${pairData.to.name} from ${pairData.from.name}`,
    `Structured CEFR lessons to learn ${pairData.to.name} starting from ${pairData.from.name}. Choose your level from A1 Beginner to C2 Mastery.`,
    `${BASE_URL}/${pair}`,
  )
}

export function getLevelMeta(pair: string, level: string): Metadata {
  const pairData = getLanguagePairs().find(p => p.slug === pair)
  const levelData = getLevels().find(l => l.code === level)
  if (!pairData || !levelData) return {}
  return meta(
    `${levelData.fullName} ${pairData.to.name} Lessons`,
    `${levelData.description} Learn ${pairData.to.name} from ${pairData.from.name} with ${levelData.vocabulary} vocabulary and guided stages.`,
    `${BASE_URL}/${pair}/${level}`,
  )
}

export function getStageMeta(pair: string, level: string, stageNumber: number): Metadata {
  const pairData = getLanguagePairs().find(p => p.slug === pair)
  const levelData = getLevels().find(l => l.code === level)
  const stageData = getStage(pair, level, stageNumber)
  if (!pairData || !levelData || !stageData) return {}
  return meta(
    `${stageData.title} – ${levelData.fullName} ${pairData.to.name}`,
    `${stageData.description} Learn ${stageData.vocabulary} ${pairData.to.name} words in this ${stageData.duration} lesson.`,
    `${BASE_URL}/${pair}/${level}/${stageNumber}`,
    'article',
  )
}

// JSON-LD structured data for a stage page (LearningResource schema)
export function stageJsonLd(pair: string, level: string, stageNumber: number): object | null {
  const levelData = getLevels().find(l => l.code === level)
  const stageData = getStage(pair, level, stageNumber)
  if (!levelData || !stageData) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: stageData.title,
    description: stageData.description,
    url: `${BASE_URL}/${pair}/${level}/${stageNumber}`,
    educationalLevel: levelData.fullName,
    learningResourceType: 'Lesson',
    timeRequired: `PT${stageData.duration.replace(' min', 'M')}`,
    inLanguage: pair.split('-')[1],
    teaches: stageData.title,
    provider: {
      '@type': 'Organization',
      name: 'Lexora',
      url: BASE_URL,
    },
  }
}
