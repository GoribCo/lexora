'use client'

import { useEffect, useState } from 'react'
import { getStreak, getTotalCompletedStages, resetProgress } from '@/lib/progress'
import ThemeToggle from '@/components/ThemeToggle'
import { useUiLang } from '@/components/UiLanguageProvider'
import { UI_LANGUAGES } from '@/lib/i18n'

type FontSize = 'small' | 'medium' | 'large'

const fontSizeClasses: Record<FontSize, string> = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg',
}

export default function SettingsClient() {
  const { t, lang, setLang } = useUiLang()
  const [streak, setStreak] = useState(0)
  const [totalStages, setTotalStages] = useState(0)
  const [fontSize, setFontSize] = useState<FontSize>('medium')
  const [showBengali, setShowBengali] = useState(true)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    const s = getStreak()
    setStreak(s.count)
    setTotalStages(getTotalCompletedStages())

    const stored = localStorage.getItem('lexora_font_size') as FontSize | null
    if (stored && stored in fontSizeClasses) setFontSize(stored)

    const bengali = localStorage.getItem('lexora_show_bengali')
    if (bengali !== null) setShowBengali(bengali !== 'false')
  }, [])

  function handleFontSize(size: FontSize) {
    setFontSize(size)
    localStorage.setItem('lexora_font_size', size)
    // Apply to html element
    const html = document.documentElement
    html.classList.remove('text-sm', 'text-base', 'text-lg')
    html.style.fontSize = size === 'small' ? '14px' : size === 'large' ? '18px' : '16px'
  }

  function handleBengaliToggle() {
    const next = !showBengali
    setShowBengali(next)
    localStorage.setItem('lexora_show_bengali', String(next))
  }

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true)
      setTimeout(() => setConfirmReset(false), 4000)
      return
    }
    resetProgress()
    setStreak(0)
    setTotalStages(0)
    setConfirmReset(false)
  }

  return (
    <>
      {/* Progress */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-1">
          {t.settings.progress}
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{t.settings.streak}</div>
            <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-bold text-sm">
              🔥 {streak > 0 ? `${streak} ${t.settings.streakDays}` : 'Start today!'}
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{t.settings.totalComplete}</div>
            <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{totalStages}</div>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-1">
          {t.settings.appearance}
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{t.settings.theme}</div>
            <ThemeToggle />
          </div>
          <div className="px-4 py-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">{t.settings.fontSize}</div>
            <div className="flex gap-2">
              {([['small', t.settings.fontSmall], ['medium', t.settings.fontMedium], ['large', t.settings.fontLarge]] as [FontSize, string][]).map(([size, label]) => (
                <button
                  key={size}
                  onClick={() => handleFontSize(size)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    fontSize === size
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-indigo-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Site Language */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-1">
          {t.settings.language}
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t.settings.languageDesc}</p>
          <div className="flex flex-wrap gap-2">
            {UI_LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  lang === l.code
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500'
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.nativeName}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Data */}
      <section className="mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="px-4 py-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">{t.settings.resetProgress}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t.settings.resetConfirm}</div>
            <button
              onClick={handleReset}
              className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                confirmReset
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100'
              }`}
            >
              {confirmReset ? t.settings.resetConfirm : t.settings.resetProgress}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
