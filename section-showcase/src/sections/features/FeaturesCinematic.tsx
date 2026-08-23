import { BlurFade } from '@components/blur-fade/blur-fade'
import { Particles } from '@components/particles/particles'
import { RevealImage } from '@components/reveal-image/reveal-image'
import { ShinyText } from '@components/shiny-text/shiny-text'

/**
 * Cinematic Atmosphere — eine lange Einstellung statt Triptychon. FeaturesV8
 * (Nocturne) stellt drei Kellerszenen nebeneinander; hier steht ein einziges
 * hohes Still, und die drei Gründe laufen rechts als nummerierte Hairline-
 * Liste — die Sektion liest sich als Schwenk, nicht als Schnittfolge.
 *
 * Partikel bewusst dünn (25, zusätzlich gedimmt) — das dichte Feld gehört
 * Hero, CTA und Footer, sonst addieren sich die Sections zu Rauschen.
 */

const REASONS = [
  {
    no: '01',
    title: 'Der Nebel',
    text: 'Zweimal am Tag zieht er die Hänge hoch und wieder ab. Was er dabei an Kühle liegen lässt, schmeckt man später als Spannung im Glas.',
  },
  {
    no: '02',
    title: 'Die Hanglage',
    text: 'Südost, dreihundert Meter, Kalk unter dünner Erde. Die Reben stehen im ersten Licht und sind aus der Mittagshitze längst heraus.',
  },
  {
    no: '03',
    title: 'Die Zeit',
    text: 'Wir lesen spät und füllen später. Kein Jahrgang verlässt das Haus, bevor er ruhig geworden ist — auch wenn das ein Jahr länger dauert.',
  },
]

export function FeaturesCinematic() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 px-6 py-16 sm:py-28 lg:px-16 lg:py-36">
      <Particles
        particleColors={['#fff', 'var(--accent-lifted)']}
        particleCount={25}
        speed={0.06}
        className="pointer-events-none absolute inset-0 z-0 opacity-60"
      />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Das Still — eine Einstellung, die stehen bleibt */}
        <BlurFade delay={100} direction="up">
          <figure className="group relative">
            <RevealImage
              src="https://images.unsplash.com/photo-1523362628745-0c100150b504?w=1000&q=80"
              alt="Rebzeilen am Hang, während der Nebel abzieht"
              direction="up"
              duration={1400}
              className="aspect-4/5 w-full"
              imgClassName="opacity-75 saturate-[1.15] transition-all! duration-700! group-hover:opacity-95"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-zinc-950/80 via-transparent to-transparent"
            />
            <figcaption className="absolute inset-x-5 bottom-5 flex flex-col gap-1">
              <span className="text-[9px] font-bold tracking-[0.3em] text-accent-lifted uppercase">
                Ried Sooßer Höhe · 06:40
              </span>
              <span className="text-sm leading-snug font-light text-zinc-300">
                Der Nebel steht noch in den Zeilen.
              </span>
            </figcaption>
          </figure>
        </BlurFade>

        {/* Drei Gründe als Hairline-Liste */}
        <div>
          <BlurFade delay={220} direction="down">
            <span className="mb-5 block text-[10px] font-bold tracking-[0.4em] text-accent-lifted uppercase">
              Drei Gründe
            </span>
          </BlurFade>
          <BlurFade delay={320} direction="up">
            <h2 className="font-display text-4xl leading-tight font-medium tracking-tight text-white sm:text-5xl">
              Warum es hier{' '}
              <ShinyText duration={9} shineColor="color-mix(in oklch, var(--accent) 65%, white)">
                anders
              </ShinyText>{' '}
              schmeckt.
            </h2>
          </BlurFade>
          <BlurFade delay={420} direction="up">
            <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-400">
              Kein Verfahren, kein Geheimnis — drei Bedingungen, die wir nicht
              gemacht haben und nur möglichst wenig stören.
            </p>
          </BlurFade>

          <ol className="mt-12 flex flex-col">
            {REASONS.map((reason, i) => (
              // BlurFade rendert ein div — es muss INNERHALB des li sitzen,
              // sonst steht ein Nicht-li-Kind direkt im ol.
              <li key={reason.no} className="group border-t border-white/10 last:border-b">
                <BlurFade delay={520 + i * 130} direction="up">
                  <div className="flex items-baseline gap-5 py-7">
                    <span className="font-display text-sm font-light text-accent-lifted italic tabular-nums">
                      {reason.no}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-medium tracking-tight text-white">
                        {reason.title}
                      </h3>
                      <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-400">
                        {reason.text}
                      </p>
                      {/* Die Hairline wächst im Hover — dieselbe Geste wie in
                          Nav und CTA der Linie. */}
                      <span
                        aria-hidden="true"
                        className="mt-4 block h-px w-8 bg-accent-lifted/50 transition-all duration-500 group-hover:w-20 group-hover:bg-accent-lifted"
                      />
                    </div>
                  </div>
                </BlurFade>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
