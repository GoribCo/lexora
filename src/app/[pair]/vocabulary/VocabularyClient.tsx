'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import SpeakButton from '@/components/SpeakButton'
import PageHeader from '@/components/PageHeader'
import { useUiLang } from '@/components/UiLanguageProvider'
import { getSRSStore } from '@/lib/srs'
import { getLangCode } from '@/lib/languages'
import type { VocabWord } from './page'

interface LevelOption { code: string; name: string }

interface Props {
  words: VocabWord[]
  levelOptions: LevelOption[]
  pair: string
  pairLabel: string
}

const levelBadge: Record<string, string> = {
  a1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  a2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  b1: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  b2: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  c1: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  c2: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
}

function srsDot(score: number | undefined) {
  if (score === undefined) return 'bg-gray-300 dark:bg-gray-600'
  if (score >= 3) return 'bg-emerald-500'
  return 'bg-yellow-400'
}

export default function VocabularyClient({ words, levelOptions, pair, pairLabel }: Props) {
  const { t } = useUiLang()
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [search, setSearch] = useState('')
  const [srsStore, setSrsStore] = useState<Record<string, { score: number }>>({})

  const langCode = getLangCode(pair)

  useEffect(() => {
    setSrsStore(getSRSStore() as Record<string, { score: number }>)
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return words.filter(w => {
      if (selectedLevel !== 'all' && w.level !== selectedLevel) return false
      if (q && !w.front.toLowerCase().includes(q) && !w.back.toLowerCase().includes(q) && !w.english.toLowerCase().includes(q)) return false
      return true
    })
  }, [words, selectedLevel, search])

  function getScore(w: VocabWord): number | undefined {
    return (srsStore[`${w.pair}-${w.level}-${w.stageNum}-${w.front}`] as { score: number } | undefined)?.score
  }

  function dotTitle(score: number | undefined) {
    if (score === undefined) return t.vocabulary.unseen
    if (score >= 3) return t.vocabulary.mastered
    return t.vocabulary.learning
  }

  return (
    <div className="px-6 pb-28 lg:pb-10 pt-6 max-w-3xl mx-auto lg:mx-0">
      <PageHeader backHref={`/${pair}`} backLabel={pairLabel} />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{t.vocabulary.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{filtered.length} {t.vocabulary.words}</p>
        </div>
        <Link
          href={`/${pair}/progress`}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
        >
          Progress →
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={selectedLevel}
          onChange={e => setSelectedLevel(e.target.value)}
          className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">{t.vocabulary.allLevels}</option>
          {levelOptions.map(l => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t.search.placeholder}
          className="flex-1 min-w-[140px] px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 inline-block" />{t.vocabulary.unseen}</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />{t.vocabulary.learning}</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />{t.vocabulary.mastered}</span>
      </div>

      {/* Word grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((w, idx) => {
          const score = getScore(w)
          return (
            <div
              key={`${w.level}-${w.stageNum}-${w.front}-${idx}`}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-lg font-bold text-gray-900 dark:text-white truncate">{w.front}</span>
                  <SpeakButton text={w.front} lang={langCode} />
                  <span title={dotTitle(score)} className={`w-2 h-2 rounded-full shrink-0 ${srsDot(score)}`} />
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${levelBadge[w.level] ?? levelBadge.a1}`}>
                  {w.level.toUpperCase()}
                </span>
              </div>
              {w.pronunciation && (
                <p className="text-xs font-mono text-indigo-500 dark:text-indigo-400 mb-1">{w.pronunciation}</p>
              )}
              <p className="text-sm text-gray-800 dark:text-gray-200">{w.back}</p>
              {w.english && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{w.english}</p>}
              <Link
                href={`/${w.pair}/${w.level}/${w.stageNum}`}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium mt-2 block"
              >
                {w.stageTitle}
              </Link>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
          {t.search.noResults.replace('{{q}}', search || '...')}
        </div>
      )}
    </div>
  )
}
