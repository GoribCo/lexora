'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import StreakBadge from '@/components/StreakBadge'
import WordOfTheDay from '@/components/WordOfTheDay'
import { useUiLang } from '@/components/UiLanguageProvider'
import type { Language, LanguagePair } from '@/lib/types'

interface WotdWord {
  front: string; pronunciation: string; back: string; english: string
  pair: string; pairLabel: string; level: string; stageNum: number
}

interface Props {
  languages: Language[]
  pairs: LanguagePair[]
  allWords: WotdWord[]
}

export default function HomeClient({ languages, pairs, allWords }: Props) {
  const router = useRouter()
  const { t } = useUiLang()
  const [fromLang, setFromLang] = useState('bn')
  const [toLang, setToLang] = useState('de')

  function handleStart() {
    const slug = `${fromLang}-${toLang}`
    const pairExists = pairs.some(p => p.slug === slug)
    if (pairExists) {
      router.push(`/${slug}`)
    } else {
      alert(`${fromLang.toUpperCase()} → ${toLang.toUpperCase()} ${t.home.pairNotAvailable}`)
    }
  }

  function handleFromChange(code: string) {
    setFromLang(code)
    if (code === toLang) {
      const other = languages.find(l => l.code !== code)
      if (other) setToLang(other.code)
    }
  }

  function handleToChange(code: string) {
    setToLang(code)
    if (code === fromLang) {
      const other = languages.find(l => l.code !== code)
      if (other) setFromLang(other.code)
    }
  }

  const fromLanguage = languages.find(l => l.code === fromLang)
  const toLanguage = languages.find(l => l.code === toLang)

  return (
    <div className="px-6 pb-28 lg:pb-10 pt-6 max-w-3xl mx-auto lg:mx-0">
      {/* Header — logo hidden on desktop (sidebar shows it) */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm font-bold">L</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Lexora</span>
        </div>
        {/* Desktop: page title instead of logo */}
        <h1 className="hidden lg:block text-2xl font-bold text-gray-900 dark:text-white">
          {t.home.welcome}
        </h1>
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

      {/* ── Desktop: two-column layout ── */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">

        {/* Left column: Hero + Language selector */}
        <div>
          {/* Word of the Day */}
          <WordOfTheDay allWords={allWords} />

          {/* Hero */}
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight mb-2 lg:hidden">
              {t.home.startLearning} <br />
              <span className="text-indigo-600 dark:text-indigo-400">Today</span>
            </h2>
            <p className="hidden lg:block text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
              {t.home.startLearning}
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-3">
              {t.home.tagline}
            </p>
            <StreakBadge />
          </div>

          {/* Language Selector Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-6">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              {t.home.chooseYourPath}
            </h2>

            <div className="space-y-4 mb-5">
              {/* From language */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  {t.home.iSpeak}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
                    {fromLanguage?.flag}
                  </div>
                  <select
                    value={fromLang}
                    onChange={e => handleFromChange(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name} ({lang.nativeName})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="h-px w-12 bg-gray-200 dark:bg-gray-600" />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  </svg>
                  <div className="h-px w-12 bg-gray-200 dark:bg-gray-600" />
                </div>
              </div>

              {/* To language */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  {t.home.iWantToLearn}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
                    {toLanguage?.flag}
                  </div>
                  <select
                    value={toLang}
                    onChange={e => handleToChange(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  >
                    {languages
                      .filter(l => l.code !== fromLang)
                      .map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name} ({lang.nativeName})
                        </option>
                      ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl px-6 py-3.5 font-semibold text-base transition-colors flex items-center justify-center gap-2"
            >
              {t.home.startLearning}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right column: Available courses + features */}
        <div>
          {/* Available Courses */}
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {t.home.availableCourses}
            </h2>
            <div className="space-y-3">
              {pairs.map(pair => (
                <Link
                  key={pair.slug}
                  href={`/${pair.slug}`}
                  className="block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-2xl">{pair.from.flag}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                        <span className="text-2xl">{pair.to.flag}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white text-sm">
                          {pair.from.nativeName} → {pair.to.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {pair.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {pair.totalLearners && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
                          {pair.totalLearners} learners
                        </span>
                      )}
                      <span className="text-indigo-500 group-hover:translate-x-0.5 transition-transform">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-4 text-center">
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {t.home.moreComing}
              </p>
            </div>
          </section>

          {/* Why Lexora */}
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {t.home.whyLexora}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '📚', title: t.home.cefr,    desc: t.home.cefrDesc },
                { icon: '🎯', title: t.home.focused,  desc: t.home.focusedDesc },
                { icon: '🔁', title: t.home.srs,      desc: t.home.srsDesc },
                { icon: '📱', title: t.home.anyDevice, desc: t.home.anyDeviceDesc },
              ].map(f => (
                <div
                  key={f.title}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4"
                >
                  <div className="text-2xl mb-1.5">{f.icon}</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{f.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{f.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Tools */}
          <section>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
              📖 Vocabulary &amp; 📊 Progress are available inside each course
            </p>
          </section>
        </div>

      </div>
    </div>
  )
}
