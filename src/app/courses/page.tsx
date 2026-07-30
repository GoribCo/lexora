import Link from 'next/link'
import { getLanguagePairs, getStages, getLevels } from '@/lib/content'
import ThemeToggle from '@/components/ThemeToggle'
import CoursesClient from './CoursesClient'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Lexora – All Courses',
  description: 'Browse all available language courses.',
}

export default function CoursesPage() {
  const pairs = getLanguagePairs()
  const levels = getLevels()

  const pairsWithCount = pairs.map(pair => {
    let total = 0
    for (const level of levels) {
      total += getStages(pair.slug, level.code).length
    }
    return { ...pair, stageCount: total }
  })

  return (
    <div className="px-6 pb-28 lg:pb-10 pt-6 max-w-3xl mx-auto lg:mx-0">
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

      <CoursesClient pairs={pairsWithCount} />
    </div>
  )
}
