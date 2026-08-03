import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Language, LanguagePair, Level, Stage, PairMeta, Opportunities } from './types'

const contentDir = path.join(process.cwd(), 'content')

export function getLanguagePairs(): LanguagePair[] {
  const filePath = path.join(contentDir, 'languages.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  const data = JSON.parse(raw)
  return data.pairs as LanguagePair[]
}

export function getLanguages(): Language[] {
  const filePath = path.join(contentDir, 'languages.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  const data = JSON.parse(raw)
  return data.languages as Language[]
}

export function getLevels(): Level[] {
  const filePath = path.join(contentDir, 'levels.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as Level[]
}

export function getPairMeta(pair: string): PairMeta {
  const filePath = path.join(contentDir, pair, 'meta.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as PairMeta
}

export function getStages(pair: string, level: string): Stage[] {
  const dir = path.join(contentDir, pair, level)
  if (!fs.existsSync(dir)) return []

  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .sort()

  return files.map(file => {
    const filePath = path.join(dir, file)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)
    const slug = file.replace('.md', '')

    return {
      number: data.stage as number,
      slug,
      title: data.title as string,
      titleNative: (data.titleBn || data.titleNative || '') as string,
      description: (data.description || '') as string,
      duration: (data.duration || '15 min') as string,
      vocabulary: (data.vocabulary || 0) as number,
      content,
    } satisfies Stage
  })
}

export function getStage(pair: string, level: string, stageNumber: number): Stage | null {
  const stages = getStages(pair, level)
  return stages.find(s => s.number === stageNumber) ?? null
}

export function getOpportunities(pair: string): Opportunities | null {
  const filePath = path.join(contentDir, pair, 'opportunities.md')
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    title: (data.title || '') as string,
    titleBn: (data.titleBn || '') as string,
    speakers: (data.speakers || '') as string,
    countries: (data.countries || []) as string[],
    highlights: (data.highlights || []) as Opportunities['highlights'],
    visa_types: data.visa_types as string[] | undefined,
    salary_range: data.salary_range as string | undefined,
    top_cities: data.top_cities as string[] | undefined,
    community_size: data.community_size as string | undefined,
    content,
  }
}
