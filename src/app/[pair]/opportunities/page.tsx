import { getLanguagePairs, getOpportunities } from '@/lib/content'
import PageHeader from '@/components/PageHeader'
import OpportunitiesContent from './OpportunitiesContent'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const pairs = getLanguagePairs()
  // Only generate pages for pairs that have an opportunities.md
  return pairs
    .filter(p => getOpportunities(p.slug) !== null)
    .map(p => ({ pair: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>
}): Promise<Metadata> {
  const { pair } = await params
  const pairs = getLanguagePairs()
  const pairData = pairs.find(p => p.slug === pair)
  const opportunities = getOpportunities(pair)
  if (!pairData || !opportunities) return {}
  return {
    title: `${opportunities.title} | ${pairData.from.name} → ${pairData.to.name}`,
    description: `Discover career, education and cultural opportunities by learning ${pairData.to.name} from ${pairData.from.name}.`,
  }
}

export default async function OpportunitiesPage({
  params,
}: {
  params: Promise<{ pair: string }>
}) {
  const { pair } = await params
  const pairs = getLanguagePairs()
  const pairData = pairs.find(p => p.slug === pair)
  if (!pairData) notFound()

  const opportunities = getOpportunities(pair)
  if (!opportunities) notFound()

  const pairLabel = `${pairData.from.nativeName} → ${pairData.to.name}`

  return (
    <div className="px-6 pb-28 lg:pb-10 pt-6 max-w-3xl mx-auto lg:mx-0">
      <PageHeader backHref={`/${pair}`} backLabel={pairLabel} />

      {/* Hero */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{pairData.from.flag}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <span className="text-4xl">{pairData.to.flag}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
          {opportunities.title}
        </h1>
        <p className="text-base text-indigo-600/80 dark:text-indigo-400/80 font-medium">
          {opportunities.titleBn}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {opportunities.speakers && (
          <StatCard icon="🗣️" value={opportunities.speakers} label="Native Speakers" />
        )}
        {opportunities.countries.length > 0 && (
          <StatCard icon="🌍" value={`${opportunities.countries.length}`} label="Countries" />
        )}
        {opportunities.salary_range && (
          <StatCard icon="💰" value={opportunities.salary_range} label="Salary Range" />
        )}
        {opportunities.community_size && (
          <StatCard icon="🤝" value="Active" label={opportunities.community_size} small />
        )}
      </div>

      {/* Highlight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {opportunities.highlights.map((h, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4"
          >
            <div className="text-2xl mb-2">{h.icon}</div>
            <div className="font-semibold text-sm text-gray-900 dark:text-white mb-0.5">{h.title}</div>
            <div className="text-xs text-indigo-500 dark:text-indigo-400 mb-2">{h.titleBn}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{h.stat}</div>
          </div>
        ))}
      </div>

      {/* Structured extras */}
      {opportunities.visa_types && opportunities.visa_types.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <span>🛂</span> Visa Types
          </h2>
          <div className="flex flex-wrap gap-2">
            {opportunities.visa_types.map(v => (
              <span key={v} className="text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-800">
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {opportunities.top_cities && opportunities.top_cities.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <span>🏙️</span> Top Cities
          </h2>
          <div className="flex flex-wrap gap-2">
            {opportunities.top_cities.map(city => (
              <span key={city} className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
                {city}
              </span>
            ))}
          </div>
        </div>
      )}

      {opportunities.countries.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <span>🗺️</span> Countries ({opportunities.countries.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {opportunities.countries.map(c => (
              <span key={c} className="text-xs bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-600">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Rich Markdown body */}
      <OpportunitiesContent content={opportunities.content} />

      {/* CTA */}
      <div className="mt-8 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900 p-5 text-center">
        <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          Ready to start?
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Begin your {pairData.to.name} journey from A1 today
        </p>
        <a
          href={`/${pair}/a1`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors"
        >
          Start A1 Lessons
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  )
}

function StatCard({
  icon, value, label, small = false,
}: {
  icon: string; value: string; label: string; small?: boolean
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-3 text-center">
      <div className="text-xl mb-1">{icon}</div>
      <div className={`font-bold text-gray-900 dark:text-white ${small ? 'text-xs' : 'text-sm'} leading-tight`}>
        {value}
      </div>
      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{label}</div>
    </div>
  )
}
