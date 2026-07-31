const SRS_KEY = 'lexora_srs'

interface CardRecord {
  front: string
  score: number
  nextReview: string  // ISO date string "YYYY-MM-DD"
  lastReview: string  // ISO date string "YYYY-MM-DD"
}

interface SRSStore {
  [key: string]: CardRecord
}

function cardKey(pair: string, level: string, stage: number, front: string): string {
  return `${pair}-${level}-${stage}-${front}`
}

export function getSRSStore(): SRSStore {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(SRS_KEY) || '{}') as SRSStore
  } catch {
    return {}
  }
}

export function getCardRecord(
  pair: string,
  level: string,
  stage: number,
  front: string
): CardRecord | null {
  const store = getSRSStore()
  return store[cardKey(pair, level, stage, front)] ?? null
}

/** Simple interval schedule: score 0=new/1=hard → 1 day, 2=ok → 3 days, 3=easy → 7 days */
function intervalDays(score: 0 | 1 | 2 | 3): number {
  switch (score) {
    case 0: return 1
    case 1: return 1
    case 2: return 3
    case 3: return 7
  }
}

function addDays(date: Date, days: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export function updateCard(
  pair: string,
  level: string,
  stage: number,
  front: string,
  score: 0 | 1 | 2 | 3
): void {
  const store = getSRSStore()
  const key = cardKey(pair, level, stage, front)
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  store[key] = {
    front,
    score,
    lastReview: todayStr,
    nextReview: addDays(today, intervalDays(score)),
  }
  localStorage.setItem(SRS_KEY, JSON.stringify(store))
}

export type DueCard = CardRecord & { pair: string; level: string; stage: number; key: string }

export function getDueCards(pair: string): DueCard[] {
  const store = getSRSStore()
  const today = new Date().toISOString().split('T')[0]
  const due: DueCard[] = []

  for (const [key, record] of Object.entries(store)) {
    if (!key.startsWith(`${pair}-`)) continue
    if (record.nextReview <= today) {
      // Parse key: pair-level-stage-front (front may contain dashes)
      const prefixPattern = new RegExp(`^${pair}-([^-]+)-(\\d+)-(.+)$`)
      const match = key.match(prefixPattern)
      if (match) {
        due.push({
          ...record,
          pair,
          level: match[1],
          stage: parseInt(match[2], 10),
          key,
        })
      }
    }
  }

  return due
}

export function getDueCardCount(pair: string): number {
  return getDueCards(pair).length
}
