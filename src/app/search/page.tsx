import { buildSearchIndex } from '@/lib/searchIndex'
import SearchClient from './SearchClient'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Search Lessons',
  description: 'Search all Lexora lessons by title, topic, or vocabulary.',
}

export default function SearchPage() {
  const index = buildSearchIndex()
  return <SearchClient index={index} />
}
