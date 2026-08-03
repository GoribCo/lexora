'use client'

import { useEffect, useState } from 'react'
import { isStageComplete, markStageComplete, updateStreak } from '@/lib/progress'
import { trackStageComplete } from '@/lib/analytics'

interface Props {
  pair: string
  level: string
  stageNum: number
}

export default function MarkComplete({ pair, level, stageNum }: Props) {
  const [completed, setCompleted] = useState(false)
  const [justDone, setJustDone] = useState(false)

  useEffect(() => {
    setCompleted(isStageComplete(pair, level, stageNum))
  }, [pair, level, stageNum])

  function handleMark() {
    markStageComplete(pair, level, stageNum)
    updateStreak()
    trackStageComplete(pair, level, stageNum)
    setCompleted(true)
    setJustDone(true)
    setTimeout(() => setJustDone(false), 2000)
  }

  if (completed) {
    return (
      <div className="mt-6 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        {justDone ? 'Great work! Stage complete!' : 'Stage Complete'}
      </div>
    )
  }

  return (
    <button
      onClick={handleMark}
      className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 text-sm font-medium transition-all"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Mark as Complete
    </button>
  )
}
