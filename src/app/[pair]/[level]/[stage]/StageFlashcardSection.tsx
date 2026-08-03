'use client'

import { useState } from 'react'
import type { Flashcard } from '@/lib/flashcards'
import FlashcardDeck from '@/components/FlashcardDeck'
import QuizMode from '@/components/QuizMode'
import { useUiLang } from '@/components/UiLanguageProvider'

interface Props {
  cards: Flashcard[]
  langCode: string
  pair: string
  level: string
  stage: number
}

export default function StageFlashcardSection({ cards, langCode, pair, level, stage }: Props) {
  const { t } = useUiLang()
  const [mode, setMode] = useState<'flashcards' | 'quiz'>('flashcards')

  if (cards.length === 0) return null

  const showQuizTab = cards.length >= 4

  return (
    <div className="mt-8 mb-4">
      {/* Tab toggle */}
      {showQuizTab && (
        <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
          <button
            onClick={() => setMode('flashcards')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === 'flashcards'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t.stage.flashcards}
          </button>
          <button
            onClick={() => setMode('quiz')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === 'quiz'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t.quiz.title}
          </button>
        </div>
      )}

      {mode === 'flashcards' ? (
        <FlashcardDeck cards={cards} langCode={langCode} pair={pair} level={level} stage={stage} />
      ) : (
        <QuizMode cards={cards} langCode={langCode} pair={pair} level={level} stage={stage} />
      )}
    </div>
  )
}
