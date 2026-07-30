import { getLanguagePairs } from '@/lib/content'
import ThemeToggle from '@/components/ThemeToggle'
import ReviewClient from './ReviewClient'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Review',
  description: 'Spaced repetition review of your vocabulary.',
}

export default function ReviewPage() {
  const pairs = getLanguagePairs()
  const defaultPair = pairs[0]

  return (
    <div className="px-6 pb-28 lg:pb-10 pt-6 max-w-3xl mx-auto lg:mx-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Review</h1>
        <ThemeToggle />
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Spaced repetition keeps vocabulary fresh. Cards you found difficult come back sooner.
      </p>

      {pairs.map(pair => (
        <div key={pair.slug} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{pair.from.flag}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <span className="text-2xl">{pair.to.flag}</span>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {pair.from.name} → {pair.to.name}
            </h2>
          </div>

          <ReviewClient pair={pair.slug} pairLabel={`${pair.from.name} → ${pair.to.name}`} />
        </div>
      ))}

      <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-4">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          Vocabulary cards appear here after you study a stage and interact with flashcards.
          Mark cards as Hard, Good, or Easy to schedule reviews.
        </p>
      </div>
    </div>
  )
}
