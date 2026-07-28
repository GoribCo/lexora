import ThemeToggle from '@/components/ThemeToggle'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Customize your Lexora experience.',
}

export default function SettingsPage() {
  return (
    <div className="max-w-md mx-auto px-4 pb-28 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <ThemeToggle />
      </div>

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
            <div className="text-sm text-gray-500 dark:text-gray-400">0.1.0</div>
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">Available Courses</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">1 (Bengali → German)</div>
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">Total Stages</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">5 (A1 level)</div>
          </div>
        </div>
      </section>

      {/* Built with */}
      <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
        Built with Next.js 15 · Tailwind CSS v4
        <br />
        Content served from Markdown · No database
      </div>
    </div>
  )
}
