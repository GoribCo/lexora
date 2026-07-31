'use client'

import { useEffect, useState } from 'react'
import { getLevelCompletion } from '@/lib/progress'

interface Props {
  pair: string
  level: string
  totalStages: number
  currentStage: number
}

export default function LevelProgressBar({ pair, level, totalStages, currentStage }: Props) {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    setPct(getLevelCompletion(pair, level, totalStages))
  }, [pair, level, totalStages])

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Stage {currentStage} of {totalStages}
        </span>
        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
          {pct}% complete
        </span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
