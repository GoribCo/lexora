'use client'

import { useEffect, useState } from 'react'
import { getStreak, getTotalCompletedStages, resetProgress } from '@/lib/progress'
import ThemeToggle from '@/components/ThemeToggle'

type FontSize = 'small' | 'medium' | 'large'

const fontSizeClasses: Record<FontSize, string> = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg',
}

export default function SettingsClient() {
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
      {/* Streak & Progress Summary */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-1">
          Your Progress
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Daily Streak</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Study every day to keep it going</div>
            </div>
            <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-bold text-sm">
              🔥 {streak > 0 ? `${streak} day${streak === 1 ? '' : 's'}` : 'Start today!'}
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Stages Completed</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Across all courses</div>
            </div>
            <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              {totalStages}
            </div>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-1">
          Appearance
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Theme</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Toggle dark/light mode</div>
            </div>
            <ThemeToggle />
          </div>
          <div className="px-4 py-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Font Size</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">Adjust reading size for lesson content</div>
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as FontSize[]).map(size => (
                <button
                  key={size}
                  onClick={() => handleFontSize(size)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors capitalize ${
                    fontSize === size
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-indigo-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Show Bengali</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Show Bengali labels and text</div>
            </div>
            <button
              onClick={handleBengaliToggle}
              className={`relative w-11 h-6 rounded-full transition-colors ${showBengali ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}
              aria-label={showBengali ? 'Hide Bengali' : 'Show Bengali'}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${showBengali ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-1">
          About
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">Version</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">0.2.0</div>
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">Available Courses</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">2 (Bengali → German, Polish)</div>
          </div>
        </div>
      </section>

      {/* Data */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-1">
          Data
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="px-4 py-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Reset All Progress</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Clears all completed stages, streak, and SRS data. This cannot be undone.
            </div>
            <button
              onClick={handleReset}
              className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                confirmReset
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100'
              }`}
            >
              {confirmReset ? 'Tap again to confirm reset' : 'Reset Progress'}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
