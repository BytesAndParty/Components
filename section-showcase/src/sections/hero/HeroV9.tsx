import { BlurFade } from '@components/blur-fade/blur-fade'

/**
 * Full Bleed — Ableitung von V3 (Cinematic Atmosphere). Kunden-Feedback:
 * das großformatige Rebenfoto trägt die Sektion, die Vordergrundeffekte
 * (Particles, Shine-Sweep) waren zu viel. Hier bleibt nur ein einziges
 * Scrim für Lesbarkeit; Kicker, Headline und ein Link statt Button-Paar
 * sitzen als schmales Title-Card unten links, damit die Fläche zu über
 * 90 % Fotografie bleibt statt Textblock.
 */
export function HeroV9() {
  return (
    <section className="relative flex min-h-screen w-full items-end overflow-hidden bg-zinc-950">
      {/* Background Image — dasselbe Foto wie V3, ohne Sättigung/Effekt-Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1600&q=80"
          alt="Weinreben im Morgennebel"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/90 via-zinc-950/15 to-transparent" />
      </div>

      <div className="relative z-10 w-full px-6 pb-16 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          <BlurFade delay={100} direction="up">
            <span className="text-accent-lifted mb-6 inline-block text-[10px] font-bold tracking-[0.4em] uppercase">
              Ethereal Wine Experience
            </span>
          </BlurFade>

          {/* text-white ist bewusst theme-unabhängig — die Section ist immer
              dunkel, das Foto trägt sie in jedem Theme. */}
          <BlurFade delay={220} direction="up">
            <h1 className="font-display max-w-2xl text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.98] font-light tracking-tight text-white">
              The Soul
              <br />
              of the Grape.
            </h1>
          </BlurFade>

          <BlurFade delay={340} direction="up">
            <p className="mt-6 max-w-sm text-base leading-relaxed text-white/70">
              Eintauchen in eine Welt, in der jeder Schluck eine Geschichte erzählt.
            </p>
          </BlurFade>

          <BlurFade delay={460} direction="up" className="mt-9">
            <a
              href="/kollektion"
              className="group focus-visible:ring-offset-zinc-950 inline-flex min-h-11 items-center gap-4 rounded-xs text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:outline-none"
            >
              <span className="font-display text-xl leading-none font-light italic">Kollektion entdecken</span>
              <span
                aria-hidden="true"
                className="group-hover:bg-accent h-px w-10 bg-white/55 transition-all duration-500 group-hover:w-20"
              />
            </a>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
