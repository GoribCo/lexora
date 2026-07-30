// Central developer configuration.
// Content (languages, levels, stages) lives in /content/*.json and *.md files.

const config = {
  // ── Site identity ──────────────────────────────────────────────────────────
  app: {
    name: 'Lexora',
    version: '0.1.0',
    tagline: 'Learn languages step by step',
  },

  // ── URLs ──────────────────────────────────────────────────────────────────
  // Override with NEXT_PUBLIC_SITE_URL env var in production.
  // Override with NEXT_PUBLIC_BASE_PATH for GitHub Pages sub-directory deploys.
  url: {
    site: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lexora.app',
    basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  },

  // ── Dev server ─────────────────────────────────────────────────────────────
  dev: {
    port: 3010,
  },

  // ── SEO defaults ──────────────────────────────────────────────────────────
  seo: {
    defaultTitle: 'Lexora – Language Learning',
    titleTemplate: '%s | Lexora',
    defaultDescription:
      'Learn German and Polish from Bengali with structured CEFR lessons. Step-by-step stages from A1 to C2 with vocabulary, flashcards, and spaced repetition.',
    keywords: ['language learning', 'German', 'Polish', 'Bengali', 'CEFR', 'A1 B1 C2', 'flashcards', 'vocabulary'],
  },

  // ── Theme ──────────────────────────────────────────────────────────────────
  theme: {
    colorLight: '#f9fafb',
    colorDark: '#0f172a',
    primary: '#4f46e5',
  },
} as const

export default config
