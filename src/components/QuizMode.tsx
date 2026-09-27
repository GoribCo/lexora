'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Flashcard } from '@/lib/flashcards'
import { useUiLang } from '@/components/UiLanguageProvider'
import { trackQuizStart, trackQuizAnswer, trackQuizComplete } from '@/lib/analytics'

interface Props {
  cards: Flashcard[]
  langCode: string
  pair?: string
  level?: string
  stage?: number
}

interface QuizQuestion {
  card: Flashcard
  options: string[] // Bengali options
  correctIndex: number
}

function buildQuestions(cards: Flashcard[]): QuizQuestion[] {
  return cards.map((card, idx) => {
    const wrongPool = cards.filter((_, i) => i !== idx).map(c => c.back)
    // Shuffle wrong pool and pick 3
    const shuffled = wrongPool.sort(() => Math.random() - 0.5).slice(0, 3)
    const options = [...shuffled, card.back].sort(() => Math.random() - 0.5)
    return {
      card,
      options,
      correctIndex: options.indexOf(card.back),
    }
  })
}

export default function QuizMode({ cards, pair = '', level = '', stage = 0 }: Props) {
  const { t } = useUiLang()
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const initQuiz = useCallback(() => {
    const q = buildQuestions(cards)
    setQuestions(q)
    setCurrentIndex(0)
    setSelected(null)
    setScore(0)
    setDone(false)
    trackQuizStart(pair, level, stage, cards.length)
  }, [cards, pair, level, stage])

  useEffect(() => {
    initQuiz()
  }, [initQuiz])

  if (questions.length === 0) return null

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="py-6 text-center">
        <div className="text-5xl mb-3">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📚'}</div>
        <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t.quiz.score}</p>
        <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4">
          {score} / {questions.length}
        </p>
        <button
          onClick={initQuiz}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          {t.quiz.retry}
        </button>
      </div>
    )
  }

  const q = questions[currentIndex]
  const isAnswered = selected !== null
  const isCorrect = selected === q.correctIndex

  function handleSelect(idx: number) {
    if (selected !== null) return
    setSelected(idx)
    const correct = idx === q.correctIndex
    trackQuizAnswer(correct)
    if (correct) {
      setScore(s => s + 1)
      setTimeout(() => advance(), 1000)
    }
  }

  function advance() {
    setSelected(null)
    if (currentIndex + 1 >= questions.length) {
      const finalScore = score + (selected === questions[currentIndex]?.correctIndex ? 1 : 0)
      trackQuizComplete(pair, level, stage, finalScore, questions.length)
      setDone(true)
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  const progress = Math.round((currentIndex / questions.length) * 100)

  return (
    <div className="mt-2">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {currentIndex + 1} / {questions.length}
          </span>
          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-4 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wide">Choose the meaning</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{q.card.front}</p>
        {q.card.pronunciation && (
          <p className="text-sm text-indigo-500 dark:text-indigo-400 font-mono">{q.card.pronunciation}</p>
        )}
      </div>

      {/* Result message */}
      {isAnswered && (
        <div
          className={`mb-3 px-4 py-2 rounded-xl text-sm font-medium text-center ${
            isCorrect
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
          }`}
        >
          {isCorrect ? `✓ ${t.quiz.correct}` : `✗ ${t.quiz.wrong}`}
        </div>
      )}

      {/* Options */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {q.options.map((opt, idx) => {
          let style =
            'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:border-indigo-300 dark:hover:border-indigo-600'

          if (isAnswered) {
            if (idx === q.correctIndex) {
              style =
                'border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
            } else if (idx === selected && !isCorrect) {
              style =
                'border-rose-400 dark:border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
            } else {
              style =
                'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-600 opacity-60'
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`px-3 py-3 rounded-xl border text-sm font-medium transition-colors ${style} ${
                !isAnswered ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {/* Manual next (on wrong answer) */}
      {isAnswered && !isCorrect && (
        <button
          onClick={advance}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          {t.quiz.next}
        </button>
      )}
    </div>
  )
}
