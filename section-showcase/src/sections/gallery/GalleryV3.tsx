import { BlurFade } from '@components/blur-fade/blur-fade'

/**
 * Editorial Plates — magazine-style index of photographic plates. Each
 * image carries a Roman-numeral plate-number, a small italic caption and
 * a metadata column (location · season). Cream ground, generous gutters,
 * deliberate asymmetric column heights.
 *
 * NOTE: Uses the brand cream ground (#fdfcf9) intentionally; this is the
 * "artisanal minimal" treatment from CLAUDE.md §5.
 */

interface Plate {
  numeral: string
  src: string
  alt: string
  caption: string
  location: string
  season: string
  /** Tailwind classes for column-span + offset (desktop only). */
  cell: string
  /** Aspect ratio of the printed plate. */
  aspect: string
}

const plates: Plate[] = [
  {
    numeral: 'I',
    src: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80',
    alt: 'Frühnebel über dem Hang im Herbstlicht',
    caption: 'Frühnebel über der Riedenfläche.',
    location: 'Ried Schiefer, Dürnstein',
    season: 'September · MMXXIV',
    cell: 'lg:col-span-7 lg:col-start-1 lg:row-start-1',
    aspect: 'aspect-4/3',
  },
  {
    numeral: 'II',
    src: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80',
    alt: 'Eichenfässer im historischen Keller',
    caption: 'Stillstand. Drittbelegte Tonneaux.',
    location: 'Tonnenkeller, Untergeschoss',
    season: 'Februar · MMXXV',
    cell: 'lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:mt-24',
    aspect: 'aspect-3/4',
  },
  {
    numeral: 'III',
    src: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1200&q=80',
    alt: 'Detailaufnahme reifer Beeren am Stock',
    caption: 'Beeren im Schiefer­licht.',
    location: 'Rebzeile 12, Süd­hang',
    season: 'Oktober · MMXXIV',
    cell: 'lg:col-span-5 lg:col-start-2 lg:row-start-2 lg:-mt-12',
    aspect: 'aspect-3/4',
  },
  {
    numeral: 'IV',
    src: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=1200&q=80',
    alt: 'Geöffnete Flasche im Streiflicht',
    caption: 'Die erste Verkostung.',
    location: 'Probierraum, Hofzimmer',
    season: 'März · MMXXVI',
    cell: 'lg:col-span-6 lg:col-start-7 lg:row-start-2 lg:mt-12',
    aspect: 'aspect-4/3',
  },
]

export function GalleryV3() {
  return (
    <section className="bg-[#fdfcf9] px-6 py-32 lg:py-40">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-24 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <div className="flex flex-col gap-6">
            <BlurFade delay={100}>
              <span className="text-[11px] font-bold tracking-[0.4em] text-zinc-400 uppercase">
                Tafelband · I–IV
              </span>
            </BlurFade>
            <BlurFade delay={200}>
              <h2 className="font-display text-5xl leading-[0.95] font-light tracking-tight text-zinc-900 lg:text-7xl">
                Vier <span className="italic">Tafeln</span><br />
                aus dem Jahres­buch.
              </h2>
            </BlurFade>
          </div>
          <div className="flex items-end">
            <BlurFade delay={300}>
              <p className="max-w-md text-base leading-relaxed font-light text-zinc-500">
                Auszüge aus unserem Hofbuch. Vier Tafeln, vier Augenblicke
                zwischen Lese und Abfüllung — jeder mit Ort, Datum und
                einer Notiz des Kellermeisters.
              </p>
            </BlurFade>
          </div>
        </header>

        {/* Plate grid */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-24">
          {plates.map((plate, i) => (
            <BlurFade
              key={plate.numeral}
              delay={400 + i * 150}
              direction="up"
              className={plate.cell}
            >
              <figure className="flex flex-col gap-6">
                {/* Plate number header */}
                <div className="flex items-baseline justify-between border-b border-zinc-200 pb-3">
                  <span className="font-display text-2xl leading-none font-light text-zinc-400 italic">
                    Tafel {plate.numeral}
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
                    {plate.season}
                  </span>
                </div>

                {/* Image plate */}
                <div className={`overflow-hidden bg-zinc-100 ${plate.aspect}`}>
                  <img
                    src={plate.src}
                    alt={plate.alt}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale-15 transition-all duration-1200 hover:scale-[1.02] hover:grayscale-0"
                  />
                </div>

                {/* Caption + meta */}
                <figcaption className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <p className="font-display text-xl leading-snug font-light text-zinc-800 italic">
                    {plate.caption}
                  </p>
                  <span className="text-[10px] font-medium tracking-[0.2em] text-zinc-400 uppercase sm:text-right">
                    {plate.location}
                  </span>
                </figcaption>
              </figure>
            </BlurFade>
          ))}
        </div>

        {/* Closing colophon */}
        <BlurFade delay={1100} className="mt-32 flex flex-col items-center gap-4 border-t border-zinc-200 pt-12 text-center">
          <span aria-hidden="true" className="h-px w-10 bg-zinc-300" />
          <p className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
            Fotografien · Hofarchiv Lacombe
          </p>
        </BlurFade>
      </div>
    </section>
  )
}
