import type { CSSProperties } from 'react'

/**
 * Per-Stil-Font-Overrides. Nur Familien mit einem eigenständigen Vorbild aus
 * design-research/ weichen vom globalen --font-display/--font-sans-Pairing ab
 * (siehe styles.css). Wird auf dem Section-Root per `style` gesetzt.
 *
 * Zwei Dinge pro Override, nicht nur eins:
 * 1. Die Custom Properties selbst (`--font-*-base`), damit jede vorhandene
 *    `font-display`/`font-sans`-Klasse *innerhalb* der Section die Stil-eigene
 *    Schrift bekommt, ohne einzelne Klassen anfassen zu müssen.
 * 2. Eine echte `fontFamily`-Deklaration auf dem Root — Fließtext ohne eigene
 *    font-sans-Klasse erbt sonst den bereits aufgelösten Wert von <body>
 *    (CSS-Vererbung vererbt den berechneten Wert, nicht die Variable), und
 *    würde die Stil-Schrift sonst ignorieren.
 */
function familyFonts(display: string, sans: string): CSSProperties {
  return {
    '--font-display-base': `var(${display})`,
    '--font-sans-base': `var(${sans})`,
    fontFamily: `var(${sans})`,
  } as CSSProperties
}

export const GENUSSGUT_FONTS = familyFonts('--font-genussgut-display', '--font-genussgut-sans')
export const SCHWARZWEISS_FONTS = familyFonts('--font-schwarzweiss-display', '--font-schwarzweiss-sans')
export const GASTGEBER_FONTS = familyFonts('--font-gastgeber-display', '--font-gastgeber-sans')
