import config from '@/config'

// Type-safe gtag wrapper. Only fires when GA ID is configured and gtag is loaded.
function gtag(...args: unknown[]) {
  if (typeof window === 'undefined') return
  if (!config.analytics.gaId) return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).gtag?.(...args)
}

// ── Page view ──────────────────────────────────────────────────────────────
// Called automatically by the GoogleAnalytics component on route change.
export function trackPageView(url: string) {
  gtag('config', config.analytics.gaId, { page_path: url })
}

// ── Stage events ──────────────────────────────────────────────────────────
export function trackStageComplete(pair: string, level: string, stage: number) {
  gtag('event', 'stage_complete', { pair, level, stage })
}

export function trackStageView(pair: string, level: string, stage: number) {
  gtag('event', 'stage_view', { pair, level, stage })
}

export function trackDifficultyRate(pair: string, level: string, stage: number, rating: 1 | 2 | 3) {
  const label = rating === 1 ? 'easy' : rating === 2 ? 'medium' : 'hard'
  gtag('event', 'difficulty_rate', { pair, level, stage, rating: label })
}

// ── Flashcard events ──────────────────────────────────────────────────────
export function trackFlashcardFlip(pair: string, level: string, stage: number, word: string) {
  gtag('event', 'flashcard_flip', { pair, level, stage, word })
}

export function trackFlashcardComplete(pair: string, level: string, stage: number, cardCount: number) {
  gtag('event', 'flashcard_complete', { pair, level, stage, card_count: cardCount })
}

// ── Quiz events ───────────────────────────────────────────────────────────
export function trackQuizStart(pair: string, level: string, stage: number, cardCount: number) {
  gtag('event', 'quiz_start', { pair, level, stage, card_count: cardCount })
}

export function trackQuizComplete(pair: string, level: string, stage: number, score: number, total: number) {
  gtag('event', 'quiz_complete', {
    pair, level, stage,
    score, total,
    score_pct: Math.round((score / total) * 100),
  })
}

export function trackQuizAnswer(correct: boolean) {
  gtag('event', 'quiz_answer', { correct })
}

// ── Review (SRS) events ───────────────────────────────────────────────────
export function trackReviewScore(pair: string, score: 1 | 2 | 3) {
  const label = score === 1 ? 'hard' : score === 2 ? 'good' : 'easy'
  gtag('event', 'review_score', { pair, score: label })
}

export function trackReviewSessionComplete(pair: string, cardCount: number) {
  gtag('event', 'review_session_complete', { pair, card_count: cardCount })
}

// ── Audio events ──────────────────────────────────────────────────────────
export function trackSpeak(word: string, lang: string) {
  gtag('event', 'speak', { word, lang })
}

// ── Search events ─────────────────────────────────────────────────────────
export function trackSearch(query: string, resultCount: number) {
  gtag('event', 'search', { search_term: query, result_count: resultCount })
}

// ── Navigation events ─────────────────────────────────────────────────────
export function trackCourseSelect(pair: string) {
  gtag('event', 'course_select', { pair })
}

export function trackLevelSelect(pair: string, level: string) {
  gtag('event', 'level_select', { pair, level })
}

// ── Opportunities events ──────────────────────────────────────────────────
export function trackOpportunitiesView(pair: string) {
  gtag('event', 'opportunities_view', { pair })
}

export function trackOpportunitiesHighlightClick(pair: string, highlightTitle: string) {
  gtag('event', 'opportunities_highlight_click', { pair, highlight: highlightTitle })
}

export function trackOpportunitiesCtaClick(pair: string) {
  gtag('event', 'opportunities_cta_click', { pair })
}

// ── Export / Import ───────────────────────────────────────────────────────
export function trackExport() {
  gtag('event', 'export_progress')
}

export function trackImport(success: boolean) {
  gtag('event', 'import_progress', { success })
}

// ── Word of the Day ───────────────────────────────────────────────────────
export function trackWotdView(word: string, pair: string) {
  gtag('event', 'wotd_view', { word, pair })
}

export function trackWotdClick(word: string, pair: string) {
  gtag('event', 'wotd_click', { word, pair })
}
