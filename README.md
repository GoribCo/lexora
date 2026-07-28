# Lexora

A mobile-first language learning website built with Next.js. Learn new languages step by step through structured CEFR levels and bite-sized stages — no database required, all content lives in Markdown files.

## Features

- **Structured CEFR levels** — A1 through C2 with clear learning goals
- **Step-by-step stages** — each stage covers vocabulary, grammar notes, dialogues, and cultural notes
- **Bilingual content** — lessons written in both the source and target language
- **Dark / light theme** — persisted in `localStorage`
- **Mobile-first** — bottom navigation, optimized for phones
- **Static export** — deployable to GitHub Pages or any static host
- **No database** — all content is plain Markdown files

## Available Language Pairs

| From | To | Slug |
|------|----|------|
| 🇧🇩 Bengali | 🇩🇪 German | `bn-de` |
| 🇧🇩 Bengali | 🇵🇱 Polish | `bn-pl` |

## Tech Stack

| Tool | Version |
|------|---------|
| [Next.js](https://nextjs.org) | 15 (App Router, static export) |
| [React](https://react.dev) | 19 |
| [Tailwind CSS](https://tailwindcss.com) | 4 |
| [gray-matter](https://github.com/jonschlinkert/gray-matter) | 4 |
| [react-markdown](https://github.com/remarkjs/react-markdown) | 9 |
| [remark-gfm](https://github.com/remarkjs/remark-gfm) | 4 |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/lexora.git
cd lexora

# Install dependencies and start the dev server
./run.sh
```

Or manually:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
lexora/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── layout.tsx              # Root layout (ThemeProvider, BottomNav)
│   │   ├── page.tsx                # Home — language pair selector
│   │   ├── globals.css             # Tailwind v4 + global styles
│   │   ├── [pair]/
│   │   │   ├── page.tsx            # Level selection (A1–C2)
│   │   │   └── [level]/
│   │   │       ├── page.tsx        # Stage list
│   │   │       └── [stage]/
│   │   │           └── page.tsx    # Stage content with prev/next
│   │   └── settings/
│   │       └── page.tsx            # Settings page
│   ├── components/
│   │   ├── BottomNav.tsx           # Fixed bottom navigation
│   │   ├── ThemeProvider.tsx       # Dark/light mode context
│   │   └── ThemeToggle.tsx         # Sun/moon toggle button
│   └── lib/
│       ├── content.ts              # Filesystem content loaders
│       └── types.ts                # TypeScript interfaces
├── content/                        # All lesson content (Markdown + JSON)
│   ├── languages.json              # Language definitions and pairs
│   ├── levels.json                 # CEFR level definitions (A1–C2)
│   ├── bn-de/
│   │   ├── meta.json
│   │   └── a1/
│   │       ├── stage-01.md         # Greetings
│   │       ├── stage-02.md         # Numbers
│   │       └── ...
│   └── bn-pl/
│       ├── meta.json
│       └── a1/
│           ├── stage-01.md
│           └── ...
├── public/
│   └── .nojekyll                   # Required for GitHub Pages
├── next.config.ts
├── run.sh                          # Quick start script
└── README.md
```

## Adding a New Language Pair

1. **Register the pair** in `content/languages.json`:

```json
{
  "pairs": [
    {
      "from": { "code": "bn", "name": "Bengali", "nativeName": "বাংলা", "flag": "🇧🇩" },
      "to":   { "code": "fr", "name": "French",  "nativeName": "Français", "flag": "🇫🇷" },
      "slug": "bn-fr",
      "description": "Learn French starting from Bengali",
      "totalLearners": "0"
    }
  ]
}
```

2. **Create the pair folder** and meta file:

```
content/bn-fr/
  meta.json
  a1/
    stage-01.md
    stage-02.md
    ...
```

3. **Write stage files** using this frontmatter:

```markdown
---
stage: 1
title: "Bonjour – Greetings"
titleBn: "শুভেচ্ছা"
description: "Learn essential French greetings."
duration: "15 min"
vocabulary: 8
---

## Content here...
```

That's it — routes are generated automatically from the filesystem.

## Adding a New Stage

Drop a new `.md` file into the appropriate `content/[pair]/[level]/` folder. Files are sorted alphabetically, so use zero-padded names: `stage-06.md`, `stage-07.md`, etc. Update `totalStages` in the pair's `meta.json` if you want the count to show correctly on the level page.

## Deployment to GitHub Pages

1. Set the base path in your environment or `next.config.ts`:

```ts
basePath: '/your-repo-name'
```

2. Build the static export:

```bash
npm run build
```

3. Deploy the `out/` folder to the `gh-pages` branch:

```bash
# Using gh-pages package
npx gh-pages -d out
```

Or configure a GitHub Actions workflow to build and deploy on every push to `main`.

## Scripts

| Command | Description |
|---------|-------------|
| `./run.sh` | Install deps (if needed) and start dev server |
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build and export static files to `out/` |
| `npm run lint` | Run ESLint |

## License

MIT
