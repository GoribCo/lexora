import { getLanguagePairs, getLevels, getStages } from '@/lib/content'
import { parseFlashcardsFromMarkdown } from '@/lib/flashcards'
import ProgressClient from './ProgressClient'
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
    title: `Progress – ${pairData.from.name} → ${pairData.to.name}`,
    description: `Track your ${pairData.to.name} vocabulary learning progress.`,
  }
}

export interface LevelProgressData {
  level: string
  levelName: string
  words: { front: string; pair: string; level: string; stageNum: number }[]
}

export interface PairProgressData {
  pair: string
  pairLabel: string
  fromFlag: string
  toFlag: string
  levels: LevelProgressData[]
  totalWords: number
}

export default async function PairProgressPage({
  params,
}: {
  params: Promise<{ pair: string }>
}) {
  const { pair } = await params
  const pairs = getLanguagePairs()
  const pairData = pairs.find(p => p.slug === pair)
  if (!pairData) notFound()

  const levels = getLevels()
  const levelData: LevelProgressData[] = []
  let totalWords = 0

  for (const level of levels) {
    const stages = getStages(pair, level.code)
    const words: { front: string; pair: string; level: string; stageNum: number }[] = []

    for (const stage of stages) {
      const cards = parseFlashcardsFromMarkdown(stage.content)
      for (const card of cards) {
        words.push({ front: card.front, pair, level: level.code, stageNum: stage.number })
      }
    }

    if (words.length > 0) {
      levelData.push({ level: level.code, levelName: level.fullName, words })
      totalWords += words.length
    }
  }

  const pairProgressData: PairProgressData = {
    pair,
    pairLabel: `${pairData.from.nativeName} → ${pairData.to.name}`,
    fromFlag: pairData.from.flag,
    toFlag: pairData.to.flag,
    levels: levelData,
    totalWords,
  }

  return <ProgressClient pairData={pairProgressData} pair={pair} />
}
