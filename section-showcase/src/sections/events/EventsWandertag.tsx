import { Barrel, MapPin, Mountain, Sandwich } from 'lucide-react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { PolaroidFrame } from '@components/polaroid-frame/polaroid-frame'
import { ProcessSteps, type ProcessStep } from '@components/process-steps/process-steps'

/**
 * Der Wandertag — die Riedenwanderung als Weg, den man nachgehen kann. Der
 * gepunktete Pfad der ProcessSteps verbindet die Stationen vom Hoftor bis in
 * den Keller, darunter liegen Polaroids von der Strecke wie aus dem Fotoalbum.
 */

const ICON = { size: 30, strokeWidth: 1.4 } as const

const STATIONS: ProcessStep[] = [
  { icon: <MapPin {...ICON} />, label: 'Treffpunkt am Hoftor' },
  { icon: <Mountain {...ICON} />, label: 'Durch die Ried hinauf' },
  { icon: <Sandwich {...ICON} />, label: 'Jause am Marterl' },
  { icon: <Barrel {...ICON} />, label: 'Verkostung im Keller' },
]

const PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=700&q=80',
    alt: 'Weite Rebfläche unter hellem Morgenhimmel',
    caption: 'Los geht’s in den Weingärten',
    rotate: -2.5,
    tape: true,
  },
  {
    src: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=700&q=80',
    alt: 'Reife blaue Trauben am Stock im Gegenlicht',
    caption: 'Die Trauben hängen schon schwer',
    rotate: 1.5,
    tape: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=700&q=80',
    alt: 'Glas Rotwein auf einem Geländer vor Rebzeilen und einem See',
    caption: 'Oben: ein Glas mit Aussicht',
    rotate: -1,
    tape: true,
  },
]

export function EventsWandertag() {
  return (
    <section className="bg-background text-foreground relative overflow-hidden px-6 py-16 sm:py-28 lg:px-16 lg:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <BlurFade delay={100} direction="up">
            <span className="text-accent-readable mb-5 block text-[10px] font-bold tracking-[0.4em] uppercase">
              Riedenwanderung · So., 27. September · 10 Uhr
            </span>
          </BlurFade>
          <BlurFade delay={200} direction="up">
            <h2 className="font-display text-4xl leading-tight font-light tracking-tight sm:text-5xl">
              Von der Ried <span className="italic">bis ins Glas.</span>
            </h2>
          </BlurFade>
          <BlurFade delay={300} direction="up">
            <p className="text-muted-foreground mt-6 text-lg leading-relaxed font-light">
              Drei Stunden zu Fuß durch unsere Lagen über Sooß. Unterwegs erzählt Simon, warum derselbe Veltliner
              oben anders schmeckt als unten, und am Ende probieren wir genau das im Keller nach.
            </p>
          </BlurFade>
        </div>

        <ProcessSteps variant="trail" steps={STATIONS} className="mt-20" />

        <div className="mt-24 flex flex-wrap items-start justify-center gap-x-14 gap-y-16 sm:justify-between">
          {PHOTOS.map(p => (
            <PolaroidFrame key={p.src} src={p.src} alt={p.alt} caption={p.caption} rotate={p.rotate} tape={p.tape} />
          ))}
        </div>

        <BlurFade delay={200} direction="up">
          <a
            href="/termine"
            className="group focus-visible:ring-ring focus-visible:ring-offset-background mt-20 inline-flex min-h-11 items-center gap-5 text-sm font-bold tracking-[0.25em] uppercase focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
          >
            Mitwandern
            <span
              aria-hidden="true"
              className="bg-foreground/70 group-hover:bg-foreground h-px w-12 transition-all duration-500 group-hover:w-20"
            />
          </a>
        </BlurFade>
      </div>
    </section>
  )
}
