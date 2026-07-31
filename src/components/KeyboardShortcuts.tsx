'use client'

import { useEffect, useState } from 'react'

interface Props {
  onFlip?: () => void
  onNext?: () => void
  onPrev?: () => void
  onScore1?: () => void
  onScore2?: () => void
  onScore3?: () => void
}

export default function KeyboardShortcuts({
  onFlip,
  onNext,
  onPrev,
  onScore1,
  onScore2,
  onScore3,
}: Props) {
  const [showLegend, setShowLegend] = useState(false)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Don't fire if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault()
          onFlip?.()
          break
        case 'ArrowRight':
        case 'l':
        case 'L':
          onNext?.()
          break
        case 'ArrowLeft':
        case 'h':
        case 'H':
          onPrev?.()
          break
        case '1':
          onScore1?.()
          break
        case '2':
          onScore2?.()
          break
        case '3':
          onScore3?.()
          break
        case '?':
          setShowLegend(v => !v)
          break
        case 'Escape':
          setShowLegend(false)
          break
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onFlip, onNext, onPrev, onScore1, onScore2, onScore3])

  const shortcuts = [
    { key: 'Space / Enter', action: 'Flip card' },
    { key: '→ / L', action: 'Next card' },
    { key: '← / H', action: 'Previous card' },
    ...(onScore1 ? [{ key: '1', action: 'Score: Hard' }] : []),
    ...(onScore2 ? [{ key: '2', action: 'Score: Good' }] : []),
    ...(onScore3 ? [{ key: '3', action: 'Score: Easy' }] : []),
    { key: '?', action: 'Toggle shortcuts' },
  ]

  return (
    <>
      {/* Help button */}
      <button
        onClick={() => setShowLegend(v => !v)}
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts (?)"
        className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-40 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center shadow"
      >
        ?
      </button>

      {/* Legend overlay */}
      {showLegend && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowLegend(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-xl max-w-xs w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Keyboard Shortcuts</h3>
              <button
                onClick={() => setShowLegend(false)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {shortcuts.map(s => (
                <div key={s.key} className="flex items-center justify-between gap-4">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{s.action}</span>
                  <kbd className="text-[11px] font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded border border-gray-300 dark:border-gray-600 whitespace-nowrap">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
