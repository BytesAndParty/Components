import { BlurFade } from '@components/blur-fade/blur-fade'
import { ShinyText } from '@components/shiny-text/shiny-text'

/**
 * Nachtchronik — cinematic heritage as film scenes: each era is a wide,
 * heavily darkened image band; the year hangs over it in glowing serif
 * gold, and on hover the scene lifts out of the grade into warm color.
 * Warm black ground, candle-gold hairlines, end-title closing line.
 */

const SCENES = [
  {
    year: '1958',
    title: 'Szene I — Der erste Stein',
    text: 'Drei verwilderte Terrassen, ein Handschlag, kein Geld. Josef Buchart richtet die Mauern mit bloßen Händen.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1400&q=80',
    alt: 'Alte Trockensteinmauern in den Weinbergterrassen',
  },
  {
    year: '1974',
    title: 'Szene II — Das Gewölbe',
    text: 'Der Keller wird in den Berg getrieben. Zwölf Meter Urgestein über den Fässern, neun Grad — für immer.',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1400&q=80',
    alt: 'Fassreihen im dunklen Kellergewölbe',
  },
  {
    year: '1997',
    title: 'Szene III — Die Bibliothek',
    text: 'Von jedem Jahrgang bleiben dreihundert Flaschen im Haus. Verkauft wird daraus nie, verkostet selten.',
    image: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=1400&q=80',
    alt: 'Gläser und Flaschen im Kerzenlicht des Archivs',
  },
  {
    year: 'Heute',
    title: 'Letzte Szene — Achtzehn Fässer',
    text: 'Keine Expansion, kein Zukauf. So viel Wein, wie der Berg freiwillig hergibt — und keinen Liter mehr.',
    image: 'https://images.unsplash.com/photo-1543418219-44e30b057fea?w=1400&q=80',
    alt: 'Terrassen über der Donau im letzten Abendlicht',
  },
]

export function TimelineV5() {
  return (
    <section className="bg-[#0d0a09] px-6 py-16 sm:py-28 lg:px-16 lg:py-36">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <BlurFade delay={100} direction="down">
            <span className="mb-5 block text-[10px] font-bold tracking-[0.4em] text-[#c9a25e] uppercase">
              Nachtchronik · 1958 — Heute
            </span>
          </BlurFade>
          <BlurFade delay={220} direction="up">
            <h2 className="font-display text-5xl leading-[1.02] font-light tracking-tight text-[#f3ece0] sm:text-6xl">
              Vier Szenen aus
              <br />
              einem <span className="italic"><ShinyText duration={8} shineColor="#e8d5ae">Weinleben.</ShinyText></span>
            </h2>
          </BlurFade>
        </div>

        {/* Film scenes */}
        <ol className="mt-24 flex flex-col gap-24">
          {SCENES.map((scene, i) => (
            <li key={scene.year}>
              <BlurFade delay={200 + i * 120} direction="up">
                <article className="group relative">
                  {/* Scene band */}
                  <div className="relative overflow-hidden">
                    <img
                      src={scene.image}
                      alt={scene.alt}
                      loading="lazy"
                      className="aspect-[21/9] w-full object-cover opacity-45 grayscale transition-all duration-700 group-hover:scale-[1.02] group-hover:opacity-75 group-hover:grayscale-[0.3]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-linear-to-t from-[#0d0a09] via-transparent to-[#0d0a09]/60"
                    />
                    {/* Glowing year over the band */}
                    <span
                      aria-hidden="true"
                      className="font-display absolute bottom-4 left-6 text-[clamp(4rem,10vw,8rem)] leading-none font-light tracking-tighter text-[#e8d5ae]/90 italic drop-shadow-[0_0_36px_rgba(201,162,94,0.35)] lg:left-10"
                    >
                      {scene.year}
                    </span>
                    {/* Frame counter — top right like a film marker */}
                    <span className="absolute top-4 right-6 text-[9px] font-bold tracking-[0.35em] text-[#c9a25e]/70 uppercase lg:right-10">
                      Rolle {['I', 'II', 'III', 'IV'][i]} / IV
                    </span>
                  </div>

                  {/* Scene caption */}
                  <div className="mt-6 grid grid-cols-1 gap-3 border-t border-[#c9a25e]/20 pt-5 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-10">
                    <h3 className="text-[11px] font-bold tracking-[0.3em] text-[#e8d5ae] uppercase">
                      <span className="sr-only">{scene.year} — </span>
                      {scene.title}
                    </h3>
                    <p className="max-w-xl text-sm leading-relaxed font-light text-[#a89a85]">
                      {scene.text}
                    </p>
                  </div>
                </article>
              </BlurFade>
            </li>
          ))}
        </ol>

        <BlurFade delay={800}>
          <p className="mt-24 text-center font-display text-sm font-light text-[#6b5f50] italic">
            — Fortsetzung folgt, im Tempo des Berges. —
          </p>
        </BlurFade>
      </div>
    </section>
  )
}
