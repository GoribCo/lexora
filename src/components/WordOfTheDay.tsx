'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SpeakButton from '@/components/SpeakButton'
import { useUiLang } from '@/components/UiLanguageProvider'
import { getLangCode } from '@/lib/languages'

interface WotdData {
  front: string
  pronunciation: string
  back: string
  english: string
  pair: string
  pairLabel: string
  level: string
  stageNum: number
  langCode: string
}

interface WotdWord {
  front: string
  pronunciation: string
  back: string
  english: string
  pair: string
  pairLabel: string
  level: string
  stageNum: number
}

const levelBadgeMap: Record<string, string> = {
  a1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  a2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  b1: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  b2: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  c1: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  c2: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
}

export default function WordOfTheDay({ allWords }: { allWords: WotdWord[] }) {
  const { t } = useUiLang()
  const [word, setWord] = useState<WotdData | null>(null)

  useEffect(() => {
    if (allWords.length === 0) return

    // Pick based on today's date
    const today = new Date().toISOString().split('T')[0]
    const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0)

    let pool = allWords

    // Try to use words from completed stages
    try {
      const progressRaw = localStorage.getItem('lexora_progress')
      if (progressRaw) {
        const progress = JSON.parse(progressRaw) as Record<string, Record<string, { completedStages: number[] }>>
        const completedWords = allWords.filter(w => {
          const completed = progress[w.pair]?.[w.level]?.completedStages ?? []
          return completed.includes(w.stageNum)
        })
        if (completedWords.length > 0) pool = completedWords
      }
    } catch {
      // fallback to all words
    }

    const idx = seed % pool.length
    const w = pool[idx]
    setWord({
      ...w,
      langCode: getLangCode(w.pair),
    })
  }, [allWords])

  if (!word) return null

  const badgeClass = levelBadgeMap[word.level] ?? levelBadgeMap.a1

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900 p-5 mb-6">
      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-3">
        {t.wotd.title}
      </p>

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{word.front}</span>
            <SpeakButton text={word.front} lang={word.langCode} />
          </div>
          {word.pronunciation && (
            <p className="text-sm text-indigo-500 dark:text-indigo-400 font-mono mb-1">{word.pronunciation}</p>
          )}
          <p className="text-base font-semibold text-gray-800 dark:text-gray-100">{word.back}</p>
          {word.english && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{word.english}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${badgeClass}`}>
            {word.level.toUpperCase()}
          </span>
          <Link
            href={`/${word.pair}/${word.level}/${word.stageNum}`}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            {t.wotd.viewStage} →
          </Link>
        </div>
      </div>
    </div>
  )
}
