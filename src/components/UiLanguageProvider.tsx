'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { type UiLang, type Translations, translations, detectUiLang } from '@/lib/i18n'

const STORAGE_KEY = 'lexora_ui_lang'

interface UiLangContextValue {
  lang: UiLang
  t: Translations
  setLang: (lang: UiLang) => void
}

const UiLangContext = createContext<UiLangContextValue>({
  lang: 'en',
  t: translations.en,
  setLang: () => {},
})

export function useUiLang() {
  return useContext(UiLangContext)
}

export default function UiLanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<UiLang>('en')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as UiLang | null
    const resolved = stored ?? detectUiLang()
    setLangState(resolved)
  }, [])

  function setLang(next: UiLang) {
    localStorage.setItem(STORAGE_KEY, next)
    setLangState(next)
  }

  return (
    <UiLangContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </UiLangContext.Provider>
  )
}
