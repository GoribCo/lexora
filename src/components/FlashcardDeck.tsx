'use client'

import { useState } from 'react'
import type { Flashcard } from '@/lib/flashcards'
import SpeakButton from './SpeakButton'

interface Props {
  cards: Flashcard[]
  langCode: string  // BCP-47 target language code, e.g. 'de-DE'
}

export default function FlashcardDeck({ cards, langCode }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  if (cards.length === 0) return null

  const card = cards[currentIndex]

  function goNext() {
    setFlipped(false)
    setTimeout(() => setCurrentIndex(i => Math.min(i + 1, cards.length - 1)), 150)
  }

  function goPrev() {
    setFlipped(false)
    setTimeout(() => setCurrentIndex(i => Math.max(i - 1, 0)), 150)
  }

  function handleFlip() {
    setFlipped(f => !f)
  }

  return (
    <div className="mt-8 mb-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
        </svg>
        Vocabulary Flashcards
      </h2>

      {/* Card */}
      <div
        className="relative cursor-pointer select-none"
        style={{ perspective: '1200px' }}
        onClick={handleFlip}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '160px',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center gap-2"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white text-center">{card.front}</span>
              <SpeakButton text={card.front} lang={langCode} />
            </div>
            {card.pronunciation && (
              <p className="text-sm text-indigo-500 dark:text-indigo-400 font-mono">{card.pronunciation}</p>
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Tap to reveal</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-6 flex flex-col items-center justify-center gap-2"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-2xl font-bold text-gray-900 dark:text-white text-center">{card.back}</p>
            {card.english && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{card.english}</p>
            )}
            <p className="text-xs font-mono text-indigo-400 dark:text-indigo-500 mt-1">{card.front}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-4 gap-3">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Previous
        </button>

        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {currentIndex + 1} / {cards.length}
          </span>
          <button
            onClick={handleFlip}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            {flipped ? 'Hide' : 'Flip'}
          </button>
        </div>

        <button
          onClick={goNext}
          disabled={currentIndex === cards.length - 1}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Next
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  )
}
