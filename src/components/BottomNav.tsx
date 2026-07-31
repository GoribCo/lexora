'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import config from '@/config'
import { useUiLang } from './UiLanguageProvider'

const icons = {
  home: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  courses: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  ),
  review: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  settings: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
}

export default function BottomNav() {
  const pathname = usePathname()
  const { t } = useUiLang()

  const navItems = [
    { label: t.nav.home,     href: '/',         icon: icons.home },
    { label: t.nav.courses,  href: '/courses',  icon: icons.courses },
    { label: t.nav.review,   href: '/review',   icon: icons.review },
    { label: t.nav.settings, href: '/settings', icon: icons.settings },
  ]

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    if (href === '/settings') return pathname.startsWith('/settings')
    if (href === '/review') return pathname.startsWith('/review')
    if (href === '/courses') {
      // Active on /courses or any pair-scoped page (levels, stages, vocabulary, progress)
      return pathname.startsWith('/courses') || /^\/[a-z]{2}-[a-z]{2}/.test(pathname)
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* ── Mobile bottom bar (hidden on lg+) ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)] backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-t border-gray-200/60 dark:border-gray-700/60">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {navItems.map(item => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-2 px-4 min-w-[56px] transition-colors ${
                  active
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <span className={`transition-transform ${active ? 'scale-110' : ''}`}>
                  {item.icon}
                </span>
                <span className={`text-[10px] font-medium ${active ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* ── Desktop sidebar (hidden below lg) ── */}
      <nav className="hidden lg:flex flex-col sticky top-0 h-dvh w-56 shrink-0 z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold">L</span>
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">Lexora</span>
        </div>

        {/* Nav items */}
        <div className="flex-1 flex flex-col gap-1 px-3 py-4">
          {navItems.map(item => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium text-sm ${
                  active
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className={active ? 'text-indigo-600 dark:text-indigo-400' : ''}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-600">{config.app.name} v{config.app.version}</p>
        </div>
      </nav>
    </>
  )
}
