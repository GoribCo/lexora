import Link from 'next/link'
import { getLanguagePairs } from '@/lib/content'
import ThemeToggle from '@/components/ThemeToggle'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Lexora – All Courses',
  description: 'Browse all available language courses.',
}

export default function CoursesPage() {
  const pairs = getLanguagePairs()

  return (
    <div className="max-w-md mx-auto px-4 pb-28 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Courses</h1>
        <ThemeToggle />
      </div>

      <div className="flex flex-col gap-3">
        {pairs.map(pair => (
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
                  {pair.totalLearners && (
                    <div className="text-xs text-indigo-500 dark:text-indigo-400 mt-1 font-medium">
                      {pair.totalLearners} learners
                    </div>
                  )}
                </div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-4 text-center">
        <p className="text-sm text-gray-400 dark:text-gray-500">More language pairs coming soon</p>
      </div>
    </div>
  )
}
