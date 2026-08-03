'use client'

import { useEffect, useState, useRef } from 'react'
import { trackSpeak } from '@/lib/analytics'

interface Props {
  text: string
  lang: string  // BCP-47 code, e.g. 'de-DE'
}

export default function SpeakButton({ text, lang }: Props) {
  const [available, setAvailable] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    setAvailable(typeof window !== 'undefined' && 'speechSynthesis' in window)
  }, [])

  if (!available) return null

  function handleSpeak() {
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = lang
    trackSpeak(text, lang)
    utter.onstart = () => setSpeaking(true)
    utter.onend = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)
    utteranceRef.current = utter
    window.speechSynthesis.speak(utter)
  }

  return (
    <button
      onClick={handleSpeak}
      aria-label={`Pronounce ${text}`}
      title={`Pronounce in ${lang}`}
      className={`p-1.5 rounded-lg transition-colors ${
        speaking
          ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 animate-pulse'
          : 'text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    </button>
  )
}
