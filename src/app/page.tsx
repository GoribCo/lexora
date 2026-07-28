import { getLanguages, getLanguagePairs } from '@/lib/content'
import HomeClient from './HomeClient'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Lexora – Start Learning',
  description: 'Select your language pair and start learning today.',
}

export default function HomePage() {
  const languages = getLanguages()
  const pairs = getLanguagePairs()

  return <HomeClient languages={languages} pairs={pairs} />
}
