export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

export interface LanguagePair {
  from: Language
  to: Language
  slug: string
  description: string
  totalLearners?: string
}

export interface Level {
  code: string
  name: string
  fullName: string
  description: string
  skills: string[]
  duration: string
  vocabulary: string
  color: string
}

export interface Stage {
  number: number
  slug: string
  title: string
  titleNative: string
  description: string
  duration: string
  vocabulary: number
  content: string
}

export interface PairMeta {
  title: string
  titleEn?: string
  description: string
  totalStages: Record<string, number>
}
