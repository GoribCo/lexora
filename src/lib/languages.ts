export const LANG_TO_BCP47: Record<string, string> = {
  de: 'de-DE',
  pl: 'pl-PL',
  en: 'en-US',
  fr: 'fr-FR',
  es: 'es-ES',
  ja: 'ja-JP',
  bn: 'bn-BD',
}

/** Extracts the target language BCP-47 code from a pair slug like "bn-de" → "de-DE" */
export function getLangCode(pairSlug: string): string {
  const parts = pairSlug.split('-')
  const target = parts[1] ?? 'de'
  return LANG_TO_BCP47[target] ?? target
}
