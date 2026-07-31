'use client'

import { useEffect, useState } from 'react'
import { getLevelCompletion } from '@/lib/progress'

interface Props {
  pair: string
  level: string
  totalStages: number
}

export default function StageCompletionBadge({ pair, level, totalStages }: Props) {
  const [pct, setPct] = useState<number | null>(null)

  useEffect(() => {
    setPct(getLevelCompletion(pair, level, totalStages))
  }, [pair, level, totalStages])

  if (pct === null) return null
  if (pct === 0) return null

  return (
    <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">
      {pct}%
    </span>
  )
}
