import { BlurFade } from '@components/blur-fade/blur-fade'
import { RevealImage } from '@components/reveal-image/reveal-image'

/**
 * Gastgeber — warmes Creme (#f5f1e2), ein einziger Akzent in Ziegelrot, und
 * Symmetrie als Prinzip: mittige Wortmarke, ausbalancierte Kopfzeile, zentrierte
 * Achse für Kicker und Versal-Headline. Weingut, Verkostung und Gästehaus stehen
 * gleichrangig in der Navigation. Die Buttons sind handgezeichnete Stempel.
 * Abgrenzung: kein asymmetrischer Fokus wie HeroV4, keine überlappenden Tafeln
 * und Randleisten wie HeroV6, keine Rundbögen und Siegel wie HeroV7.
 */

/** Einheitliche Bildstimmung — alle Motive der Familie kommen aus derselben Welt. */
const WARM = 'sepia-[.18] saturate-90 contrast-[1.02]'

/**
 * Handgezeichneter Stempelrahmen. Liegt absolut hinter dem Label und wird über
 * `preserveAspectRatio="none"` auf die Buttonbreite gezogen — `vectorEffect`
 * hält die Strichstärke dabei konstant, damit die Linie nicht ausfranst.
 */
function StampFrame() {
  return (
    <svg
      viewBox="0 0 240 64"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60 transition-opacity duration-300 group-hover:opacity-100"
    >
      <path
        d="M6.5 7.5C62 3.8 152 4.6 233 7.2c2.8 16.4 2.4 36.4.9 49.4C160 60 68 59.4 6.8 56.9 3.6 40.2 4.4 21.6 6.5 7.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/** Stempel-Glas für „Verkostung buchen“ — dünne, leicht schiefe Linie, kein Fill. */
function GlassStamp({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
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

/** Stempel-Kiste für „Ab Hof“ — Flaschenhälse über der handgezeichneten Steige. */
function CrateStamp({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="rotate(1.5 12 12)">
        <path d="M8.2 3.4c-.2 1.7-.2 3.3-.1 4.7" />
        <path d="M12 2.9c-.1 1.9-.1 3.7 0 5.2" />
        <path d="M15.8 3.6c.12 1.5.12 3 0 4.5" />
        <path d="M4.4 8.4c5.2-.45 10.4-.4 15.4.1.3 3.9.25 8-.05 11.9-5.2.4-10.6.35-15.6 0-.3-4-.2-8 .25-12Z" />
        <path d="M4.6 13.2c5.1-.35 10.2-.3 15 .05" />
      </g>
    </svg>
  )
}

/** Handgezeichnete Menü-Marke — drei ungerade Striche statt Standard-Burger. */
function MenuStamp({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 16"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    >
      <path d="M2.4 3.2c6.5-.55 13-.5 19.3-.05" />
      <path d="M2.2 8.1c6.6-.45 13.2-.4 19.6.05" />
      <path d="M2.6 13c6.3-.5 12.6-.4 18.9.15" />
    </svg>
  )
}

/** Die drei Geschäftsbereiche — gleichrangig, gleiche Fläche, gleiches Gewicht. */
const BEREICHE = [
  { label: 'Weingut', href: '/weingut' },
  { label: 'Verkostung', href: '/verkostung' },
  { label: 'Gästehaus', href: '/gaestehaus' },
]

const META = [
  { value: 'Sieben Rieden', label: 'Weingut' },
  { value: 'Fr & Sa, 14–19 Uhr', label: 'Verkostung' },
  { value: 'Fünf Zimmer', label: 'Gästehaus' },
]

export function HeroGastgeber() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#f5f1e2] px-6 py-9 lg:px-16 lg:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Kopfzeile: links Menü, mittig die Wortmarke, rechts die zwei Stempel.
            Auf Mobil kippt die Zeile in eine zentrierte Spalte — die Achse bleibt,
            nur die Reihenfolge wird vertikal. */}
        <BlurFade delay={80} direction="down">
          <header className="flex flex-col items-center gap-7 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-0">
            <button
              type="button"
              className="group inline-flex min-h-11 items-center gap-3 px-1 text-[#212529] transition-colors duration-300 hover:text-[#c03a2c] focus-visible:ring-2 focus-visible:ring-[#c03a2c]/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f5f1e2] focus-visible:outline-none sm:justify-self-start"
            >
              <MenuStamp className="h-3.5 w-5" />
              <span className="text-[10px] font-semibold tracking-[0.28em] uppercase">Menü</span>
            </button>

            <a
              href="/"
              className="flex min-h-11 flex-col items-center justify-center focus-visible:ring-2 focus-visible:ring-[#c03a2c]/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f5f1e2] focus-visible:outline-none"
            >
              <span className="font-display text-[clamp(1.9rem,4.4vw,2.6rem)] leading-none font-medium tracking-[0.005em] text-[#212529]">
                {/* Übergroße, rote Initiale — das einzige Mal, dass der Akzent groß wird. */}
                <span className="text-[1.32em] leading-none text-[#c03a2c]">B</span>uchart
                <span className="align-super text-[0.44em] tracking-[0.14em]">58</span>
              </span>
              <span className="mt-1.5 text-[8px] font-semibold tracking-[0.34em] text-[#626262] uppercase">
                Wachau · Österreich
              </span>
            </a>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-self-end">
              <a
                href="/verkostung"
                className="group relative inline-flex min-h-11 items-center gap-2.5 px-4 py-2 text-[#212529] transition-colors duration-300 hover:text-[#c03a2c] focus-visible:ring-2 focus-visible:ring-[#c03a2c]/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f5f1e2] focus-visible:outline-none"
              >
                <StampFrame />
                <GlassStamp className="h-5 w-5 shrink-0" />
                <span className="text-[9.5px] leading-tight font-semibold tracking-[0.16em] uppercase">
                  Verkostung
                  <br />
                  buchen
                </span>
              </a>
              <a
                href="/ab-hof"
                className="group relative inline-flex min-h-11 items-center gap-2.5 px-4 py-2 text-[#212529] transition-colors duration-300 hover:text-[#c03a2c] focus-visible:ring-2 focus-visible:ring-[#c03a2c]/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f5f1e2] focus-visible:outline-none"
              >
                <StampFrame />
                <CrateStamp className="h-5 w-5 shrink-0" />
                <span className="text-[9.5px] font-semibold tracking-[0.16em] uppercase">Ab Hof</span>
              </a>
            </div>
          </header>
        </BlurFade>

        {/* Die drei Bereiche gleichrangig: gleich breite Zellen, gleiche Typo. */}
        <BlurFade delay={220} direction="down" className="mt-9">
          <nav aria-label="Bereiche" className="grid grid-cols-3 border-y border-[#ddd4bd]">
            {BEREICHE.map((b) => (
              <a
                key={b.label}
                href={b.href}
                className="flex min-h-11 items-center justify-center py-3 text-[10px] font-semibold tracking-[0.24em] text-[#4a4a4a] uppercase transition-colors duration-300 hover:text-[#c03a2c] focus-visible:ring-2 focus-visible:ring-[#c03a2c]/60 focus-visible:ring-inset focus-visible:outline-none"
              >
                {b.label}
              </a>
            ))}
          </nav>
        </BlurFade>

        {/* Zentrierte Achse: roter Serif-Kicker über kräftiger Sans-Versal-Headline. */}
        <div className="mx-auto mt-16 max-w-3xl text-center lg:mt-24">
          <BlurFade delay={340} direction="up">
            <p className="font-display text-[clamp(0.95rem,1.7vw,1.3rem)] font-medium tracking-[0.19em] text-[#c03a2c] uppercase">
              Seit 1958 in Spitz an der Donau
            </p>
          </BlurFade>

          <BlurFade delay={460} direction="up">
            <h1 className="mt-6 text-[clamp(2.1rem,6.1vw,4.4rem)] leading-[1.04] font-semibold tracking-[0.005em] text-[#212529] uppercase">
              Zu Gast bei
              <br />
              Familie Buchart
            </h1>
          </BlurFade>

          <BlurFade delay={600} direction="up">
            <p className="mx-auto mt-8 max-w-xl text-[1.0625rem] leading-[1.8] text-[#4a4a4a]">
              Wir keltern, wir schenken aus, wir beherbergen — drei Häuser um einen Hof.
              Wer den Berg wirklich verstehen will, bleibt: auf ein Glas, auf einen Abend,
              auf eine Nacht.
            </p>
          </BlurFade>
        </div>

        {/* Ein sehr großes Motiv über die volle Breite — bewusst das einzige Bild
            des Heros. Der negative Rand bricht aus dem Section-Padding aus. */}
        <BlurFade delay={720} className="-mx-6 mt-14 lg:-mx-16 lg:mt-20">
          <RevealImage
            src="https://images.unsplash.com/photo-1543418219-44e30b057fea?w=2000&q=80"
            alt="Terrassierte Weingärten über der Donau im späten Nachmittagslicht"
            direction="up"
            duration={1600}
            className="aspect-4/3 w-full sm:aspect-16/9 lg:aspect-21/9"
            imgClassName={WARM}
          />
        </BlurFade>

        {/* Abschluss der Achse: die drei Bereiche noch einmal als gleichgewichtige Spalten. */}
        <BlurFade delay={900} className="mt-10">
          <dl className="grid grid-cols-1 divide-y divide-[#ddd4bd] border-t border-[#ddd4bd] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {META.map((m) => (
              <div key={m.label} className="flex flex-col items-center gap-1.5 px-4 py-7 text-center">
                <dt className="text-[9px] font-semibold tracking-[0.3em] text-[#626262] uppercase">{m.label}</dt>
                <dd className="font-display text-xl font-medium text-[#212529]">{m.value}</dd>
              </div>
            ))}
          </dl>
        </BlurFade>
      </div>
    </section>
  )
}
