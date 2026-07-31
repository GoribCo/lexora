import { getLanguagePairs, getLevels, getStages } from './content'

export interface SearchResult {
  pair: string
  level: string
  stage: number
  title: string
  titleNative: string
  description: string
  url: string
  snippet: string
}

export function buildSearchIndex(): SearchResult[] {
  const pairs = getLanguagePairs()
  const levels = getLevels()
  const results: SearchResult[] = []

  for (const pair of pairs) {
    for (const level of levels) {
      const stages = getStages(pair.slug, level.code)
      for (const stage of stages) {
        results.push({
          pair: pair.slug,
          level: level.code,
          stage: stage.number,
          title: stage.title,
          titleNative: stage.titleNative,
          description: stage.description,
          url: `/${pair.slug}/${level.code}/${stage.number}`,
          snippet: stage.content.replace(/#+\s+[^\n]*/g, '').replace(/\|[^|]*\|/g, '').replace(/\*+/g, '').trim().slice(0, 120),
        })
      }
    }
  }

  return results
}
