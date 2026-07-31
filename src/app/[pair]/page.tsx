import Link from 'next/link'
import { getLanguagePairs, getLevels, getPairMeta } from '@/lib/content'
import PageHeader from '@/components/PageHeader'
import { getPairMeta as getPairSeoMeta } from '@/lib/seo'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const pairs = getLanguagePairs()
  return pairs.map(p => ({ pair: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>
}): Promise<Metadata> {
  const { pair } = await params
  return getPairSeoMeta(pair)
}

const levelColorMap: Record<string, { badge: string; ring: string; dot: string }> = {
  a1: {
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    ring: 'border-emerald-200 dark:border-emerald-800 hover:border-emerald-400',
    dot: 'bg-emerald-500',
  },
  a2: {
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    ring: 'border-blue-200 dark:border-blue-800 hover:border-blue-400',
    dot: 'bg-blue-500',
  },
  b1: {
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    ring: 'border-violet-200 dark:border-violet-800 hover:border-violet-400',
    dot: 'bg-violet-500',
  },
  b2: {
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    ring: 'border-orange-200 dark:border-orange-800 hover:border-orange-400',
    dot: 'bg-orange-500',
  },
  c1: {
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    ring: 'border-rose-200 dark:border-rose-800 hover:border-rose-400',
    dot: 'bg-rose-500',
  },
  c2: {
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    ring: 'border-amber-200 dark:border-amber-800 hover:border-amber-400',
    dot: 'bg-amber-500',
  },
}

export default async function PairPage({
  params,
}: {
  params: Promise<{ pair: string }>
}) {
  const { pair } = await params
  const pairs = getLanguagePairs()
  const pairData = pairs.find(p => p.slug === pair)
  if (!pairData) notFound()

  const levels = getLevels()
  const meta = getPairMeta(pair)
  const availableLevels = ['a1']

  return (
    <div className="px-6 pb-28 lg:pb-10 pt-6 max-w-3xl mx-auto lg:mx-0">
      <PageHeader backHref="/" backLabel="Home" />

      {/* Pair Hero */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900 p-5 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{pairData.from.flag}</span>
          <div className="flex flex-col items-center gap-1 text-indigo-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <span className="text-4xl">{pairData.to.flag}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {meta.titleEn ?? pairData.description}
        </h1>
        <p className="text-base text-indigo-600/80 dark:text-indigo-400/80 font-medium mb-1">
          {meta.title}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {meta.description}
        </p>
      </div>

      {/* Level selector */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Choose Your Level
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {levels.map(level => {
          const colors = levelColorMap[level.code] ?? levelColorMap.a1
          const available = availableLevels.includes(level.code)
          const totalStages = meta.totalStages[level.code] ?? 0

          const cardContent = (
            <div
              className={`bg-white dark:bg-gray-800 rounded-2xl border transition-all ${
                available
                  ? `${colors.ring} shadow-sm hover:shadow-md cursor-pointer`
                  : 'border-gray-100 dark:border-gray-700 opacity-55 cursor-not-allowed'
              } p-5 relative overflow-hidden`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left: badge + text */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-bold shrink-0 ${colors.badge}`}>
                    {level.code.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                      {level.fullName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {level.description}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {level.skills.slice(0, 3).map(skill => (
                        <div key={skill} className="flex items-center gap-1.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-500 shrink-0">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span className="text-xs text-gray-600 dark:text-gray-400">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: status + arrow */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {available ? (
                    <>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${colors.dot} animate-pulse`} />
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Available</span>
                      </div>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 dark:text-gray-500 mt-1">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  ) : (
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500">Soon</span>
                  )}
                </div>
              </div>

              {/* Footer pills */}
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-400 dark:text-gray-500">⏱ {level.duration}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">📖 {level.vocabulary}</span>
                {totalStages > 0 && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">📝 {totalStages} stages</span>
                )}
              </div>
            </div>
          )

          if (!available) {
            return <div key={level.code}>{cardContent}</div>
          }

          return (
            <Link key={level.code} href={`/${pair}/${level.code}`}>
              {cardContent}
            </Link>
          )
        })}
      </div>

      {/* Course tools */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <Link
          href={`/${pair}/vocabulary`}
          className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all p-4 group"
        >
          <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl flex items-center justify-center text-xl shrink-0">
            📖
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-gray-900 dark:text-white">Vocabulary</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">All words</div>
          </div>
        </Link>
        <Link
          href={`/${pair}/progress`}
          className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all p-4 group"
        >
          <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center text-xl shrink-0">
            📊
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-gray-900 dark:text-white">Progress</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Mastery stats</div>
          </div>
        </Link>
      </div>
    </div>
  )
}
