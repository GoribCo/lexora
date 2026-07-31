'use client'

import { useEffect, useState } from 'react'
import { getStreak } from '@/lib/progress'

export default function StreakBadge() {
  const [streak, setStreak] = useState<number | null>(null)

  useEffect(() => {
    const s = getStreak()
    setStreak(s.count)
  }, [])

  if (streak === null) return null

  if (streak === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
        Start your streak!
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded-full">
      🔥 {streak} day{streak === 1 ? '' : 's'}
    </span>
  )
}
