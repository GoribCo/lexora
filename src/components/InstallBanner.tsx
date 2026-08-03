'use client'

import { useEffect, useState } from 'react'

export default function InstallBanner() {
  const [show, setShow] = useState(false)
  const [isIos, setIsIos] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)

  useEffect(() => {
    // Already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true)
      return
    }

    // iOS detection (Safari shows "Add to Home Screen" manually)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIsIos(ios)

    // Android/desktop: listen for Chrome's beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      if (!sessionStorage.getItem('install_dismissed')) setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // Show iOS banner if not dismissed
    if (ios && !sessionStorage.getItem('install_dismissed')) {
      setShow(true)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function handleInstall() {
    if (deferredPrompt) {
      // Android/Chrome: trigger native install prompt
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(deferredPrompt as any).prompt()
      setDeferredPrompt(null)
    }
    setShow(false)
  }

  function handleDismiss() {
    sessionStorage.setItem('install_dismissed', '1')
    setShow(false)
  }

  if (!show || isStandalone) return null

  return (
    <div className="fixed bottom-20 lg:bottom-4 left-4 right-4 max-w-sm mx-auto z-40">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 flex items-start gap-3">
        {/* Icon */}
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">L</span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 dark:text-white">Install Lexora</p>
          {isIos && !deferredPrompt ? (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Tap <strong>Share</strong> then <strong>Add to Home Screen</strong> in Safari
            </p>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Add to your home screen for offline access
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5 shrink-0">
          {!isIos && deferredPrompt && (
            <button
              onClick={handleInstall}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Install
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg text-xs transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
