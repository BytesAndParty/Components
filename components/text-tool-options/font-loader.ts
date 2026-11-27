let stylesheetReady: Promise<void> | null = null

/**
 * Loads the self-hosted `@font-face` rules once (`font-faces.ts`, @fontsource).
 * Resolves when the rules are known to the document, or when they failed to
 * load (chunk blocked, offline): the fallback fonts stay then, nothing waits
 * forever.
 */
export function ensureFontStylesheet(): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve()
  stylesheetReady ??= import('./font-faces').then(
    () => undefined,
    () => undefined,
  )
  return stylesheetReady
}

/** One face a text is set in. `text` picks the unicode subsets to fetch. */
export interface FontFaceRequest {
  family: string
  weight?: string | number
  style?: string
  text?: string
}

/**
 * Loads the given faces. Resolves with the families that were NOT usable
 * before this call: text drawn on a canvas in the meantime was measured in a
 * fallback font and has to be measured again. System fonts and faces already
 * loaded are not listed; a face that fails to load keeps its fallback.
 */
export async function loadFonts(faces: FontFaceRequest[]): Promise<string[]> {
  if (typeof document === 'undefined' || !document.fonts) return []
  await ensureFontStylesheet()
  const loaded = new Set<string>()
  await Promise.all(
    faces.map(async ({ family, weight = 'normal', style = 'normal', text }) => {
      const font = `${style} ${weight} 16px "${family}"`
      try {
        // True as well for a family without @font-face rule (system fonts).
        if (document.fonts.check(font, text)) return
        await document.fonts.load(font, text)
        loaded.add(family)
      } catch {
        // Not a loadable face (e.g. a CSS font stack): the fallback stays.
      }
    }),
  )
  return [...loaded]
}
