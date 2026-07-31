const NOTES_KEY = 'lexora_stage_notes'

type NotesStore = Record<string, string>

function noteKey(pair: string, level: string, stageNum: number): string {
  return `${pair}-${level}-${stageNum}`
}

function getStore(): NotesStore {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(NOTES_KEY) || '{}') as NotesStore
  } catch {
    return {}
  }
}

export function getNote(pair: string, level: string, stageNum: number): string {
  const store = getStore()
  return store[noteKey(pair, level, stageNum)] ?? ''
}

export function setNote(pair: string, level: string, stageNum: number, text: string): void {
  const store = getStore()
  if (text.trim() === '') {
    delete store[noteKey(pair, level, stageNum)]
  } else {
    store[noteKey(pair, level, stageNum)] = text
  }
  localStorage.setItem(NOTES_KEY, JSON.stringify(store))
}

export function hasNote(pair: string, level: string, stageNum: number): boolean {
  const store = getStore()
  const val = store[noteKey(pair, level, stageNum)]
  return !!val && val.trim().length > 0
}

export function getAllNotes(): NotesStore {
  return getStore()
}
