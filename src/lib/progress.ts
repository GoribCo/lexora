export interface StageProgress { completedStages: number[]; startedAt: string }
export interface LevelProgress { [levelCode: string]: StageProgress }
export interface AllProgress { [pairSlug: string]: LevelProgress }

const PROGRESS_KEY = 'lexora_progress'
const STREAK_KEY = 'lexora_streak'

export function getProgress(): AllProgress {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') as AllProgress
  } catch {
    return {}
  }
}

export function markStageComplete(pair: string, level: string, stageNum: number): void {
  const progress = getProgress()
  if (!progress[pair]) progress[pair] = {}
  if (!progress[pair][level]) {
    progress[pair][level] = { completedStages: [], startedAt: new Date().toISOString() }
  }
  const stages = progress[pair][level].completedStages
  if (!stages.includes(stageNum)) {
    stages.push(stageNum)
  }
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

export function isStageComplete(pair: string, level: string, stageNum: number): boolean {
  const progress = getProgress()
  return progress[pair]?.[level]?.completedStages?.includes(stageNum) ?? false
}

export function getLevelCompletion(pair: string, level: string, totalStages: number): number {
  if (totalStages === 0) return 0
  const progress = getProgress()
  const completed = progress[pair]?.[level]?.completedStages?.length ?? 0
  return Math.round((completed / totalStages) * 100)
}

export function getTotalCompletedStages(): number {
  const progress = getProgress()
  let total = 0
  for (const pair of Object.values(progress)) {
    for (const level of Object.values(pair)) {
      total += level.completedStages.length
    }
  }
  return total
}

export function resetProgress(): void {
  localStorage.removeItem(PROGRESS_KEY)
  localStorage.removeItem(STREAK_KEY)
}

export function getStreak(): { count: number; lastDate: string } {
  if (typeof window === 'undefined') return { count: 0, lastDate: '' }
  try {
    const stored = localStorage.getItem(STREAK_KEY)
    if (!stored) return { count: 0, lastDate: '' }
    return JSON.parse(stored) as { count: number; lastDate: string }
  } catch {
    return { count: 0, lastDate: '' }
  }
}

export function updateStreak(): void {
  const today = new Date().toISOString().split('T')[0]
  const streak = getStreak()
  if (streak.lastDate === today) return
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0]
  const newCount = streak.lastDate === yesterday ? streak.count + 1 : 1
  localStorage.setItem(STREAK_KEY, JSON.stringify({ count: newCount, lastDate: today }))
}
