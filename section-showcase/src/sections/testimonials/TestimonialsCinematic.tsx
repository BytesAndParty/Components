import { BlurFade } from '@components/blur-fade/blur-fade'
import { Particles } from '@components/particles/particles'
import { ShinyText } from '@components/shiny-text/shiny-text'

/**
 * Cinematic Atmosphere — ein zentriertes Leitzitat wie ein Filmzitat im
 * Abspann, die Merkzeile darin trägt ShinyText. Zwei stille Stimmen
 * darunter in Glas-Karten statt GlowCard (Section bleibt bewusst immer
 * dunkel, unabhängig vom Theme).
 *
 * Partikel bewusst dünn (25, zusätzlich gedimmt) — das dichte Feld gehört
 * Hero, CTA und Footer, sonst addieren sich die Sections zu Rauschen.
 */

// Der Shine liegt auf der Merkzeile, nicht auf dem ganzen Zitat: über vier
// Zeilen wird der Sweep zur Laufschrift und das Zitat schwer lesbar.
const FEATURED = {
  name: 'Marc-André Leclerc',
  role: 'Chef Sommelier · Le Bristol, Paris',
  lead: 'Man betritt den Keller und ',
  shine: 'die Zeit verlangsamt sich.',
  tail: ' Selten hat ein Ort so genau geschmeckt, wie er aussieht.',
}

const VOICES = [
  {
    name: 'Elena Rossi',
    role: 'Weinkritikerin · Decanter',
    content: 'Der Nebel über den Terrassen ist keine Kulisse. Man schmeckt ihn im Glas wieder.',
  },
  {
    name: 'Julian Schmidt',
    role: 'Sammler, Hamburg',
    content: 'Ich bin für einen Nachmittag gekommen und erst nach Sonnenuntergang gegangen.',
  },
]

export function TestimonialsCinematic() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 px-6 py-16 sm:py-28 lg:px-16 lg:py-36">
      <Particles
        particleColors={['#fff', 'var(--accent-lifted)']}
        particleCount={25}
        speed={0.07}
        className="pointer-events-none absolute inset-0 z-0 opacity-60"
      />

      <div className="relative z-10 mx-auto max-w-4xl">
        <BlurFade delay={100}>
          <h2 className="mb-8 block text-center text-[10px] font-bold tracking-[0.4em] text-accent-lifted uppercase">
            Was bleibt, wenn der Abend vorbei ist
          </h2>
        </BlurFade>

        {/* Featured quote — centered, like a film epigraph */}
        <BlurFade delay={250}>
          <figure className="relative flex flex-col items-center gap-8 text-center">
            <span
              aria-hidden="true"
              className="font-display pointer-events-none absolute -top-10 text-[8rem] leading-none font-light text-white/[0.06] select-none"
            >
              „
            </span>
            <blockquote className="font-display relative max-w-2xl text-2xl leading-snug font-medium tracking-tight text-white sm:text-4xl">
              {FEATURED.lead}
              <ShinyText duration={10} shineColor="color-mix(in oklch, var(--accent) 65%, white)">
                {FEATURED.shine}
              </ShinyText>
              {FEATURED.tail}
            </blockquote>
            <figcaption className="flex flex-col gap-1">
              <span className="font-display text-lg font-medium text-white">{FEATURED.name}</span>
              <span className="text-xs tracking-wider text-zinc-400 uppercase">{FEATURED.role}</span>
            </figcaption>
          </figure>
        </BlurFade>

        {/* Supporting voices */}
        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {VOICES.map((t, i) => (
            <BlurFade key={t.name} delay={550 + i * 150} direction="up">
              <figure className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm">
                <blockquote className="text-lg leading-relaxed font-light text-zinc-300 italic">
                  „{t.content}“
                </blockquote>
                <figcaption className="mt-6 flex flex-col gap-1 border-t border-white/10 pt-5">
                  <span className="font-display font-medium text-white">{t.name}</span>
                  <span className="text-xs tracking-wider text-zinc-400 uppercase">{t.role}</span>
                </figcaption>
              </figure>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
