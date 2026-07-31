const RATINGS_KEY = 'lexora_stage_ratings'

export type Rating = 1 | 2 | 3 // 1=easy, 2=medium, 3=hard

type RatingsStore = Record<string, Rating>

function ratingKey(pair: string, level: string, stageNum: number): string {
  return `${pair}-${level}-${stageNum}`
}

function getStore(): RatingsStore {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(RATINGS_KEY) || '{}') as RatingsStore
  } catch {
    return {}
  }
}

export function getRating(pair: string, level: string, stageNum: number): Rating | null {
  const store = getStore()
  const val = store[ratingKey(pair, level, stageNum)]
  return val ?? null
}

export function setRating(pair: string, level: string, stageNum: number, rating: Rating): void {
  const store = getStore()
  store[ratingKey(pair, level, stageNum)] = rating
  localStorage.setItem(RATINGS_KEY, JSON.stringify(store))
}

export function getAllRatings(): RatingsStore {
  return getStore()
}
