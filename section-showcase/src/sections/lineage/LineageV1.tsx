import { useSearchParams } from 'react-router'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { cn } from '@components/lib/utils'
import { LineageTree } from './lineage-tree'

/**
 * Espalier — der Rebsorten-Stammbaum als chronologische Zoom-Zeitachse.
 *
 * Eine vertikale Zeitachse (oben uralt → unten jung). Der Überblick fasst die
 * ganze Chronik in die Bühne; ein Klick zoomt nah an die Rebe heran, ein Klick
 * auf die nächste fährt sanft (Pan + Zoom) hinüber. Kopf & Steuerung liegen als
 * Overlay über der Vollbild-Bühne — so ist das Detail-Panel immer im Viewport.
 * Auswahl & Ansicht sind per URL deep-linkbar (?rebe=… / ?ansicht=liste).
 */

export function LineageV1() {
  // Im Fokus (eine Rebe herangezoomt) blendet der große Kopf aus, damit die
  // Serif-Headline nicht mit den herangezoomten Knoten kollidiert.
  const [searchParams] = useSearchParams()
  const focused = !!searchParams.get('rebe')

  return (
    <section className="relative w-full overflow-hidden bg-background">
      {/* Desktop-Kopf — Overlay über der Zoom-Bühne, klick-durchlässig */}
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 z-30 hidden transition-opacity duration-500 ease-out lg:block',
          focused ? 'opacity-0' : 'opacity-100',
        )}
      >
        <div className="mx-auto max-w-7xl px-8 pt-8">
          <header className="max-w-md">
            <BlurFade delay={100}>
              <span className="text-[11px] font-bold tracking-[0.4em] text-muted-foreground uppercase">
                Sooss · Thermenregion · Ampelographie
              </span>
            </BlurFade>
            <BlurFade delay={250}>
              <h2 className="font-display mt-3 text-3xl leading-[0.95] font-light tracking-tight text-foreground xl:text-5xl">
                Von einer Rebe <span className="italic">stammen viele.</span>
              </h2>
            </BlurFade>
          </header>
        </div>
      </div>

      {/* Mobile-Kopf — normaler Fluss, vor der Liste */}
      <div className="px-6 pt-16 pb-2 lg:hidden">
        <span className="text-[11px] font-bold tracking-[0.4em] text-muted-foreground uppercase">
          Sooss · Thermenregion
        </span>
        <h2 className="font-display mt-4 text-4xl leading-[0.95] font-light tracking-tight text-foreground">
          Von einer Rebe <span className="italic">stammen viele.</span>
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Von oben nach unten durch die Zeit: vom uralten Traminer bis zu den PIWI-Neuzüchtungen —
          daneben die Uhudler-Direktträger als eigener, wilder Stamm.
        </p>
      </div>

      <LineageTree />

      {/* Kolophon — unter der Vollbild-Bühne */}
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-8 py-10">
        <span aria-hidden="true" className="h-px w-16 bg-border" />
        <p className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase">
          Verwandtschaften ampelographisch belegt · Weine, Lagen & Bilder illustrativ
        </p>
      </div>
    </section>
  )
}
