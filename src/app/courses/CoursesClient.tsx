'use client'

import { useState } from 'react'
import Link from 'next/link'
import StageCompletionBadge from '@/components/StageCompletionBadge'
import { useUiLang } from '@/components/UiLanguageProvider'
import type { LanguagePair } from '@/lib/types'

interface PairWithCount extends LanguagePair {
  stageCount: number
}

interface Props {
  pairs: PairWithCount[]
}

export default function CoursesClient({ pairs }: Props) {
  const { t } = useUiLang()
  const fromLangs = [...new Set(pairs.map(p => p.from.code))]
  const toLangs   = [...new Set(pairs.map(p => p.to.code))]

  const [fromFilter, setFromFilter] = useState<string>('all')
  const [toFilter,   setToFilter]   = useState<string>('all')

  const filtered = pairs.filter(p =>
    (fromFilter === 'all' || p.from.code === fromFilter) &&
    (toFilter   === 'all' || p.to.code   === toFilter)
  )

  // Unique language objects for building filter pills
  const fromOptions = pairs
    .map(p => p.from)
    .filter((l, i, arr) => arr.findIndex(x => x.code === l.code) === i)

  const toOptions = pairs
    .map(p => p.to)
    .filter((l, i, arr) => arr.findIndex(x => x.code === l.code) === i)

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col gap-3 mb-6">
        {/* From filter */}
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{t.courses.iSpeak}</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFromFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
                fromFilter === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500'
              }`}
            >
              {t.courses.all}
            </button>
            {fromOptions.map(lang => (
              <button
                key={lang.code}
                onClick={() => setFromFilter(lang.code)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
                  fromFilter === lang.code
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500'
                }`}
              >
                <span>{lang.flag}</span>
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* To filter */}
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{t.courses.iWantToLearn}</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setToFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
                toFilter === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500'
              }`}
            >
              {t.courses.all}
            </button>
            {toOptions.map(lang => (
              <button
                key={lang.code}
                onClick={() => setToFilter(lang.code)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
                  toFilter === lang.code
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500'
                }`}
              >
                <span>{lang.flag}</span>
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      {(fromFilter !== 'all' || toFilter !== 'all') && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {filtered.length === 1 ? t.courses.found.replace('{{n}}', '1') : t.courses.foundPlural.replace('{{n}}', String(filtered.length))}
          <button
            onClick={() => { setFromFilter('all'); setToFilter('all') }}
            className="ml-2 text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
          >
            {t.courses.clear}
          </button>
        </p>
      )}

      {/* Course cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(pair => (
            <Link
              key={pair.slug}
              href={`/${pair.slug}`}
              className="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{pair.from.flag}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <span className="text-3xl">{pair.to.flag}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-base text-gray-900 dark:text-white">
                      {pair.from.name} → {pair.to.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {pair.description}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {pair.totalLearners && (
                        <div className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">
                          {pair.totalLearners} {t.courses.learners}
                        </div>
                      )}
                      <StageCompletionBadge pair={pair.slug} level="a1" totalStages={pair.stageCount} />
                    </div>
                  </div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-10 text-center">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-gray-600 dark:text-gray-400 font-medium">{t.courses.noMatch}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{t.courses.noMatchHint}</p>
        </div>
      )}

      <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-4 text-center">
        <p className="text-sm text-gray-400 dark:text-gray-500">{t.courses.moreComing}</p>
      </div>
    </>
  )
}
