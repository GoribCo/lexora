import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLanguagePairs, getLevels, getStages, getStage } from '@/lib/content'
import PageHeader from '@/components/PageHeader'
import StreakBadge from '@/components/StreakBadge'
import StageContent from './StageContent'
import MarkComplete from '@/components/MarkComplete'
import LevelProgressBar from '@/components/LevelProgressBar'
import FlashcardDeck from '@/components/FlashcardDeck'
import TableOfContents from '@/components/TableOfContents'
import { parseFlashcardsFromMarkdown } from '@/lib/flashcards'
import { getLangCode } from '@/lib/languages'
import { getStageMeta, stageJsonLd } from '@/lib/seo'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const pairs = getLanguagePairs()
  const levels = getLevels()
  const params: { pair: string; level: string; stage: string }[] = []

  for (const pair of pairs) {
    for (const level of levels) {
      const stages = getStages(pair.slug, level.code)
      for (const stage of stages) {
        params.push({
          pair: pair.slug,
          level: level.code,
          stage: String(stage.number),
        })
      }
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string; level: string; stage: string }>
}): Promise<Metadata> {
  const { pair, level, stage } = await params
  return getStageMeta(pair, level, parseInt(stage, 10))
}

const levelColorMap: Record<string, { badge: string; text: string }> = {
  a1: { badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', text: 'text-emerald-600 dark:text-emerald-400' },
  a2: { badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', text: 'text-blue-600 dark:text-blue-400' },
  b1: { badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300', text: 'text-violet-600 dark:text-violet-400' },
  b2: { badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300', text: 'text-orange-600 dark:text-orange-400' },
  c1: { badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300', text: 'text-rose-600 dark:text-rose-400' },
  c2: { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', text: 'text-amber-600 dark:text-amber-400' },
}

export default async function StagePage({
  params,
}: {
  params: Promise<{ pair: string; level: string; stage: string }>
}) {
  const { pair, level, stage } = await params
  const stageNumber = parseInt(stage, 10)

  if (isNaN(stageNumber)) notFound()

  const stageData = getStage(pair, level, stageNumber)
  if (!stageData) notFound()

  const allStages = getStages(pair, level)
  const levels = getLevels()
  const levelData = levels.find(l => l.code === level)

  const currentIndex = allStages.findIndex(s => s.number === stageNumber)
  const prevStage = currentIndex > 0 ? allStages[currentIndex - 1] : null
  const nextStage = currentIndex < allStages.length - 1 ? allStages[currentIndex + 1] : null

  const colors = levelColorMap[level] ?? levelColorMap.a1

  // Parse flashcards from stage content at build time
  const flashcards = parseFlashcardsFromMarkdown(stageData.content)
  const langCode = getLangCode(pair)

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(stageJsonLd(pair, level, stageNumber)),
        }}
      />
    <div className="px-6 pb-28 lg:pb-10 pt-6 max-w-3xl mx-auto lg:mx-0">
      <PageHeader
        backHref={`/${pair}/${level}`}
        backLabel={levelData?.fullName ?? level.toUpperCase()}
        right={<StreakBadge />}
      />

      {/* Level progress bar */}
      <LevelProgressBar
        pair={pair}
        level={level}
        totalStages={allStages.length}
        currentStage={currentIndex + 1}
      />

      {/* Stage header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${colors.badge}`}>
            Stage {String(stageNumber).padStart(2, '0')}
          </span>
          <span className={`text-xs ${colors.text}`}>
            {currentIndex + 1} of {allStages.length}
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight mb-1">
          {stageData.title}
        </h1>
        {stageData.titleNative && (
          <p className={`text-base font-medium ${colors.text} mb-1`}>
            {stageData.titleNative}
          </p>
        )}
        {stageData.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {stageData.description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-3">
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {stageData.duration}
          </span>
          {stageData.vocabulary > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
              {stageData.vocabulary} words
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-gray-800 mb-6" />

      {/* Content + TOC sidebar (TOC only visible on xl+) */}
      <div className="xl:flex xl:gap-10 xl:items-start">
        <div className="flex-1 min-w-0">
          {/* Markdown content */}
          <StageContent content={stageData.content} />

          {/* Flashcard deck */}
          {flashcards.length > 0 && (
            <FlashcardDeck cards={flashcards} langCode={langCode} />
          )}

          {/* Mark complete */}
          <MarkComplete pair={pair} level={level} stageNum={stageNumber} />
        </div>

        {/* TOC — sticky sidebar, only xl+ */}
        <TableOfContents content={stageData.content} />
      </div>

      {/* Bottom navigation */}
      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between gap-3">
          {prevStage ? (
            <Link
              href={`/${pair}/${level}/${prevStage.number}`}
              className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 transition-all flex-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span className="truncate">{prevStage.title.split(' – ')[0]}</span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap flex-shrink-0">
            {currentIndex + 1}/{allStages.length}
          </span>

          {nextStage ? (
            <Link
              href={`/${pair}/${level}/${nextStage.number}`}
              className="flex items-center justify-end gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-medium text-white transition-colors flex-1"
            >
              <span className="truncate">{nextStage.title.split(' – ')[0]}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <Link
              href={`/${pair}/${level}`}
              className="flex items-center justify-end gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-sm font-medium text-white transition-colors flex-1"
            >
              <span>Level complete!</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
    </>
  )
}
