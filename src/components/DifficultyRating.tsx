'use client'

import { useEffect, useState } from 'react'
import { getRating, setRating, type Rating } from '@/lib/ratings'

interface Props {
  pair: string
  level: string
  stageNum: number
}

const ratingOptions: { value: Rating; emoji: string; label: string }[] = [
  { value: 1, emoji: '😊', label: 'Easy' },
  { value: 2, emoji: '😐', label: 'Medium' },
  { value: 3, emoji: '😤', label: 'Hard' },
]

export default function DifficultyRating({ pair, level, stageNum }: Props) {
  const [current, setCurrent] = useState<Rating | null>(null)

  useEffect(() => {
    setCurrent(getRating(pair, level, stageNum))
  }, [pair, level, stageNum])

  function handleRate(r: Rating) {
    setRating(pair, level, stageNum, r)
    setCurrent(r)
  }

  return (
    <div className="mt-4">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">How difficult was this stage?</p>
      <div className="flex gap-2">
        {ratingOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => handleRate(opt.value)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
              current === opt.value
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500'
            }`}
          >
            <span>{opt.emoji}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// Small badge for stage list cards
interface BadgeProps {
  pair: string
  level: string
  stageNum: number
}

export function DifficultyBadge({ pair, level, stageNum }: BadgeProps) {
  const [rating, setRatingState] = useState<Rating | null>(null)

  useEffect(() => {
    setRatingState(getRating(pair, level, stageNum))
  }, [pair, level, stageNum])

  if (!rating) return null

  const opt = ratingOptions.find(o => o.value === rating)
  if (!opt) return null

  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
      {opt.emoji}
    </span>
  )
}
