import { getLanguagePairs, getLevels, getStages } from '@/lib/content'
import { parseFlashcardsFromMarkdown } from '@/lib/flashcards'
import { getLevelMeta } from '@/lib/seo'
import VocabularyClient from './VocabularyClient'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const pairs = getLanguagePairs()
  return pairs.map(p => ({ pair: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>
}): Promise<Metadata> {
  const { pair } = await params
  const pairs = getLanguagePairs()
  const pairData = pairs.find(p => p.slug === pair)
  if (!pairData) return {}
  return {
    title: `Vocabulary – ${pairData.from.name} → ${pairData.to.name}`,
    description: `Browse all vocabulary words for ${pairData.to.name} from ${pairData.from.name}.`,
  }
}

export interface VocabWord {
  front: string
  pronunciation: string
  back: string
  english: string
  pair: string
  level: string
  stageTitle: string
  stageNum: number
}

export default async function PairVocabularyPage({
  params,
}: {
  params: Promise<{ pair: string }>
}) {
  const { pair } = await params
  const pairs = getLanguagePairs()
  const pairData = pairs.find(p => p.slug === pair)
  if (!pairData) notFound()

  const levels = getLevels()
  const words: VocabWord[] = []

  for (const level of levels) {
    const stages = getStages(pair, level.code)
    for (const stage of stages) {
      const cards = parseFlashcardsFromMarkdown(stage.content)
      for (const card of cards) {
        words.push({
          front: card.front,
          pronunciation: card.pronunciation,
          back: card.back,
          english: card.english,
          pair,
          level: level.code,
          stageTitle: stage.title,
          stageNum: stage.number,
        })
      }
    }
  }

  const levelOptions = levels
    .filter(l => getStages(pair, l.code).length > 0)
    .map(l => ({ code: l.code, name: l.fullName }))

  const pairLabel = `${pairData.from.nativeName} → ${pairData.to.name}`

  return (
    <VocabularyClient
      words={words}
      levelOptions={levelOptions}
      pair={pair}
      pairLabel={pairLabel}
    />
  )
}
