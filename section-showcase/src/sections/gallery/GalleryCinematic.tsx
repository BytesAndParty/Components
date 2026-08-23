import { BlurFade } from '@components/blur-fade/blur-fade'
import { Particles } from '@components/particles/particles'
import { RevealImage } from '@components/reveal-image/reveal-image'
import { ShinyText } from '@components/shiny-text/shiny-text'

/**
 * Cinematic Atmosphere — drei atmosphärische Weitwinkel-Stills als Reel,
 * dieselbe Fotosprache wie HeroV3 (gesättigt statt entsättigt, kein
 * Kerzenlicht). Ghost-Word „Atmosphäre“ hinter dem Reel, Captions als
 * Lower-Third wie im Kino-Abspann.
 *
 * Partikel bewusst dünn (25 statt 80, zusätzlich gedimmt): Hero, CTA und
 * Footer tragen das dichte Feld: steht diese Section mit ihnen auf einer
 * Seite, addieren sich sonst mehrere volle Felder zu Rauschen.
 */

const STILLS = [
  {
    label: 'Erste Einstellung',
    caption: 'Der Nebel steigt über den Terrassen auf.',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80',
    alt: 'Weinberg im Morgennebel',
  },
  {
    label: 'Zweite Einstellung',
    caption: 'Licht fällt schräg durch die Rebzeilen.',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1200&q=80',
    alt: 'Reben im Gegenlicht der Abendsonne',
  },
  {
    label: 'Dritte Einstellung',
    caption: 'Ein Glas, ein Moment, kein Wort.',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=1200&q=80',
    alt: 'Weinglas im letzten Licht des Tages',
  },
]

export function GalleryCinematic() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 px-6 py-16 sm:py-28 lg:px-16 lg:py-36">
      <Particles
        particleColors={['#fff', 'var(--accent-lifted)']}
        particleCount={25}
        speed={0.08}
        className="pointer-events-none absolute inset-0 z-0 opacity-60"
      />

      {/* Ghost word behind the reel */}
      <span
        aria-hidden="true"
        className="font-display pointer-events-none absolute top-8 left-1/2 z-0 hidden -translate-x-1/2 text-[clamp(6rem,14vw,12rem)] leading-none font-light tracking-tighter text-white/[0.04] select-none lg:block"
      >
        Atmosphäre
      </span>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl text-center">
          <BlurFade delay={100}>
            <span className="mb-5 inline-block text-[10px] font-bold tracking-[0.4em] text-accent-lifted uppercase">
              Ein Blick in unsere Welt
            </span>
          </BlurFade>
          <BlurFade delay={220}>
            <h2 className="font-display text-4xl leading-tight font-medium tracking-tight text-white sm:text-5xl">
              Drei <ShinyText duration={9} shineColor="color-mix(in oklch, var(--accent) 65%, white)">Einstellungen.</ShinyText>
            </h2>
          </BlurFade>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STILLS.map((still, i) => (
            <BlurFade key={still.label} delay={350 + i * 150} direction="up">
              <figure className="group relative overflow-hidden">
                <RevealImage
                  src={still.image}
                  alt={still.alt}
                  direction="up"
                  delay={i * 150}
                  duration={1300}
                  className="aspect-3/4 w-full"
                  /* transition-all! ist nötig, nicht Kosmetik: RevealImage setzt
                     inline `transition: transform …`, Tailwind v4 kompiliert
                     scale-105 aber zur eigenständigen `scale`-Property — ohne
                     `all` wäre der Hover-Zoom ein harter Sprung. */
                  imgClassName="opacity-80 saturate-[1.1] transition-all! duration-700! group-hover:scale-105!"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-linear-to-t from-zinc-950/85 via-transparent to-transparent"
                />
                <figcaption className="absolute inset-x-4 bottom-4 flex flex-col gap-1">
                  <span className="text-[9px] font-bold tracking-[0.3em] text-accent-lifted uppercase">
                    {still.label}
                  </span>
                  <span className="text-sm leading-snug font-light text-zinc-300">
                    {still.caption}
                  </span>
                </figcaption>
              </figure>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
