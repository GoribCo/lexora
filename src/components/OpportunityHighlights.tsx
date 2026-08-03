'use client'

import Link from 'next/link'
import type { Opportunities } from '@/lib/types'
import { trackOpportunitiesHighlightClick } from '@/lib/analytics'

interface Props {
  pair: string
  opportunities: Opportunities
  toName: string
}

export default function OpportunityHighlights({ pair, opportunities, toName }: Props) {
  return (
    <div className="mb-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Why Learn {toName}?
        </h2>
        <Link
          href={`/${pair}/opportunities`}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-1"
        >
          See all
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Highlight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {opportunities.highlights.map((h, i) => (
          <Link
            key={i}
            onClick={() => trackOpportunitiesHighlightClick(pair, h.title)}
            href={`/${pair}/opportunities`}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all p-4 group"
          >
            <div className="text-2xl mb-2">{h.icon}</div>
            <div className="font-semibold text-sm text-gray-900 dark:text-white leading-tight mb-1">
              {h.title}
            </div>
            <div className="text-xs text-indigo-600/80 dark:text-indigo-400/80 mb-2">
              {h.titleBn}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
              {h.stat}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick stats row */}
      <div className="flex items-center gap-4 mt-3 px-1">
        {opportunities.speakers && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>{opportunities.speakers} speakers</span>
          </div>
        )}
        {opportunities.countries.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400">
              <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>
            </svg>
            <span>{opportunities.countries.length} countries</span>
          </div>
        )}
        {opportunities.community_size && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span className="truncate">{opportunities.community_size}</span>
          </div>
        )}
      </div>
    </div>
  )
}
