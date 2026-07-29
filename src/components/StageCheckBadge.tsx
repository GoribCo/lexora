'use client'

import { useEffect, useState } from 'react'
import { isStageComplete } from '@/lib/progress'

interface Props {
  pair: string
  level: string
  stageNum: number
}

export default function StageCheckBadge({ pair, level, stageNum }: Props) {
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    setComplete(isStageComplete(pair, level, stageNum))
  }, [pair, level, stageNum])

  if (!complete) return null

  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Done
    </span>
  )
}
