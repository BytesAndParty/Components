import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Gastgeber — die Story-Section der Familie: Weingut, Verkostung und Gästehaus
 * als drei exakt gleich große, mittig gesetzte Blöcke. Keiner ist Hero, keiner
 * ist Beiwerk — Gleichrangigkeit ist hier das Layoutprinzip. Handgezeichnete
 * Stempel-Glyphen statt Piktogramme, darunter die Auszeichnungen als ruhige
 * Monochrom-Reihe. Abgrenzung: kein Treppen-Manifest wie FeaturesV7, keine
 * versetzten Randnotizen, keine Asymmetrie.
 */

/** Einheitliche Bildstimmung — alle Motive der Familie kommen aus derselben Welt. */
const WARM = 'sepia-[.18] saturate-90 contrast-[1.02]'

/**
 * Handgezeichneter Kreis als Pfad. Bewusst nicht exakt rund (die beiden
 * Kontrollpunkt-Höhen unterscheiden sich), damit die Traube gestempelt wirkt
 * statt vektorsauber.
 */
function handCircle(cx: number, cy: number, r: number): string {
  return `M${cx - r} ${cy}c0 ${(-r * 1.42).toFixed(2)} ${(r * 2).toFixed(2)} ${(-r * 1.3).toFixed(2)} ${(r * 2).toFixed(2)} 0c0 ${(r * 1.34).toFixed(2)} ${(-r * 2).toFixed(2)} ${(r * 1.44).toFixed(2)} ${(-r * 2).toFixed(2)} 0Z`
}

const BEEREN: Array<[number, number, number]> = [
  [10, 9.4, 2.1],
  [14.2, 9.2, 2.02],
  [7.9, 12.8, 2.04],
  [12.1, 12.6, 2.14],
  [16.2, 12.9, 1.98],
  [10, 16.1, 2.08],
  [14.1, 16.2, 2.02],
  [12.1, 19.3, 1.96],
]

interface StampProps {
  className?: string
}

/** Stempel-Traube für „Weingut“. */
function GrapeStamp({ className }: StampProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.05"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="rotate(-2 12 12)">
        <path d="M12.5 2.6c-.35 1.7-.55 3-.6 4.1" />
        <path d="M12.7 4.1c1.9-1.1 3.8-.7 4.3.6-1.15 1.2-2.9 1.35-4.2.5" />
        {BEEREN.map(([cx, cy, r]) => (
          <path key={`${cx}-${cy}`} d={handCircle(cx, cy, r)} />
        ))}
      </g>
    </svg>
  )
}

/** Stempel-Glas für „Verkostung“. */
function GlassStamp({ className }: StampProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.05"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="rotate(-2.5 12 12)">
        <path d="M7.9 3.5c2.8-.35 5.6-.3 8.3.1" />
        <path d="M8 3.6c-.35 4.7 1.1 8 3.9 8.3 2.9-.25 4.45-3.6 4.3-8.3" />
        <path d="M11.9 11.9c.12 2.2.12 4.4 0 6.6" />
        <path d="M8.4 18.9c2.5-.55 5.1-.5 7.4-.05" />
      </g>
    </svg>
  )
}

/** Stempel-Haus für „Gästehaus“. */
function HouseStamp({ className }: StampProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.05"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="rotate(1.5 12 12)">
        <path d="M3 11.4C6.3 8.2 9.2 5.6 12.1 3.1c3 2.6 6 5.3 8.9 8.2" />
        <path d="M5.1 10.3c-.25 3.5-.2 6.9.05 10.2 4.6.35 9.3.3 13.8-.05.2-3.4.2-6.8 0-10.2" />
        <path d="M10.1 20.5c-.15-2 -.1-3.9.05-5.6 1.3-.25 2.6-.2 3.85.05.15 1.8.15 3.7 0 5.6" />
      </g>
    </svg>
  )
}

interface Bereich {
  kicker: string
  title: string
  text: string
  linkLabel: string
  href: string
  image: string
  alt: string
  Stamp: (props: StampProps) => React.ReactElement
}

const BEREICHE: Bereich[] = [
  {
    kicker: 'Sieben Rieden am Hang',
    title: 'Weingut',
    text: 'Urgestein, Steillage, Handlese. Sieben Rieden zwischen 280 und 450 Metern — mehr Fläche haben wir nie gewollt. Was der Berg hergibt, geht in achtzehn Fässer, nicht in neunzehn.',
    linkLabel: 'Die Rieden',
    href: '/weingut',
    image: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1200&q=80',
    alt: 'Rebzeilen der Ried Loibenberg im Morgennebel',
    Stamp: GrapeStamp,
  },
  {
    kicker: 'Freitag & Samstag',
    title: 'Verkostung',
    text: 'Im gewölbten Keller, an einem Tisch aus Eiche. Sechs Weine, zwei Stunden, dazu Brot und Speck aus dem Ort. Wir sitzen mit — anders hätte das Ganze wenig Sinn.',
    linkLabel: 'Termin buchen',
    href: '/verkostung',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80',
    alt: 'Gedeckte Verkostungstafel bei Kerzenschein im Gewölbekeller',
    Stamp: GlassStamp,
  },
  {
    kicker: 'Fünf Zimmer über dem Presshaus',
    title: 'Gästehaus',
    text: 'Fünf Zimmer mit Fenstern nach Süden, dicke Mauern, kein Fernseher. Frühstück mit Marille aus dem eigenen Garten. Abreise, wann immer Sie mögen.',
    linkLabel: 'Zimmer ansehen',
    href: '/gaestehaus',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&q=80',
    alt: 'Der historische Innenhof des Weinguts mit Presshaus und Gästetrakt',
    Stamp: HouseStamp,
  },
]

const AUSZEICHNUNGEN = [
  { name: 'Falstaff', detail: '94 Punkte · Loibenberg 2021' },
  { name: 'Gault&Millau', detail: 'Drei Trauben' },
  { name: 'Vinaria', detail: 'Weißwein-Trophy' },
]

export function FeaturesGastgeber() {
  return (
    <section className="relative w-full overflow-hidden bg-[#f5f1e2] px-6 py-20 sm:py-28 lg:px-16 lg:py-36">
      <div className="mx-auto max-w-6xl">
        {/* Zentrierter Sektionskopf — dieselbe Achse wie im Hero. */}
        <div className="mx-auto max-w-2xl text-center">
          <BlurFade delay={80} direction="up">
            <p className="font-display text-[clamp(0.9rem,1.5vw,1.15rem)] font-medium tracking-[0.19em] text-[#c03a2c] uppercase">
              Buchart58 in Spitz an der Donau
            </p>
          </BlurFade>
          <BlurFade delay={200} direction="up">
            <h2 className="mt-5 text-[clamp(1.75rem,4.6vw,3.1rem)] leading-[1.08] font-semibold tracking-[0.005em] text-[#212529] uppercase">
              Drei Häuser, ein Hof
            </h2>
          </BlurFade>
          <BlurFade delay={320} direction="up">
            <p className="mx-auto mt-7 max-w-xl text-[1.0625rem] leading-[1.8] text-[#4a4a4a]">
              Weingut, Verkostung und Gästehaus stehen bei uns nebeneinander, nicht
              übereinander. Jeder Bereich trägt sich selbst — und keiner funktioniert
              ohne die beiden anderen.
            </p>
          </BlurFade>
        </div>

        {/* Drei gleich große Spalten, gleiches Bildformat, gleiche Textlänge —
            die Gleichrangigkeit muss man sehen, nicht nur lesen. */}
        <div className="mt-20 grid grid-cols-1 gap-14 sm:mt-24 md:grid-cols-3 md:gap-10 lg:gap-14">
          {BEREICHE.map((b, i) => (
            <BlurFade key={b.title} delay={480 + i * 140} direction="up">
              <article className="flex h-full flex-col items-center text-center">
                <RevealImage
                  src={b.image}
                  alt={b.alt}
                  direction="up"
                  duration={1400}
                  delay={i * 120}
                  className="aspect-4/5 w-full"
                  imgClassName={WARM}
                />

                <b.Stamp className="mt-9 h-10 w-10 text-[#212529]/70" />

                <p className="font-display mt-6 text-[0.9rem] font-medium tracking-[0.16em] text-[#c03a2c] uppercase">
                  {b.kicker}
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-[0.06em] text-[#212529] uppercase">
                  {b.title}
                </h3>
                <p className="mt-5 text-[1rem] leading-[1.8] text-[#4a4a4a]">{b.text}</p>

                <a
                  href={b.href}
                  className="group mt-auto inline-flex min-h-11 items-center gap-3 pt-8 text-[10px] font-semibold tracking-[0.24em] text-[#212529] uppercase transition-colors duration-300 hover:text-[#c03a2c] focus-visible:ring-2 focus-visible:ring-[#c03a2c]/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f5f1e2] focus-visible:outline-none"
                >
                  {b.linkLabel}
                  <span
                    aria-hidden="true"
                    className="h-px w-8 bg-current transition-all duration-500 group-hover:w-14"
                  />
                </a>
              </article>
            </BlurFade>
          ))}
        </div>

        {/* Auszeichnungen: reine Wortmarken in Grau, symmetrisch verteilt.
            Keine Rosetten, keine Farbflächen — die Reihe soll ruhig bleiben. */}
        <BlurFade delay={1000} className="mt-24 lg:mt-32">
          <div className="border-t border-[#ddd4bd] pt-10">
            <p className="text-center text-[9px] font-semibold tracking-[0.34em] text-[#626262] uppercase">
              Ausgezeichnet
            </p>
            <ul className="mt-9 grid grid-cols-1 gap-9 sm:grid-cols-3 sm:gap-6">
              {AUSZEICHNUNGEN.map((a) => (
                <li key={a.name} className="flex flex-col items-center gap-2 text-center">
                  <span className="font-display text-2xl font-medium tracking-[0.02em] text-[#626262]">
                    {a.name}
                  </span>
                  <span className="text-[9px] font-semibold tracking-[0.22em] text-[#626262]/70 uppercase">
                    {a.detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
