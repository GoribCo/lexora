'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { getNote, setNote } from '@/lib/notes'
import { useUiLang } from '@/components/UiLanguageProvider'

interface Props {
  pair: string
  level: string
  stageNum: number
}

export default function StageNotes({ pair, level, stageNum }: Props) {
  const { t } = useUiLang()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setText(getNote(pair, level, stageNum))
  }, [pair, level, stageNum])

  const save = useCallback(
    (val: string) => {
      setNote(pair, level, stageNum, val)
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    },
    [pair, level, stageNum]
  )

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value
    setText(val)
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => save(val), 500)
  }

  function handleBlur() {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
    }
    save(text)
  }

  return (
    <div className="mt-6 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/60 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span>📝</span>
          {t.notes.title}
          {text.trim() && (
            <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
          )}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        className={`transition-all duration-200 overflow-hidden ${
          open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 bg-white dark:bg-gray-900">
          <textarea
            value={text}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t.notes.placeholder}
            rows={4}
            className="w-full resize-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              {text.length} chars
            </span>
            {saved && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {t.notes.saved}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Small dot indicator for stage list cards
interface NoteIndicatorProps {
  pair: string
  level: string
  stageNum: number
}

export function NoteIndicator({ pair, level, stageNum }: NoteIndicatorProps) {
  const [hasNote, setHasNote] = useState(false)

  useEffect(() => {
    const note = getNote(pair, level, stageNum)
    setHasNote(note.trim().length > 0)
  }, [pair, level, stageNum])

  if (!hasNote) return null

  return (
    <span
      title="Has notes"
      className="inline-flex items-center gap-0.5 text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-1.5 py-0.5 rounded-full"
    >
      📝
    </span>
  )
}
