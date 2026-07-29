export interface Flashcard {
  front: string        // target language word (e.g. German or Polish)
  pronunciation: string
  back: string         // Bengali
  english: string
}

/**
 * Parse the vocabulary table from stage markdown.
 * Looks for a section heading like "## Vocabulary" or "## শব্দভাণ্ডার / Vocabulary"
 * then reads the markdown table that follows.
 */
export function parseFlashcardsFromMarkdown(content: string): Flashcard[] {
  const lines = content.split('\n')
  let inVocabSection = false
  let inTable = false
  let headerParsed = false
  const cards: Flashcard[] = []

  for (const line of lines) {
    const trimmed = line.trim()

    // Detect vocab section heading
    if (trimmed.startsWith('##')) {
      const heading = trimmed.toLowerCase()
      if (heading.includes('vocabulary') || heading.includes('শব্দভাণ্ডার')) {
        inVocabSection = true
        inTable = false
        headerParsed = false
        continue
      } else if (inVocabSection) {
        // New section — stop parsing vocab
        break
      }
    }

    if (!inVocabSection) continue

    // Detect table rows (start with |)
    if (trimmed.startsWith('|')) {
      inTable = true

      // Skip separator row (| --- | --- |)
      if (trimmed.replace(/[\s|\-:]/g, '') === '') continue

      const cells = trimmed
        .split('|')
        .map(c => c.trim())
        .filter((_, i, arr) => i > 0 && i < arr.length - 1) // drop first/last empty from leading/trailing |

      if (cells.length < 2) continue

      // Skip header row
      if (!headerParsed) {
        headerParsed = true
        continue
      }

      // Skip separator row that might have been parsed as data
      if (cells.every(c => /^[-:]+$/.test(c))) continue

      cards.push({
        front: cells[0] ?? '',
        pronunciation: cells[1] ?? '',
        back: cells[2] ?? '',
        english: cells[3] ?? '',
      })
    } else if (inTable && trimmed === '') {
      // Blank line after table — done
      break
    }
  }

  return cards
}
