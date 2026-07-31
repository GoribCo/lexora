'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import { useUiLang } from '@/components/UiLanguageProvider'
import { getSRSStore } from '@/lib/srs'
import { getStreak } from '@/lib/progress'
import type { PairProgressData } from './page'

interface Props {
  pairData: PairProgressData
  pair: string
}

interface WordStats { mastered: number; learning: number; newWords: number }

function computeStats(
  words: { front: string; pair: string; level: string; stageNum: number }[],
  srs: Record<string, { score: number }>
): WordStats {
  let mastered = 0; let learning = 0; let newWords = 0
  for (const w of words) {
    const record = srs[`${w.pair}-${w.level}-${w.stageNum}-${w.front}`]
    if (!record) newWords++
    else if (record.score >= 3) mastered++
    else learning++
  }
  return { mastered, learning, newWords }
}

export default function ProgressClient({ pairData, pair }: Props) {
  const { t } = useUiLang()
  const [srs, setSrs] = useState<Record<string, { score: number }>>({})
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    setSrs(getSRSStore() as Record<string, { score: number }>)
    setStreak(getStreak().count)
  }, [])

  const allWords = pairData.levels.flatMap(l => l.words)
  const totals = computeStats(allWords, srs)
  const total = allWords.length
  const masteredPct = total ? Math.round((totals.mastered / total) * 100) : 0
  const learningPct = total ? Math.round((totals.learning / total) * 100) : 0

  return (
    <div className="px-6 pb-28 lg:pb-10 pt-6 max-w-3xl mx-auto lg:mx-0">
      <PageHeader backHref={`/${pair}`} backLabel={pairData.pairLabel} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{t.progress.title}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xl">{pairData.fromFlag}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            <span className="text-xl">{pairData.toFlag}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{pairData.pairLabel}</span>
          </div>
        </div>
        <Link
          href={`/${pair}/vocabulary`}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
        >
          Vocabulary →
        </Link>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard value={streak} label="🔥 Streak" sub="days" />
        <StatCard value={totals.mastered + totals.learning} label={t.progress.wordsLearned} />
        <StatCard value={totals.mastered} label={t.progress.mastered} color="text-emerald-600 dark:text-emerald-400" />
        <StatCard value={totals.learning} label={t.progress.learning} color="text-yellow-600 dark:text-yellow-400" />
      </div>

      {/* Overall mastery bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>{totals.mastered} mastered · {totals.learning} learning · {totals.newWords} new</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{masteredPct}% mastered</span>
        </div>
        <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
          <div className="h-full bg-emerald-500 transition-all rounded-l-full" style={{ width: `${masteredPct}%` }} />
          <div className="h-full bg-yellow-400 transition-all" style={{ width: `${learningPct}%` }} />
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />{t.progress.mastered}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" />{t.progress.learning}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />{t.progress.newWords}</span>
        </div>
      </div>

      {/* Per-level breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">By Level</h2>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
          {pairData.levels.map(levelData => {
            const lvlStats = computeStats(levelData.words, srs)
            const lvlTotal = levelData.words.length
            const lvlMPct = lvlTotal ? Math.round((lvlStats.mastered / lvlTotal) * 100) : 0
            const lvlLPct = lvlTotal ? Math.round((lvlStats.learning / lvlTotal) * 100) : 0

            return (
              <div key={levelData.level} className="px-4 py-3 flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-8 shrink-0">
                  {levelData.level.toUpperCase()}
                </span>
                <div className="flex-1">
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500" style={{ width: `${lvlMPct}%` }} />
                    <div className="h-full bg-yellow-400" style={{ width: `${lvlLPct}%` }} />
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0 w-12 text-right">
                  {lvlStats.mastered}/{lvlTotal}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Review CTA */}
      <Link
        href={`/review`}
        className="block w-full text-center py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold text-sm transition-colors"
      >
        ⚡ Review Due Cards
      </Link>
    </div>
  )
}

function StatCard({ value, label, sub, color = 'text-indigo-600 dark:text-indigo-400' }: {
  value: number; label: string; sub?: string; color?: string
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 text-center">
      <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{label}</p>
      {sub && <p className="text-[10px] text-gray-400 dark:text-gray-500">{sub}</p>}
    </div>
  )
}
