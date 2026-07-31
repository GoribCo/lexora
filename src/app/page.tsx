import { getLanguages, getLanguagePairs, getLevels, getStages } from '@/lib/content'
import { parseFlashcardsFromMarkdown } from '@/lib/flashcards'
import HomeClient from './HomeClient'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Lexora – Start Learning',
  description: 'Select your language pair and start learning today.',
}

export default function HomePage() {
  const languages = getLanguages()
  const pairs = getLanguagePairs()
  const levels = getLevels()

  // Build all words for Word of the Day
  const allWords: {
    front: string; pronunciation: string; back: string; english: string
    pair: string; pairLabel: string; level: string; stageNum: number
  }[] = []

  for (const pair of pairs) {
    const pairLabel = `${pair.from.nativeName} → ${pair.to.name}`
    for (const level of levels) {
      const stages = getStages(pair.slug, level.code)
      for (const stage of stages) {
        const cards = parseFlashcardsFromMarkdown(stage.content)
        for (const card of cards) {
          allWords.push({
            front: card.front,
            pronunciation: card.pronunciation,
            back: card.back,
            english: card.english,
            pair: pair.slug,
            pairLabel,
            level: level.code,
            stageNum: stage.number,
          })
        }
      }
    }
  }

  return <HomeClient languages={languages} pairs={pairs} allWords={allWords} />
}
