import Link from 'next/link'
import { getLanguagePairs, getStages, getLevels } from '@/lib/content'
import ThemeToggle from '@/components/ThemeToggle'
import type { Metadata } from 'next'
import StageCompletionBadge from '@/components/StageCompletionBadge'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Lexora – All Courses',
  description: 'Browse all available language courses.',
}

export default function CoursesPage() {
  const pairs = getLanguagePairs()
  const levels = getLevels()

  // Pre-compute total stages per pair for the progress badge
  const pairStageCounts = pairs.map(pair => {
    let total = 0
    for (const level of levels) {
      total += getStages(pair.slug, level.code).length
    }
    return { slug: pair.slug, total }
  })

  return (
    <div className="px-6 pb-28 lg:pb-10 pt-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Courses</h1>
        <div className="flex items-center gap-1">
          <Link
            href="/search"
            aria-label="Search lessons"
            className="p-2 rounded-xl text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {pairs.map(pair => {
          const stageCount = pairStageCounts.find(p => p.slug === pair.slug)?.total ?? 0
          return (
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
                          {pair.totalLearners} learners
                        </div>
                      )}
                      <StageCompletionBadge pair={pair.slug} level="a1" totalStages={stageCount} />
                    </div>
                  </div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-4 text-center">
        <p className="text-sm text-gray-400 dark:text-gray-500">More language pairs coming soon</p>
      </div>
    </div>
  )
}
