import { BlurFade } from '@components/blur-fade/blur-fade'
import { Particles } from '@components/particles/particles'
import { RevealImage } from '@components/reveal-image/reveal-image'
import { ShinyText } from '@components/shiny-text/shiny-text'

/**
 * Nocturne — features as three cellar scenes (cinematic line of HeroV8 /
 * ProductV5). Film stills in candle-gold hairline frames with lower-third
 * captions, a ghost roman numeral behind each, dust drifting through the
 * dark. Hover lifts the still and lets a little more light in.
 */

const SCENES = [
  {
    numeral: 'I',
    title: 'Neun Grad',
    data: 'Konstant · Sommer wie Winter',
    text: 'Die Kälte ist unser langsamster Mitarbeiter. Sie arbeitet, während wir schlafen — und sie macht keine Fehler.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=80',
    alt: 'Alte Steinmauern des Weinkellers im Dämmerlicht',
  },
  {
    numeral: 'II',
    title: 'Kein Licht',
    data: 'Zwölf Meter unter dem Berg',
    text: 'Dunkelheit nimmt dem Wein die Eile. Die Farbe bleibt, die Frucht bleibt — nur die Hektik geht.',
    image: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=900&q=80',
    alt: 'Weinglas im Gegenlicht einer einzelnen Kellerlampe',
  },
  {
    numeral: 'III',
    title: 'Stille',
    data: 'Achtzehn Fässer · kein Wort',
    text: 'Hier unten wird nicht probiert, nicht gemessen, nicht geredet. Der Keller meldet sich, wenn es so weit ist.',
    image: 'https://images.unsplash.com/photo-1543418219-44e30b057fea?w=900&q=80',
    alt: 'Terrassen-Weinberg in der Abenddämmerung über dem Keller',
  },
]

export function FeaturesV8() {
  return (
    <section className="relative overflow-hidden bg-[#0d0a09] px-6 py-16 sm:py-28 lg:px-16 lg:py-36">
      {/* Dust in the dark */}
      <Particles
        particleColors={['#e8d5ae', '#c9a25e']}
        particleCount={70}
        speed={0.06}
        particleBaseSize={50}
        className="pointer-events-none absolute inset-0 z-0"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header — kicker + headline left, intro right */}
        <div className="grid grid-cols-1 gap-8 border-b border-[#c9a25e]/15 pb-12 lg:grid-cols-2 lg:items-end">
          <div>
            <BlurFade delay={100} direction="down">
              <span className="mb-5 block text-[10px] font-bold tracking-[0.4em] text-[#c9a25e] uppercase">
                Kapitel Nacht · Drei Gründe
              </span>
            </BlurFade>
            <BlurFade delay={220} direction="up">
              <h2 className="font-display text-5xl leading-[1.02] font-light tracking-tight text-[#f3ece0] sm:text-6xl">
                Der Keller arbeitet
                <br />
                <span className="italic"><ShinyText duration={8} shineColor="#c9a25e">nachts.</ShinyText></span>
              </h2>
            </BlurFade>
          </div>
          <BlurFade delay={340} direction="up">
            <p className="max-w-md text-lg leading-relaxed font-light text-[#a89a85] lg:ml-auto">
              Was unsere Weine können, lernen sie im Dunkeln: bei neun Grad,
              ohne Licht und ohne Publikum. Drei Szenen aus dem Untergeschoss.
            </p>
          </BlurFade>
        </div>

        {/* Scene triptych */}
        <div className="mt-16 grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {SCENES.map((scene, i) => (
            <BlurFade key={scene.numeral} delay={300 + i * 150} direction="up">
              <article className="group relative flex h-full flex-col">
                {/* Ghost numeral behind the still */}
                <span
                  aria-hidden="true"
                  className="font-display pointer-events-none absolute -top-12 right-0 z-0 text-8xl leading-none font-light tracking-tighter text-[#c9a25e]/[0.08] italic select-none"
                >
                  {scene.numeral}
                </span>

                {/* Film still in a hairline frame */}
                <div className="relative z-10 border border-[#c9a25e]/20 transition-all duration-500 group-hover:-translate-y-2 group-hover:border-[#c9a25e]/40 group-hover:shadow-[0_24px_60px_-24px_rgba(201,162,94,0.3)]">
                  <RevealImage
                    src={scene.image}
                    alt={scene.alt}
                    direction="up"
                    delay={i * 180}
                    duration={1400}
                    className="aspect-[4/5] w-full"
                    imgClassName="opacity-75"
                  />
                  {/* Chiaroscuro grade + hover light — veil fades, still brightens */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[#0d0a09]/35 transition-opacity duration-700 group-hover:opacity-0"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0d0a09]/85 via-transparent to-[#0d0a09]/30"
                  />
                  {/* Lower-third caption */}
                  <span className="absolute bottom-4 left-4 text-[9px] font-bold tracking-[0.3em] text-[#e8d5ae]/80 uppercase">
                    Szene {scene.numeral} · {scene.data}
                  </span>
                </div>

                <h3 className="font-display mt-8 text-3xl font-light tracking-tight text-[#f3ece0]">
                  {scene.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed font-light text-[#a89a85]">
                  {scene.text}
                </p>
              </article>
            </BlurFade>
          ))}
        </div>

        {/* Credits line */}
        <BlurFade delay={800} direction="up">
          <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-[#c9a25e]/15 pt-8">
            <span className="font-display text-sm font-light text-[#6b5f50] italic">
              Fortsetzung: der Nachtverkauf, ein Stockwerk tiefer.
            </span>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#6b5f50] uppercase">
              Kap. II / IV
            </span>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
