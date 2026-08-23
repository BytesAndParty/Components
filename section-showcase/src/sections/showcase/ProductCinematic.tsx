import { useState } from 'react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { Particles } from '@components/particles/particles'
import { ShinyText } from '@components/shiny-text/shiny-text'
import { AddToCartButton } from '@components/add-to-cart-button/add-to-cart-button'

/**
 * Cinematic Atmosphere — die Detailseite als Standbild aus dem Film. Wo
 * ProductV5 (Chiaroscuro) die Flasche ins Kerzenlicht vor flaches Warmschwarz
 * stellt, steht sie hier vor der Landschaft, aus der sie kommt: dieselbe
 * atmosphärische Fotografie wie HeroV3, darüber ein Verlauf ins Zinc.
 * Die Fiche liest sich als Abspann, mit Rollen-/Einstellungsnummer.
 */

export interface ProductCinematicProps {
  onBack?: () => void
}

const NOTES: Array<[string, string]> = [
  ['Auge', 'Helles Strohgelb, grüner Rand'],
  ['Nase', 'Weißer Pfirsich, nasser Stein, Zitronenzeste'],
  ['Gaumen', 'Straff, kühl, salziger Nachhall'],
  ['Ausbau', '9 Monate Feinhefe, großes Holz'],
  ['Alkohol', '12,5 % Vol. · trocken'],
  ['Trinkreife', 'Jetzt — 2035'],
]

const FORMATS = ['0,75 l', '1,5 l Magnum']

export function ProductCinematic({ onBack }: ProductCinematicProps) {
  const [format, setFormat] = useState(FORMATS[0])

  return (
    <section className="relative overflow-hidden bg-zinc-950 px-6 py-16 sm:py-24 lg:px-16 lg:py-32">
      {/* Die Landschaft hinter der Flasche — oben präsent, unten ins Zinc verlaufend */}
      <div className="absolute inset-x-0 top-0 z-0 h-[70vh]">
        <img
          src="https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1600&q=80"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-30 saturate-[1.15]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-zinc-950/60 via-zinc-950/85 to-zinc-950" />
      </div>

      <Particles
        particleColors={['#fff', 'var(--accent-lifted)']}
        particleCount={25}
        speed={0.06}
        className="pointer-events-none absolute inset-0 z-0 opacity-60"
      />

      {/* Ghost-Jahrgang */}
      <span
        aria-hidden="true"
        className="font-display pointer-events-none absolute top-24 left-1/2 z-0 -translate-x-1/2 text-[clamp(10rem,28vw,24rem)] leading-none font-light tracking-tighter text-white/[0.04] select-none"
      >
        ’21
      </span>

      <div className="relative z-10 mx-auto max-w-7xl">
        {onBack && (
          <BlurFade delay={50} direction="down" className="mb-14">
            <button
              type="button"
              onClick={onBack}
              className="group inline-flex min-h-11 items-center gap-3 text-[10px] font-bold tracking-[0.25em] text-zinc-400 uppercase transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-accent-lifted/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none"
            >
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>
              <span>Zurück ins Regal</span>
            </button>
          </BlurFade>
        )}

        <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2 lg:gap-24">
          {/* Die Flasche im kühlen Lichtkegel */}
          <BlurFade delay={150} direction="up">
            <figure className="relative mx-auto w-full max-w-md">
              <div className="flex aspect-3/4 items-end justify-center overflow-hidden bg-radial from-white/[0.07] via-white/[0.02] to-transparent">
                <img
                  src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=1200&q=80"
                  alt="Riesling Steinriegl 2021 — Flasche vor den Terrassen"
                  className="h-[92%] object-contain drop-shadow-[0_36px_48px_rgba(0,0,0,0.65)]"
                />
              </div>
              <figcaption className="mt-6 text-center text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                Rolle 03 · Einstellung 07 · Handgefüllt
              </figcaption>
            </figure>
          </BlurFade>

          {/* Der Abspann */}
          <div className="flex flex-col gap-11">
            <div>
              <BlurFade delay={250} direction="up">
                <span className="mb-4 block text-[10px] font-bold tracking-[0.4em] text-accent-lifted uppercase">
                  Ried Steinriegl · Einzellage
                </span>
              </BlurFade>
              <BlurFade delay={350} direction="up">
                <h2 className="font-display text-5xl leading-[1.04] font-medium tracking-tight text-white sm:text-6xl">
                  Riesling
                  <br />
                  <ShinyText
                    duration={9}
                    shineColor="color-mix(in oklch, var(--accent) 65%, white)"
                    className="inline-block!"
                  >
                    Steinriegl 2021
                  </ShinyText>
                </h2>
              </BlurFade>
            </div>

            <BlurFade delay={450} direction="up">
              <p className="max-w-lg text-lg leading-relaxed text-zinc-400">
                Gelesen an drei Vormittagen, immer bevor der Nebel abzog. Ein
                Wein, der nichts vorführt: erst Stein, dann Frucht, und ganz
                zuletzt das Salz, das bleibt.
              </p>
            </BlurFade>

            <BlurFade delay={550} direction="up">
              <dl className="grid grid-cols-1 border-t border-white/15 sm:grid-cols-2 sm:gap-x-12">
                {NOTES.map(([term, detail]) => (
                  <div
                    key={term}
                    className="flex items-baseline justify-between gap-6 border-b border-white/10 py-3.5"
                  >
                    <dt className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
                      {term}
                    </dt>
                    <dd className="text-right text-sm text-zinc-300">{detail}</dd>
                  </div>
                ))}
              </dl>
            </BlurFade>

            <BlurFade delay={650} direction="up">
              <div className="flex flex-col gap-5">
                <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                  Format
                </span>
                <div className="flex gap-8" role="group" aria-label="Flaschenformat wählen">
                  {FORMATS.map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFormat(f)}
                      aria-pressed={format === f}
                      className={`min-h-11 border-b pb-1 text-sm transition-all focus-visible:ring-2 focus-visible:ring-accent-lifted/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none ${
                        format === f
                          ? 'border-accent-lifted text-white'
                          : 'border-transparent text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </BlurFade>

            <BlurFade delay={750} direction="up" className="flex flex-wrap items-end gap-12">
              <div className="flex flex-col">
                <span className="mb-1 text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                  Ab Hof
                </span>
                <span className="font-display text-5xl font-medium tracking-tight text-white tabular-nums">
                  64,00 €
                </span>
              </div>
              <AddToCartButton
                bgColor="var(--accent-lifted)"
                textColor="#09090b"
                className="rounded-none! px-12! py-6! text-base!"
              />
            </BlurFade>

            <BlurFade delay={850} direction="up">
              <p className="font-display text-sm text-zinc-400 italic">
                Versand kühl und dunkel — so, wie der Wein den Sommer verbracht hat.
              </p>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  )
}
