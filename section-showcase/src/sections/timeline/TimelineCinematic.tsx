import { BlurFade } from '@components/blur-fade/blur-fade'
import { Particles } from '@components/particles/particles'
import { RevealImage } from '@components/reveal-image/reveal-image'
import { ShinyText } from '@components/shiny-text/shiny-text'

/**
 * Cinematic Atmosphere — alternierendes Filmstreifen-Layout (Kontrast zu
 * TimelineV5s horizontalen Kellerbändern): Bild und Jahr wechseln die
 * Seite, kleine Sprocket-Ticks am Rand zitieren echten Filmstreifen.
 *
 * Partikel bewusst dünn (25, zusätzlich gedimmt) — das dichte Feld gehört
 * Hero, CTA und Footer, sonst addieren sich die Sections zu Rauschen.
 */

const MOMENTS = [
  {
    year: '1958',
    title: 'Der erste Nebel',
    text: 'Josef Buchart pflanzt die ersten Reben an einem Hang, der noch keinen Namen hatte.',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1000&q=80',
    alt: 'Junge Rebzeilen im Morgennebel',
  },
  {
    year: '1981',
    title: 'Die Terrasse',
    text: 'Der erste Tisch im Freien — Gäste bleiben zum ersten Mal länger als für ein Glas.',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1000&q=80',
    alt: 'Weinberg im Gegenlicht der Abendsonne',
  },
  {
    year: '2009',
    title: 'Das Licht ändert sich',
    text: 'Neue Rebsorten, gleiche Geduld. Der Wein wird heller, die Abende länger.',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=1000&q=80',
    alt: 'Weinglas im letzten Licht des Tages',
  },
  {
    year: 'Heute',
    title: 'Ein fortlaufendes Bild',
    text: 'Kein Schlusspunkt — nur die nächste Einstellung, Jahr für Jahr.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1000&q=80',
    alt: 'Blick über die Weinberge in der Dämmerung',
  },
]

export function TimelineCinematic() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 px-6 py-16 sm:py-28 lg:px-16 lg:py-36">
      <Particles
        particleColors={['#fff', 'var(--accent-lifted)']}
        particleCount={25}
        speed={0.06}
        className="pointer-events-none absolute inset-0 z-0 opacity-60"
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mx-auto max-w-xl text-center">
          <BlurFade delay={100} direction="down">
            <span className="mb-5 inline-block text-[10px] font-bold tracking-[0.4em] text-accent-lifted uppercase">
              1958 — Heute
            </span>
          </BlurFade>
          <BlurFade delay={220} direction="up">
            <h2 className="font-display text-4xl leading-tight font-medium tracking-tight text-white sm:text-5xl">
              Eine fortlaufende <ShinyText duration={9} shineColor="color-mix(in oklch, var(--accent) 65%, white)">Aufnahme.</ShinyText>
            </h2>
          </BlurFade>
        </div>

        <ol className="mt-20 flex flex-col gap-16">
          {MOMENTS.map((moment, i) => {
            const imageLeft = i % 2 === 0
            return (
              <li key={moment.year}>
                <BlurFade delay={300 + i * 130} direction="up">
                  <article className="group grid grid-cols-1 items-center gap-8 sm:grid-cols-2 sm:gap-12">
                    {/* Text kommt im DOM immer vor dem Bild (Lesereihenfolge für
                        Screenreader), unabhängig von der visuellen Seite —
                        dieselbe Konvention wie TimelineV4. Nur die Platzierung
                        wechselt über col-start. */}
                    <div className={imageLeft ? 'sm:col-start-2' : 'sm:col-start-1'}>
                      <span className="font-display text-5xl leading-none font-light tracking-tighter text-accent-lifted italic">
                        {moment.year}
                      </span>
                      <h3 className="font-display mt-4 text-2xl font-medium tracking-tight text-white">
                        {moment.title}
                      </h3>
                      <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
                        {moment.text}
                      </p>
                    </div>

                    {/* sm:row-start-1 ist im imageLeft-Zweig nötig: CSS Grids
                        sparse Auto-Placement füllt eine Spalte, die der Cursor
                        schon passiert hat, nicht rückwirkend auf — ohne die
                        Zeile explizit zu setzen, rutscht das Bild in Zeile 2. */}
                    <div className={`relative ${imageLeft ? 'sm:col-start-1 sm:row-start-1' : 'sm:col-start-2'}`}>
                      {/* Sprocket ticks — quotes a real film strip's edge */}
                      <div aria-hidden="true" className="absolute -top-3 right-4 left-4 flex justify-between opacity-40">
                        {Array.from({ length: 6 }).map((_, tick) => (
                          <span key={tick} className="h-1.5 w-1.5 rounded-[1px] bg-white/60" />
                        ))}
                      </div>
                      <RevealImage
                        src={moment.image}
                        alt={moment.alt}
                        direction={imageLeft ? 'left' : 'right'}
                        duration={1300}
                        className="aspect-4/3 w-full"
                        imgClassName="opacity-70 saturate-[1.1] grayscale-[0.4] transition-all! duration-700! group-hover:opacity-90 group-hover:grayscale-0"
                      />
                    </div>
                  </article>
                </BlurFade>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
