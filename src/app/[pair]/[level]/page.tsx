import Link from 'next/link'
import { getLanguagePairs, getLevels, getStages } from '@/lib/content'
import PageHeader from '@/components/PageHeader'
import StageCheckBadge from '@/components/StageCheckBadge'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const pairs = getLanguagePairs()
  const levels = getLevels()
  const params: { pair: string; level: string }[] = []

  for (const pair of pairs) {
    for (const level of levels) {
      const stages = getStages(pair.slug, level.code)
      if (stages.length > 0) {
        params.push({ pair: pair.slug, level: level.code })
      }
    }
  }
  return params
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lexora.app'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string; level: string }>
}): Promise<Metadata> {
  const { pair, level } = await params
  const pairs = getLanguagePairs()
  const levels = getLevels()
  const pairData = pairs.find(p => p.slug === pair)
  const levelData = levels.find(l => l.code === level)
  if (!levelData || !pairData) return {}
  const title = `${levelData.fullName} ${pairData.to.name} Lessons`
  const description = `${levelData.description} Learn ${pairData.to.name} from ${pairData.from.name} with ${levelData.vocabulary} vocabulary and guided stages.`
  const url = `${BASE_URL}/${pair}/${level}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website' },
    twitter: { card: 'summary', title, description },
  }
}

const levelColorMap: Record<string, { badge: string; bg: string; border: string; text: string }> = {
  a1: {
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    bg: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
    border: 'border-emerald-100 dark:border-emerald-900',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  a2: {
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    bg: 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30',
    border: 'border-blue-100 dark:border-blue-900',
    text: 'text-blue-600 dark:text-blue-400',
  },
  b1: {
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    bg: 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30',
    border: 'border-violet-100 dark:border-violet-900',
    text: 'text-violet-600 dark:text-violet-400',
  },
  b2: {
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    bg: 'from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30',
    border: 'border-orange-100 dark:border-orange-900',
    text: 'text-orange-600 dark:text-orange-400',
  },
  c1: {
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    bg: 'from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30',
    border: 'border-rose-100 dark:border-rose-900',
    text: 'text-rose-600 dark:text-rose-400',
  },
  c2: {
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    bg: 'from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30',
    border: 'border-amber-100 dark:border-amber-900',
    text: 'text-amber-600 dark:text-amber-400',
  },
}

export default async function LevelPage({
  params,
}: {
  params: Promise<{ pair: string; level: string }>
}) {
  const { pair, level } = await params
  const levels = getLevels()
  const levelData = levels.find(l => l.code === level)
  if (!levelData) notFound()

  const stages = getStages(pair, level)
  if (stages.length === 0) notFound()

  const colors = levelColorMap[level] ?? levelColorMap.a1

  return (
    <div className="px-6 pb-28 lg:pb-10 pt-6 max-w-3xl mx-auto lg:mx-0">
      <PageHeader backHref={`/${pair}`} backLabel={pair.toUpperCase()} />

      {/* Level Hero */}
      <div className={`bg-gradient-to-br ${colors.bg} rounded-2xl border ${colors.border} p-5 mb-6`}>
        <div className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-bold mb-3 ${colors.badge}`}>
          {levelData.fullName}
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
          {levelData.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {levelData.skills.map(skill => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 text-[11px] bg-white/70 dark:bg-white/10 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full border border-white/50 dark:border-white/20"
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-500">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {skill}
            </span>
          ))}
        </div>
        <div className={`flex items-center gap-4 mt-4 text-xs ${colors.text}`}>
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {levelData.duration}
          </span>
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
            {levelData.vocabulary}
          </span>
        </div>
      </div>

      {/* Progress info */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Stages
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {stages.length} lessons · Start anytime
        </span>
      </div>

      {/* Stage list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {stages.map((stage, idx) => (
          <Link
            key={stage.number}
            href={`/${pair}/${level}/${stage.number}`}
            className="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all group p-4"
          >
            <div className="flex items-start gap-4">
              {/* Number badge */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${colors.badge}`}>
                {String(stage.number).padStart(2, '0')}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                      {stage.title}
                    </h3>
                    {stage.titleNative && (
                      <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-0.5">
                        {stage.titleNative}
                      </p>
                    )}
                    {stage.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                        {stage.description}
                      </p>
                    )}
                  </div>
                  <span className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-400 transition-colors flex-shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>

                {/* Pills */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    {stage.duration}
                  </span>
                  {stage.vocabulary > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                      </svg>
                      {stage.vocabulary} words
                    </span>
                  )}
                  {idx === 0 && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Start here
                    </span>
                  )}
                  <StageCheckBadge pair={pair} level={level} stageNum={stage.number} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
