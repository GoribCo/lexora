'use client'

import { useState } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import { useUiLang } from '@/components/UiLanguageProvider'
import type { SearchResult } from '@/lib/searchIndex'

interface Props {
  index: SearchResult[]
}

const levelBadge: Record<string, string> = {
  a1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  a2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  b1: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  b2: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  c1: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  c2: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
}

export default function SearchClient({ index }: Props) {
  const { t } = useUiLang()
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const results: SearchResult[] = q.length === 0 ? [] : index.filter(r =>
    r.title.toLowerCase().includes(q) ||
    r.titleNative.toLowerCase().includes(q) ||
    r.description.toLowerCase().includes(q) ||
    r.snippet.toLowerCase().includes(q) ||
    r.pair.toLowerCase().includes(q) ||
    r.level.toLowerCase().includes(q)
  )

  return (
    <div className="px-6 pb-28 lg:pb-10 pt-6 max-w-3xl mx-auto lg:mx-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.search.title}</h1>
        <ThemeToggle />
      </div>

      {/* Input */}
      <div className="relative mb-6">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t.search.placeholder}
          autoFocus
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-base"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Results */}
      {q.length === 0 ? (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 opacity-40">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <p className="text-sm">{t.search.startTyping}</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 opacity-40">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <p className="text-sm">{t.search.noResults.replace('{{q}}', query)}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{results.length} result{results.length !== 1 ? 's' : ''}</p>
          {results.map(r => (
            <Link
              key={r.url}
              href={r.url}
              className="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all p-4"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${levelBadge[r.level] ?? levelBadge.a1}`}>
                  {r.level.toUpperCase()}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">{r.pair}</span>
              </div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{r.title}</h3>
              {r.titleNative && (
                <p className="text-xs text-indigo-500 dark:text-indigo-400">{r.titleNative}</p>
              )}
              {r.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{r.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
