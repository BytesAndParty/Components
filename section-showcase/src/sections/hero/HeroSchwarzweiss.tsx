import { useId, useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { SCHWARZWEISS_FONTS } from '../family-fonts'

/**
 * Schwarzweiß — reines Weiß, kein einziger Farbton. Eine gezeichnete Kellertür
 * als Bildmarke, darunter eine sehr große zentrierte Serif auf strenger
 * Mittelachse, darunter eine schmale Textspalte mit Zeilenhöhe 1:2. Der
 * senkrechte Flaschen-Reiter rechts klappt die Öffnungszeiten aus.
 * Abgrenzung zu Maison/Artisanal: reines Weiß statt Cream, zentrierte Spalte
 * statt asymmetrischer Überlappung — keine Tafeln, keine Fig.-Nummern.
 */

/** Gezeichnete Bildmarke: Kellertür, Federstrich, kein Fill. */
function KellerMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 66"
      fill="none"
      stroke="#000101"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* Türlaibung mit Rundbogen */}
      <path d="M6 60V22a18 18 0 0 1 36 0v38" />
      {/* Schwelle */}
      <path d="M1.5 60h45" />
      {/* Bretter */}
      <path d="M24 60V4M15 60V6.4M33 60V6.4" />
      {/* Bänder */}
      <path d="M8.5 30h13M8.5 47h13" />
      {/* Ring */}
      <circle cx="33.5" cy="41" r="3.4" />
      <path d="M33.5 37.6v-2.4" />
    </svg>
  )
}

/** Senkrechter Reiter in Flaschenform — Scharls eigenständigste Idee. */
function OeffnungszeitenReiter() {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div className="absolute top-1/2 right-0 z-30 hidden -translate-y-1/2 items-center gap-0 lg:flex">
      {/* Tafel — klappt links neben dem Reiter aus */}
      <div
        id={panelId}
        aria-hidden={!open}
        className={`mr-[-1px] w-64 border border-[#000101] bg-[#ffffff] px-7 py-7 transition-[opacity,transform,visibility] duration-300 ease-out ${
          open ? 'visible translate-x-0 opacity-100' : 'invisible translate-x-3 opacity-0'
        }`}
      >
        <span className="block text-[10px] font-semibold tracking-[0.3em] text-[#5f5f5f] uppercase">
          Ab Hof
        </span>
        <dl className="mt-5 space-y-3">
          {[
            ['Mo – Fr', '09 – 18 Uhr'],
            ['Samstag', '09 – 14 Uhr'],
            ['Sonntag', 'geschlossen'],
          ].map(([tag, zeit]) => (
            <div key={tag} className="flex items-baseline justify-between border-b border-[#000101]/15 pb-2">
              <dt className="text-[11px] font-semibold tracking-[0.18em] text-[#000101] uppercase">{tag}</dt>
              <dd className="font-display text-lg leading-none font-light text-[#000101]">{zeit}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-base leading-[1.8] text-[#5f5f5f]">
          Verkostung nach Voranmeldung, auch außerhalb dieser Zeiten.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Öffnungszeiten schließen' : 'Öffnungszeiten anzeigen'}
        className="relative block min-h-11 w-14 cursor-pointer rounded-xs focus-visible:ring-2 focus-visible:ring-[#000101] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ffffff] focus-visible:outline-none"
      >
        <svg viewBox="0 0 56 210" aria-hidden="true" className="block h-52 w-14">
          <path
            d="M19 6a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v42c0 8 9 12 9 24v122a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8V72c0-12 9-16 9-24Z"
            fill="#000101"
          />
        </svg>
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pb-4 text-[10px] font-semibold tracking-[0.32em] text-[#ffffff] uppercase [writing-mode:vertical-rl] rotate-180"
        >
          Öffnungszeiten
        </span>
      </button>
    </div>
  )
}

const REGISTER: Array<[string, string]> = [
  ['Herkunft', 'Wachau & Thermenregion'],
  ['Rieden', 'Loibenberg · Kreutles · Pfaffenberg'],
  ['Betrieb', 'Familie, seit 1958'],
]

export function HeroSchwarzweiss() {
  return (
    <section style={SCHWARZWEISS_FONTS} className="relative flex min-h-screen w-full flex-col bg-[#ffffff] px-6 py-10 sm:px-10 lg:px-16">
      <OeffnungszeitenReiter />

      {/* Kopfleiste — rahmt das weiße Feld oben, damit der Raum darunter
          als gesetzt und nicht als übrig gelassen liest. */}
      <BlurFade delay={0} direction="down">
        <div className="flex items-baseline justify-between border-b border-[#000101] pb-4">
          <span className="font-display text-xl leading-none font-light text-[#000101]">Buchart58</span>
          <span className="text-[10px] font-semibold tracking-[0.32em] text-[#5f5f5f] uppercase">
            Weingut seit 1958
          </span>
        </div>
      </BlurFade>

      {/* Mittelachse: Marke → Serif → schmale Spalte. Alles zentriert, der
          Weißraum liegt symmetrisch links und rechts — komponiert, nicht leer. */}
      <div className="flex flex-1 items-center justify-center py-20 sm:py-28">
        <div className="mx-auto w-full max-w-3xl text-center">
          <BlurFade delay={120} direction="up" className="flex justify-center">
            <KellerMark className="h-16 w-auto sm:h-20" />
          </BlurFade>

          <BlurFade delay={240} direction="up">
            <span className="mt-10 block text-[10px] font-semibold tracking-[0.4em] text-[#5f5f5f] uppercase">
              Kellergasse 58 · Niederösterreich
            </span>
          </BlurFade>

          <BlurFade delay={340} direction="up">
            <h1 className="font-display mt-8 text-[clamp(3rem,8.5vw,6.5rem)] leading-[0.94] font-light tracking-tight text-[#000101]">
              Was bleibt,
              <br />
              wenn man alles
              <br />
              weglässt.
            </h1>
          </BlurFade>

          <BlurFade delay={480} direction="up">
            <p className="mx-auto mt-12 max-w-md text-[17px] leading-[2] text-[#5f5f5f]">
              Vier Rieden, ein Handgriff, der seit drei Generationen derselbe
              geblieben ist. Wir haben aufgehört, dem Wein etwas hinzuzufügen —
              und angefangen, ihn stehen zu lassen. Was danach in der Flasche
              ist, muss ohne Erklärung auskommen.
            </p>
          </BlurFade>

          {/* Senkrechte Haarlinie als Achsmarke: misst den Weißraum aus,
              statt ihn zu ertragen. */}
          <BlurFade delay={600} className="flex justify-center">
            <span aria-hidden="true" className="mt-14 block h-20 w-px bg-[#000101]/25" />
          </BlurFade>

          <BlurFade delay={700} direction="up" className="mt-10 flex justify-center">
            <a
              href="/rieden"
              className="group inline-flex min-h-11 items-center gap-5 rounded-xs text-[11px] font-semibold tracking-[0.28em] text-[#000101] uppercase focus-visible:ring-2 focus-visible:ring-[#000101] focus-visible:ring-offset-4 focus-visible:ring-offset-[#ffffff] focus-visible:outline-none"
            >
              Die Rieden ansehen
              <span
                aria-hidden="true"
                className="h-px w-10 bg-[#000101] transition-all duration-500 group-hover:w-20"
              />
            </a>
          </BlurFade>
        </div>
      </div>

      {/* Fußregister — Gegengewicht am unteren Rand. */}
      <BlurFade delay={820}>
        <dl className="grid grid-cols-1 gap-6 border-t border-[#000101] pt-5 sm:grid-cols-3">
          {REGISTER.map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1.5">
              <dt className="text-[9px] font-semibold tracking-[0.3em] text-[#5f5f5f] uppercase">{label}</dt>
              <dd className="font-display text-lg leading-tight font-light text-[#000101]">{value}</dd>
            </div>
          ))}
        </dl>
      </BlurFade>
    </section>
  )
}
