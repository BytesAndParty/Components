import { BlurFade } from '@components/blur-fade/blur-fade'
import { HangTag } from '@components/hang-tag/hang-tag'

/**
 * Das Geschenk — eine einzelne Flasche als Hero, am Hals ein Kraftkarton-
 * Anhänger mit handgeschriebener Widmung (HangTag hanging). Daneben hält die
 * Serif-Headline das Haus-Niveau, drei Hairline-Zeilen erklären den Ablauf,
 * ein freier HangTag (loose) bietet den Gutschein als Alternative an.
 */

// Freigestellte Rotweinflasche aus _public_ (1024 × 1536). Maße in Bildpixeln, aus dem Alpha-Kanal
// vermessen: Umriss der Flasche, Knoten am Übergang Hals → Schulter, Halsbreite dort.
const BOTTLE = { x: 390, y: 253, w: 246, h: 986, knotX: 513.5, knotY: 514, neck: 92 }
const BOTTLE_H = 560
const S = BOTTLE_H / BOTTLE.h

const DETAILS = [
  ['Anhänger', 'zu jeder Flasche, ohne Aufpreis'],
  ['Widmung', 'bis 80 Zeichen, von Hand geschrieben'],
  ['Versand', 'in der Holzkiste, ab zwei Flaschen'],
] as const

export function StoreGeschenk() {
  return (
    <section className="bg-background text-foreground relative overflow-hidden px-6 py-16 sm:py-28 lg:px-16 lg:py-36">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-20 lg:grid-cols-[5fr_7fr] lg:gap-16">
        {/* Die Flasche als Hero, der Anhänger hängt am Hals */}
        <div className="relative mx-auto" style={{ width: BOTTLE.w * S, height: BOTTLE_H }}>
          {/* Heller Schein hinter der Flasche, sonst verschwindet die dunkle Flasche im Dark Mode */}
          <span
            aria-hidden="true"
            className="absolute -inset-x-24 inset-y-0"
            style={{ background: 'radial-gradient(closest-side, color-mix(in oklch, var(--foreground) 8%, transparent), transparent)' }}
          />
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="/wine-default.png"
              alt="Flasche Zweigelt 2022"
              className="absolute max-w-none"
              style={{ width: 1024 * S, left: -BOTTLE.x * S, top: -BOTTLE.y * S }}
            />
          </div>
          <HangTag
            style={{ left: (BOTTLE.knotX - BOTTLE.x) * S, top: (BOTTLE.knotY - BOTTLE.y) * S }}
            neckWidth={BOTTLE.neck * S}
            rotate={-11}
            cordLength={50}
            sign="Simon"
          >
            Für Anna – auf viele gemeinsame Abende!
          </HangTag>
        </div>

        <div>
          <BlurFade delay={100} direction="up">
            <span className="text-accent-readable mb-5 block text-[10px] font-bold tracking-[0.4em] uppercase">
              Zum Verschenken
            </span>
          </BlurFade>
          <BlurFade delay={200} direction="up">
            <h2 className="font-display text-4xl leading-tight font-light tracking-tight text-balance sm:text-6xl">
              Ein Wein, <span className="italic">der etwas zu sagen hat.</span>
            </h2>
          </BlurFade>
          <BlurFade delay={300} direction="up">
            <p className="text-muted-foreground mt-6 max-w-lg text-lg leading-relaxed font-light">
              Auf Wunsch hängt Simon jeder Flasche einen Anhänger aus Kraftkarton um und schreibt eure Widmung von Hand
              darauf, im Keller in Sooß, bevor das Paket losgeht.
            </p>
          </BlurFade>

          <BlurFade delay={400} direction="up">
            <dl className="border-border mt-12 max-w-lg border-t">
              {DETAILS.map(([label, value]) => (
                <div key={label} className="border-border flex items-baseline justify-between gap-6 border-b py-4">
                  <dt className="text-muted-foreground text-[10px] font-bold tracking-[0.3em] uppercase">{label}</dt>
                  <dd className="text-right text-sm font-light">{value}</dd>
                </div>
              ))}
            </dl>
          </BlurFade>

          <div className="mt-14 flex flex-wrap items-center gap-x-16 gap-y-16">
            <BlurFade delay={500} direction="up">
              <a
                href="/geschenk"
                className="group focus-visible:ring-ring focus-visible:ring-offset-background inline-flex min-h-11 items-center gap-5 text-sm font-bold tracking-[0.25em] uppercase focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
              >
                Mit Widmung bestellen
                <span
                  aria-hidden="true"
                  className="bg-foreground/70 group-hover:bg-foreground h-px w-12 transition-all duration-500 group-hover:w-20"
                />
              </a>
            </BlurFade>

            {/* pt: Platz für die losen Schnurenden über dem Anhänger */}
            <div className="flex items-center gap-6 pt-14">
              <span className="text-muted-foreground font-display max-w-28 text-lg leading-snug italic">
                Oder lieber ein Erlebnis?
              </span>
              <HangTag variant="loose" rotate={4} sign="Simon">
                Gutschein für eine Kellerführung zu zweit
              </HangTag>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
