import ThemeToggle from '@/components/ThemeToggle'
import SettingsClient from './SettingsClient'
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

      <SettingsClient />

      {/* Built with */}
      <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
        Built with Next.js 15 · Tailwind CSS v4
        <br />
        Content served from Markdown · No database
      </div>
    </div>
  )
}
