'use client'

import { useEffect, useState } from 'react'
import { getDueCards, updateCard, type DueCard } from '@/lib/srs'
import { updateStreak } from '@/lib/progress'
import SpeakButton from '@/components/SpeakButton'
import { getLangCode } from '@/lib/languages'

interface Props {
  pair: string
  pairLabel: string
}

export default function ReviewClient({ pair, pairLabel }: Props) {
  const [cards, setCards] = useState<DueCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const langCode = getLangCode(pair)

  useEffect(() => {
    const due = getDueCards(pair)
    setCards(due)
    setLoaded(true)
  }, [pair])

  if (!loaded) {
    return <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">Loading...</div>
  }

  if (cards.length === 0 || done) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">All caught up!</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No more cards due for {pairLabel}. Check back later!
        </p>
      </div>
    )
  }

  const card = cards[currentIndex]
  const total = cards.length
  const progress = Math.round(((currentIndex) / total) * 100)

  function handleScore(score: 1 | 2 | 3) {
    updateCard(card.pair, card.level, card.stage, card.front, score)
    if (currentIndex + 1 >= total) {
      updateStreak()
      setDone(true)
    } else {
      setFlipped(false)
      setCurrentIndex(i => i + 1)
    }
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400">{currentIndex} of {total} reviewed</span>
          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        className="relative cursor-pointer select-none mb-4"
        style={{ perspective: '1200px' }}
        onClick={() => setFlipped(f => !f)}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '180px',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center gap-2"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{card.front}</span>
              <SpeakButton text={card.front} lang={langCode} />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Tap to reveal translation</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-6 flex flex-col items-center justify-center gap-2"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.front}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.level.toUpperCase()} · Stage {card.stage}</p>
          </div>
        </div>
      </div>

      {/* Score buttons — only visible after flip */}
      {flipped && (
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleScore(1)}
            className="flex flex-col items-center gap-1 py-3 px-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors text-sm font-medium"
          >
            <span>😓</span>
            Hard
          </button>
          <button
            onClick={() => handleScore(2)}
            className="flex flex-col items-center gap-1 py-3 px-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/60 transition-colors text-sm font-medium"
          >
            <span>👍</span>
            Good
          </button>
          <button
            onClick={() => handleScore(3)}
            className="flex flex-col items-center gap-1 py-3 px-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition-colors text-sm font-medium"
          >
            <span>🎉</span>
            Easy
          </button>
        </div>
      )}
    </div>
  )
}
